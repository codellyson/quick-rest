import { useRequestStore } from "../../stores/use-request-store";
import { useEnvironmentStore } from "../../stores/use-environment-store";
import { useP2PStore } from "../../stores/use-p2p-store";
import { extractVariables } from "../../utils/variables";
import { cn } from "../../utils/cn";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

export const URLInput = () => {
  const { url, setUrl, params, setParams } = useRequestStore();
  const { getVariables } = useEnvironmentStore();
  const { setEditingField } = useP2PStore();
  const variables = getVariables();
  const extractedVars = extractVariables(url);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const extractTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const availableVars = Object.keys(variables).filter((key) =>
    key.toLowerCase().includes(suggestionFilter.toLowerCase())
  );

  const extractParamsFromUrl = (urlValue: string) => {
    try {
      const queryIndex = urlValue.indexOf('?');
      const baseUrl = queryIndex !== -1 ? urlValue.substring(0, queryIndex) : urlValue;
      
      // Extract path parameters (e.g., /users/{{id}} or /users/:id)
      const pathParams: Array<{ key: string; value: string }> = [];
      const pathParamRegex = /\{\{(\w+)\}\}|:(\w+)/g;
      let match;
      
      while ((match = pathParamRegex.exec(baseUrl)) !== null) {
        const paramName = match[1] || match[2]; // Support both {{id}} and :id syntax
        if (paramName && !pathParams.some(p => p.key === paramName)) {
          pathParams.push({ key: paramName, value: '' });
        }
      }

      // Extract query parameters
      const queryParams: Array<{ key: string; value: string }> = [];
      if (queryIndex !== -1) {
        const queryString = urlValue.substring(queryIndex + 1);
        if (queryString.trim()) {
          const urlParams = new URLSearchParams(queryString);
          urlParams.forEach((value, key) => {
            queryParams.push({ key, value });
          });
        }
      }

      // Combine path and query params
      const allExtractedParams = [...pathParams, ...queryParams];
      
      if (allExtractedParams.length === 0) {
        // If no params found, check if we should clear existing params
        if (params.length > 0 && params.some(p => p.key && p.value)) {
          const hasCommonParamNames = params.some(p => 
            ['page', 'limit', 'offset', 'sort', 'filter', 'search', 'q'].includes(p.key.toLowerCase())
          );
          if (hasCommonParamNames) {
            setParams([]);
          }
        }
        return;
      }

      // Convert to KeyValuePair format
      const extractedParams: typeof params = [];
      let idCounter = Date.now();
      
      allExtractedParams.forEach(({ key, value }) => {
        extractedParams.push({
          id: (idCounter++).toString(),
          key,
          value,
          enabled: true,
        });
      });

      if (extractedParams.length > 0) {
        // Only update if params are different to avoid loops
        const currentParamsStr = JSON.stringify(params.map(p => ({ key: p.key, value: p.value })).sort((a, b) => a.key.localeCompare(b.key)));
        const extractedParamsStr = JSON.stringify(extractedParams.map(p => ({ key: p.key, value: p.value })).sort((a, b) => a.key.localeCompare(b.key)));
        
        if (currentParamsStr !== extractedParamsStr) {
          setParams(extractedParams);
        }
      }
    } catch (error) {
      // Silently fail if URL parsing fails
    }
  };

  const handleInputChange = (value: string) => {
    setUrl(value);
    const input = inputRef.current;
    if (!input) return;

    const cursor = input.selectionStart || 0;
    setCursorPosition(cursor);

    const textBeforeCursor = value.substring(0, cursor);
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{{");

    if (lastOpenBrace !== -1) {
      const textAfterBrace = textBeforeCursor.substring(lastOpenBrace + 2);
      const hasClosingBrace = textAfterBrace.includes("}}");

      if (!hasClosingBrace) {
        setShowSuggestions(true);
        setSuggestionFilter(textAfterBrace);
        setSelectedIndex(0);
        return;
      }
    }

    setShowSuggestions(false);
    
    // Auto-extract params from URL with debounce to avoid disrupting typing
    if (extractTimeoutRef.current) {
      clearTimeout(extractTimeoutRef.current);
    }
    
    extractTimeoutRef.current = setTimeout(() => {
      extractParamsFromUrl(value);
    }, 800);
  };

  const insertVariable = (varName: string) => {
    const input = inputRef.current;
    if (!input) return;

    const textBeforeCursor = url.substring(0, cursorPosition);
    const textAfterCursor = url.substring(cursorPosition);
    const lastOpenBrace = textBeforeCursor.lastIndexOf("{{");

    if (lastOpenBrace !== -1) {
      const beforeBrace = url.substring(0, lastOpenBrace);
      const newUrl = `${beforeBrace}{{${varName}}}${textAfterCursor}`;
      setUrl(newUrl);
      setShowSuggestions(false);

      setTimeout(() => {
        const newPosition = lastOpenBrace + varName.length + 4;
        input.focus();
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || availableVars.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % availableVars.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + availableVars.length) % availableVars.length
      );
    } else if (e.key === "Enter" && showSuggestions) {
      e.preventDefault();
      if (availableVars[selectedIndex]) {
        insertVariable(availableVars[selectedIndex]);
      }
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (extractTimeoutRef.current) {
        clearTimeout(extractTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="flex-1 relative">
      <input
        ref={inputRef}
        value={url}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setEditingField('url', true)}
        onBlur={() => setEditingField('url', false)}
        placeholder="https://api.example.com/users"
        className={cn(
          "w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 rounded-lg",
          "bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100",
          "placeholder:text-zinc-400",
          "focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:focus:ring-zinc-100 focus:border-zinc-900 dark:focus:border-zinc-100",
          "transition-colors duration-150",
          "font-mono",
          "pr-4"
        )}
      />

      {showSuggestions && availableVars.length > 0 && (
        <div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg shadow-lg max-h-48 overflow-auto">
          {availableVars.map((varName, index) => (
            <button
              key={varName}
              onClick={() => insertVariable(varName)}
              className={cn(
                "w-full px-3 py-2 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors",
                index === selectedIndex && "bg-zinc-100 dark:bg-zinc-800"
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-zinc-900 dark:text-zinc-100">
                  {varName}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 truncate ml-2 max-w-[200px]">
                  {variables[varName]}
                </span>
              </div>
            </button>
          ))}
        </div>
      )}

      {extractedVars.length > 0 && !showSuggestions && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
          {extractedVars.map((varName) => (
            <span
              key={varName}
              className={cn(
                "px-1.5 py-0.5 text-xs rounded",
                variables[varName]
                  ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
                  : "bg-zinc-50 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-500"
              )}
              title={
                variables[varName]
                  ? `Value: ${variables[varName]}`
                  : "Variable not set"
              }
            >
              {`{{${varName}}}`}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

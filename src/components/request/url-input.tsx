import { useRequestStore } from "../../stores/use-request-store";
import { useEnvironmentStore } from "../../stores/use-environment-store";
import { extractVariables } from "../../utils/variables";
import { cn } from "../../utils/cn";
import { useState, useRef, useEffect, KeyboardEvent } from "react";

export const URLInput = () => {
  const { url, setUrl } = useRequestStore();
  const { getVariables } = useEnvironmentStore();
  const variables = getVariables();
  const extractedVars = extractVariables(url);
  const inputRef = useRef<HTMLInputElement>(null);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestionFilter, setSuggestionFilter] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);

  const availableVars = Object.keys(variables).filter((key) =>
    key.toLowerCase().includes(suggestionFilter.toLowerCase())
  );

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex-1 relative">
      <input
        ref={inputRef}
        value={url}
        onChange={(e) => handleInputChange(e.target.value)}
        onKeyDown={handleKeyDown}
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

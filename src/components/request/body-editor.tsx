'use client';

import { useRequestStore } from "../../stores/use-request-store";
import { useP2PStore } from "../../stores/use-p2p-store";
import { CodeEditor } from "../ui/code-editor";
import { cn } from "../../utils/cn";

export const BodyEditor = () => {
  const { bodyType, body, setBodyType, setBody } = useRequestStore();
  const { setEditingField } = useP2PStore();

  // useEffect(() => {
  //   setBodyType("json");
  // }, []);

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        {(["none", "json", "raw", "form-data"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setBodyType(type)}
            className={cn(
              "px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-150",
              bodyType === type
                ? "bg-zinc-900 text-white"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            )}
          >
            {type === "form-data"
              ? "Form Data"
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>
      {bodyType !== "none" && (
        <div>
          {bodyType === "json" || bodyType === "raw" ? (
            <CodeEditor
              value={body}
              onChange={(value) => setBody(value || "")}
              onFocus={() => setEditingField('body', true)}
              onBlur={() => setEditingField('body', false)}
              language={bodyType === "json" ? "json" : "text"}
              height="calc(100vh - 200px)"
            />
          ) : (
            <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50 dark:bg-zinc-900">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Form data editor coming soon
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

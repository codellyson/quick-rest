'use client';

import { useRequestStore } from "../../stores/use-request-store";
import { CodeEditor } from "../ui/code-editor";
import { cn } from "../../utils/cn";

export const BodyEditor = () => {
  const { bodyType, body, setBodyType, setBody } = useRequestStore();

  return (
    <div className="space-y-3">
      <div className="inline-flex p-0.5 bg-bg-secondary rounded-md">
        {(["none", "json", "raw", "form-data"] as const).map((type) => (
          <button
            key={type}
            onClick={() => setBodyType(type)}
            className={cn(
              "px-3 py-1 text-xs font-medium rounded transition-colors",
              bodyType === type
                ? "bg-bg text-primary shadow-sm"
                : "text-secondary hover:text-primary"
            )}
          >
            {type === "form-data" ? "Form data" : type === "none" ? "None" : type.toUpperCase()}
          </button>
        ))}
      </div>
      {bodyType !== "none" && (
        <div>
          {bodyType === "json" || bodyType === "raw" ? (
            <CodeEditor
              value={body}
              onChange={(value) => setBody(value || "")}
              language={bodyType === "json" ? "json" : "text"}
              height="calc(100vh - 200px)"
            />
          ) : (
            <div className="p-4 border border-border rounded-md bg-bg-secondary">
              <p className="text-sm text-secondary">
                Form data editor coming soon
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

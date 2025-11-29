import { Editor } from "@monaco-editor/react";
import { cn } from "../../utils/cn";

interface CodeEditorProps {
  value: string;
  onChange?: (value: string | undefined) => void;
  language?: string;
  readOnly?: boolean;
  height?: string;
  className?: string;
}

export const CodeEditor = ({
  value,
  onChange,
  language = "json",
  readOnly = false,
  height = "400px",
  className,
}: CodeEditorProps) => {
  const editorHeight = height === "100%" ? "100%" : height;

  return (
    <div
      className={cn(
        "border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden",
        height === "100%" && "h-full",
        className
      )}
    >
      <Editor
        height={editorHeight}
        language={language}
        value={value}
        onChange={onChange}
        theme="vs-dark"
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "off",
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          tabSize: 2,
          formatOnPaste: true,
          formatOnType: true,
        }}
      />
    </div>
  );
};

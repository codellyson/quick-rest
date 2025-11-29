import { useState, useRef, useEffect } from "react";
import { cn } from "../../utils/cn";

interface ResizableDividerProps {
  onResize: (leftWidth: number) => void;
  className?: string;
}

export const ResizableDivider = ({
  onResize,
  className,
}: ResizableDividerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const dividerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const container = dividerRef.current?.parentElement;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const newLeftWidth = e.clientX - containerRect.left;
      const minWidth = 300;
      const maxWidth = containerRect.width - 300;

      if (newLeftWidth >= minWidth && newLeftWidth <= maxWidth) {
        onResize(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    if (isDragging) {
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, onResize]);

  return (
    <div
      ref={dividerRef}
      onMouseDown={() => setIsDragging(true)}
      className={cn(
        "w-1 bg-zinc-200 dark:bg-zinc-800 cursor-col-resize hover:bg-zinc-400 dark:hover:bg-zinc-600 transition-colors relative group flex items-center justify-center",
        isDragging && "bg-zinc-500 dark:bg-zinc-500",
        className
      )}
    >
      <div className="absolute inset-y-0 -left-2 -right-2" />
      <div className="absolute inset-y-1/2 -translate-y-1/2 flex flex-col gap-1 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-0.5 h-1 bg-zinc-500 dark:bg-zinc-400 rounded-full" />
        <div className="w-0.5 h-1 bg-zinc-500 dark:bg-zinc-400 rounded-full" />
        <div className="w-0.5 h-1 bg-zinc-500 dark:bg-zinc-400 rounded-full" />
      </div>
    </div>
  );
};


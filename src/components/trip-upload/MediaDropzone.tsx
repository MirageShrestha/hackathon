import { useRef, useState } from "react";
import { Film, ImagePlus, UploadCloud } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MediaDropzoneProps {
  accept: string;
  description: string;
  kind: "photo" | "video";
  onFilesSelected: (files: File[]) => void | Promise<void>;
}

export const MediaDropzone = ({ accept, description, kind, onFilesSelected }: MediaDropzoneProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const Icon = kind === "photo" ? ImagePlus : Film;

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList?.length) return;
    onFilesSelected(Array.from(fileList));
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDragging(false);
        handleFiles(event.dataTransfer.files);
      }}
      className={cn(
        "rounded-3xl border border-dashed p-6 transition-all",
        isDragging
          ? "border-primary bg-primary/5 shadow-[0_12px_30px_-24px_rgba(15,23,42,0.95)]"
          : "border-border bg-gradient-to-br from-white via-secondary/40 to-accent/20",
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(event) => handleFiles(event.target.files)}
      />
      <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">
              Drag and drop {kind === "photo" ? "photos" : "reels"} here
            </p>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <Button type="button" variant="outline" className="rounded-2xl" onClick={() => inputRef.current?.click()}>
          <UploadCloud className="mr-2 h-4 w-4" />
          Choose files
        </Button>
      </div>
    </div>
  );
};

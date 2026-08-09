"use client";

import { useState, useRef, useCallback } from "react";
import { exportProgressEncrypted, importProgressEncrypted } from "@/stores/gameStore";
import { useGameStore } from "@/hooks/useGameStore";

export function ProgressSync() {
  const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refreshPlayer } = useGameStore();

  const handleExport = useCallback(async () => {
    setIsExporting(true);
    try {
      const data = await exportProgressEncrypted();
      const blob = new Blob([data], { type: "application/octet-stream" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `pattern-quest-save-${new Date().toISOString().split("T")[0]}.pqsave`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } finally {
      setIsExporting(false);
    }
  }, []);

  const handleImport = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (readEvent) => {
      const text = readEvent.target?.result as string;
      const result = await importProgressEncrypted(text);
      if (result.success) {
        setImportStatus("success");
        refreshPlayer();
        setTimeout(() => setImportStatus("idle"), 3000);
      } else {
        setImportStatus("error");
        setErrorMessage(result.error ?? "Unknown error");
        setTimeout(() => setImportStatus("idle"), 4000);
      }
    };
    reader.readAsText(file);

    event.target.value = "";
  }, [refreshPlayer]);

  return (
    <div className="rounded-xl p-[1px] bg-gradient-to-br from-[var(--border-muted)] via-[var(--border-subtle)] to-[var(--border-muted)]">
      <div className="rounded-[11px] bg-[var(--surface-raised)] p-5">
        <div className="flex items-center gap-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--accent-blue)]">
            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--accent-blue)]">
            Cross-Device Sync
          </span>
        </div>
        <p className="text-[11px] text-[var(--text-muted)] mb-4 leading-[1.7]">
          Export your encrypted save file and import it on another device. Save files are protected against tampering.
        </p>

        <div className="flex gap-2">
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 py-2 px-3 rounded-lg bg-[var(--accent-teal)]/10 border border-[var(--accent-teal)]/30 text-[var(--accent-teal)] text-[11px] font-semibold hover:bg-[var(--accent-teal)]/20 transition-all disabled:opacity-50"
          >
            {isExporting ? "Encrypting..." : "Export Save"}
          </button>
          <button
            onClick={handleImport}
            className="flex-1 py-2 px-3 rounded-lg bg-[var(--accent-blue)]/10 border border-[var(--accent-blue)]/30 text-[var(--accent-blue)] text-[11px] font-semibold hover:bg-[var(--accent-blue)]/20 transition-all"
          >
            Import Save
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pqsave,.json"
          onChange={handleFileChange}
          className="hidden"
        />

        {importStatus === "success" && (
          <p className="mt-3 text-[10px] font-semibold text-[var(--accent-green)]">
            Progress imported successfully! Page will update.
          </p>
        )}
        {importStatus === "error" && (
          <p className="mt-3 text-[10px] font-semibold text-[var(--accent-pink)]">
            Import failed: {errorMessage}
          </p>
        )}
      </div>
    </div>
  );
}

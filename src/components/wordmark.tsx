import { ScanSearchIcon } from "lucide-react";

/**
 * The app icon: a blue tile with a magnifier over a document, the way an iOS app icon looks.
 */
export function AppIcon({ className = "size-7", glyph = "size-4" }: { className?: string; glyph?: string }) {
  return (
    <span className={`app-icon grid shrink-0 place-items-center rounded-[22.5%] text-white ${className}`} aria-hidden="true">
      <ScanSearchIcon className={glyph} strokeWidth={2.2} />
    </span>
  );
}

export function Wordmark() {
  return (
    <span className="flex items-center gap-2">
      <AppIcon />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">Rastro</span>
    </span>
  );
}

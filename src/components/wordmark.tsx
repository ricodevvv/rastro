export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-semibold tracking-tight ${className}`}>
      rastro<span className="text-accent">.</span>
    </span>
  );
}

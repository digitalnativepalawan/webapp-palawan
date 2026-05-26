import { X, Activity } from "lucide-react";
import { useEffect, useState } from "react";

const STATIC_BUILD_ID =
  (import.meta as unknown as { env?: Record<string, string> }).env?.VITE_BUILD_ID || "";

type RuntimeError = { msg: string; at: string };

export default function PreviewHealth() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(true);
  const [buildId, setBuildId] = useState(STATIC_BUILD_ID);
  const [loaded, setLoaded] = useState(false);
  const [loadedAt, setLoadedAt] = useState<string | null>(null);
  const [errors, setErrors] = useState<RuntimeError[]>([]);
  const [inIframe, setInIframe] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!STATIC_BUILD_ID) {
      setBuildId(new Date().toISOString().slice(0, 19).replace("T", " "));
    }
    try {
      setInIframe(window.self !== window.top);
    } catch {
      setInIframe(true);
    }

    const markLoaded = () => {
      setLoaded(true);
      setLoadedAt(new Date().toLocaleTimeString());
    };
    if (document.readyState === "complete") markLoaded();
    else window.addEventListener("load", markLoaded, { once: true });

    const onError = (e: ErrorEvent) => {
      setErrors((prev) =>
        [...prev, { msg: e.message || String(e.error), at: new Date().toLocaleTimeString() }].slice(-10),
      );
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const reason = e.reason;
      const msg =
        reason instanceof Error ? reason.message : typeof reason === "string" ? reason : JSON.stringify(reason);
      setErrors((prev) => [...prev, { msg, at: new Date().toLocaleTimeString() }].slice(-10));
    };
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("load", markLoaded);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  // Avoid SSR/CSR hydration mismatch — only render after client mount.
  if (!mounted) return null;

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open preview health"
        className="fixed bottom-3 right-3 z-[9999] border border-line bg-background/90 backdrop-blur p-2 text-ink-dim hover:text-accent hover:border-accent transition-colors"
      >
        <Activity className="w-3.5 h-3.5" />
      </button>
    );
  }

  const statusColor = errors.length > 0 ? "text-red-400" : loaded ? "text-green-400" : "text-yellow-400";
  const statusLabel = errors.length > 0 ? "DEGRADED" : loaded ? "HEALTHY" : "LOADING";

  return (
    <div
      className="fixed bottom-3 right-3 z-[9999] w-[300px] border border-line bg-background/95 backdrop-blur text-[10px] font-mono uppercase tracking-[0.12em] shadow-lg"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-center justify-between border-b border-line px-2.5 py-1.5">
        <div className="flex items-center gap-1.5 text-ink-dim">
          <Activity className="w-3 h-3" />
          <span>Preview Health</span>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="text-ink-mute hover:text-accent"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="px-2.5 py-2 space-y-1.5">
        <Row label="Status" value={<span className={statusColor}>{statusLabel}</span>} />
        <Row label="Iframe" value={inIframe ? "EMBEDDED" : "TOP-LEVEL"} />
        <Row label="Loaded" value={loaded ? loadedAt ?? "YES" : "PENDING"} />
        <Row label="Build" value={<span className="normal-case tracking-normal">{BUILD_ID}</span>} />
        <Row label="Errors" value={String(errors.length)} />
      </div>
      {errors.length > 0 && (
        <div className="border-t border-line px-2.5 py-2 max-h-32 overflow-auto space-y-1">
          {errors.map((e, i) => (
            <div key={i} className="text-red-400 normal-case tracking-normal text-[10px] leading-tight">
              <span className="text-ink-mute">[{e.at}]</span> {e.msg}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-ink-mute">{label}</span>
      <span className="text-ink truncate max-w-[180px] text-right">{value}</span>
    </div>
  );
}
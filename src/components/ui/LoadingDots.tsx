export default function LoadingDots({ label = "AI is thinking" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 text-text-muted text-sm">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-bounce"
            style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
          />
        ))}
      </div>
      <span>{label}…</span>
    </div>
  );
}

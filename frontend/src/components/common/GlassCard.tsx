type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <div
      className={`rounded-3xl border border-white/50 bg-white/25 shadow-2xl shadow-[#4B3F8C]/10 backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
}

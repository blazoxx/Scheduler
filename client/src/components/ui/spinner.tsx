type Props = {
  className?: string;
  label?: string;
};

export default function Spinner({ className = "", label = "Loading" }: Props) {
  return (
    <div className={`inline-flex items-center gap-3 text-sm text-slate-600 ${className}`}>
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-teal-600" />
      <span>{label}</span>
    </div>
  );
}
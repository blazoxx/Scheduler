type Props = {
  name: string;
  imageUrl?: string | null;
  className?: string;
};

export default function Avatar({ name, imageUrl, className = "" }: Props) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`h-12 w-12 rounded-2xl object-cover ${className}`}
      />
    );
  }

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white ${className}`}
      aria-label={name}
    >
      {initials || "S"}
    </div>
  );
}
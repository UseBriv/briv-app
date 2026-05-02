type Props = {
  size?: number;
  strokeWidth?: number;
  className?: string;
};

export function CheckIcon({ size = 14, strokeWidth = 3, className }: Props) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

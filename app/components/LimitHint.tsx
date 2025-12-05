interface LimitHintProps {
  show: boolean;
  max: number;
}

export function LimitHint({ show, max }: LimitHintProps) {
  if (!show) return null;
  return (
    <div className="absolute left bottom text-xs text-white/50">
      Достигнут лимит символов {max}
    </div>
  );
}

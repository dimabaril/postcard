interface ShareButtonProps {
  onClick: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function ShareButton({
  onClick,
  disabled = false,
  loading = false,
}: ShareButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-600 disabled:cursor-wait text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
    >
      {loading ? "Создание..." : "Отправить"}
    </button>
  );
}

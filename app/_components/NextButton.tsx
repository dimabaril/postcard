interface NextButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export function NextButton({
  onClick,
  disabled = false,
  children,
}: NextButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="font-miroslav cursor-pointer bg-[#D37F9A] text-white disabled:bg-gray-400 disabled:text-gray-300 text-3xl h-16 w-63 rounded-full shadow-lg transition-transform active:scale-95"
    >
      {children}
    </button>
  );
}

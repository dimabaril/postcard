interface NameInputProps {
  placeholder: string;
  value: string;
  maxLength: number;
  onChange: (value: string) => void;
}

export function NameInput({
  placeholder,
  value,
  maxLength,
  onChange,
}: NameInputProps) {
  return (
    <div className="w-full relative">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={maxLength}
        className="font-open-sans-condensed w-full h-12 px-4 rounded bg-[#7FAECC] border-none text-white text-2xl placeholder-white/60"
      />
    </div>
  );
}

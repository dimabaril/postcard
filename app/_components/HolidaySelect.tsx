import { ChangeEvent } from "react";

interface Option {
  id: number;
  label: string;
}

interface HolidaySelectProps {
  value: number;
  options: Option[];
  onChange: (id: number) => void;
}

export function HolidaySelect({
  value,
  options,
  onChange,
}: HolidaySelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className="w-full flex items-center rounded border border-white relative">
      <select
        value={value}
        onChange={handleChange}
        className="font-open-sans-condensed w-full h-12 pl-4 pr-11 bg-transparent text-white text-2xl focus:outline-none appearance-none cursor-pointer"
      >
        {options.map((holiday) => (
          <option key={holiday.id} value={holiday.id}>
            {holiday.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-3 w-5 h-5 text-white pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    </div>
  );
}

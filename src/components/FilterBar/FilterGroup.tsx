interface FilterGroupProps<T extends string> {
  label: string;
  options: { label: string; value: T }[];
  selected: T[];
  onToggle: (value: T) => void;
}

export default function FilterGroup<T extends string>({ label, options, selected, onToggle }: FilterGroupProps<T>) {
  return (
    <div className="flex flex-col gap-2.5">
      <span className="text-xs font-bold tracking-wider text-gray-400 uppercase">{label}</span>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`group flex cursor-pointer items-center gap-2 rounded-md py-1 transition-all`}
          >
            <div className="relative flex items-center">
              <input
                type="checkbox"
                checked={selected.includes(option.value)}
                onChange={() => onToggle(option.value)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 transition-all checked:border-blue-500 checked:bg-blue-500 hover:border-blue-400 focus:outline-none"
              />
              <svg
                className="pointer-events-none absolute h-4 w-4 scale-0 text-white transition-transform peer-checked:scale-100"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span
              className={`text-sm font-medium transition-colors ${
                selected.includes(option.value) ? 'text-gray-900' : 'text-gray-500 group-hover:text-gray-700'
              }`}
            >
              {option.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

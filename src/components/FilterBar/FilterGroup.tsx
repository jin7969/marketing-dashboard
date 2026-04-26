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
          <label key={option.value} className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

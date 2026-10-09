import { useEffect, useState } from 'react';
import { fetchCompanies } from '../api/quotes';
import { useDebounce } from '../hooks/useDebounce';

type Props = {
  value: string;
  onSelect: (company: string) => void;
};

export function CompanySearch({ value, onSelect }: Props) {
  const [text, setText] = useState(value);
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const debounced = useDebounce(text, 300);

  useEffect(() => {
    if (!debounced) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController()
    fetchCompanies(debounced , controller.signal).then(setSuggestions);

    return () => controller.abort()
  }, [debounced]);

  return (
    <div className="field company-search">
      <label htmlFor="company">شرکت بیمه</label>
      <input
        id="company"
        value={text}
        placeholder="مثلاً پارسیان"
        autoComplete="off"
        onChange={(e) => {
          setText(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
      />
      {value && (
        <button
          className="link"
          onClick={() => {
            setText('');
            onSelect('');
          }}
        >
          حذف فیلتر «{value}»
        </button>
      )}
      {open && suggestions.length > 0 && (
        <ul className="suggestions">
          {suggestions.map((name) => (
            <li key={name}>
              <button
                onClick={() => {
                  setText(name);
                  setOpen(false);
                  onSelect(name);
                }}
              >
                بیمه {name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

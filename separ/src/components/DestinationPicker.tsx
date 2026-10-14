import { useMemo, useState } from 'react';
import { AIRPORTS } from '../data/airports';

type Props = { value: string; onChange: (code: string) => void };

export function DestinationPicker({ value, onChange }: Props) {
  const [text, setText] = useState('');
  const matches = useMemo(() => {
    if (text.trim().length < 2) return [];
    return AIRPORTS.filter((a) => a.city.includes(text) || a.country.includes(text) || a.code === text.toUpperCase()).slice(0, 6);
  }, [text]);
  const selected = AIRPORTS.find((a) => a.code === value);

  return (
    <div className="picker">
      <input
        id="destination"
        placeholder="شهر، کشور یا کد فرودگاه"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      {matches.length > 0 && (
        <ul className="suggestions">
          {matches.map((a) => (
            <li key={a.code}>
              <button
                type="button"
                onClick={() => {
                  onChange(a.code);
                  setText('');
                }}
              >
                {a.city} ({a.country}) · {a.code}
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && (
        <p className="muted">
          مقصد: {selected.city}، {selected.country} ({selected.code})
        </p>
      )}
    </div>
  );
}

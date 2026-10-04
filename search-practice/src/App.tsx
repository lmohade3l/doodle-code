import { useState } from 'react';
import { SearchFetch } from './SearchFetch';
import { SearchAxios } from './SearchAxios';
import { SearchQuery } from './SearchQuery';

const TABS = [
  { id: 'fetch', title: '۱. fetch خالی', Component: SearchFetch },
  { id: 'axios', title: '۲. axios', Component: SearchAxios },
  { id: 'query', title: '۳. React Query', Component: SearchQuery },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [active, setActive] = useState<TabId>('fetch');
  const Active = TABS.find((t) => t.id === active)!.Component;

  return (
    <main className="container">
      <h1>جستجوی مدل خودرو</h1>
      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={t.id === active ? 'tab tab--active' : 'tab'}
            onClick={() => setActive(t.id)}
          >
            {t.title}
          </button>
        ))}
      </nav>
      <Active />
    </main>
  );
}

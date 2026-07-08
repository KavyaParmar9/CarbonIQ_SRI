import { motion } from 'framer-motion';
import { useState } from 'react';

type HeaderProps = {
  activePage: string;
  setActivePage: (page: string) => void;
  toggleTheme: () => void;
  theme: 'light' | 'dark';
};

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'dashboard', label: 'Analysis' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'report-generator', label: 'Report Generator' },
  { id: 'research', label: 'Research' },
  { id: 'about', label: 'About' },
];

export default function Header({ activePage, setActivePage, toggleTheme, theme }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="border-b border-slate-200/70 bg-slate-50/90 text-slate-900 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/90 dark:text-slate-100">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <button
            onClick={() => setActivePage('home')}
            className="text-lg font-semibold tracking-tight text-slate-900 dark:text-white sm:text-xl"
          >
            CarbonIQ
          </button>
          <p className="text-sm text-slate-600 dark:text-slate-400">Industrial carbon research</p>
        </div>

        <nav className="hidden items-center gap-2 md:flex">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`rounded-full px-3 py-2 text-sm font-medium transition sm:px-4 ${
                activePage === item.id
                  ? 'bg-slate-200 text-slate-900 shadow-glow dark:bg-slate-800 dark:text-white'
                  : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button onClick={() => setMobileOpen((s: boolean) => !s)} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-300 text-sm font-medium dark:border-slate-700">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200/80 bg-slate-100 px-3 text-sm text-slate-900 transition hover:border-slate-400 dark:border-slate-700/80 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-500 sm:px-4"
          >
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
        </div>
      </div>
      {mobileOpen && (
        <div className="border-t border-slate-200/70 bg-slate-50/90 p-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <button
                key={`m-${item.id}`}
                onClick={() => {
                  setActivePage(item.id);
                  setMobileOpen(false);
                }}
                className={`text-left rounded-2xl px-3 py-2 text-sm ${activePage === item.id ? 'bg-slate-200 text-slate-900 dark:bg-slate-800 dark:text-white' : 'text-slate-700 dark:text-slate-300'}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

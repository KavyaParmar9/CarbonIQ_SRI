import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import About from './pages/About';
import AnalysisDashboard from './pages/AnalysisDashboard';
import CarbonCalculator from './pages/CarbonCalculator';
import Research from './pages/Research';
import Home from './pages/Home';
import DataSources from './pages/DataSources';
import DatasetExplorer from './pages/DatasetExplorer';
import ReportGenerator from './pages/ReportGenerator';
import Footer from './components/Footer';
import Header from './components/Header';

function App() {
  const [activePage, setActivePage] = useState('home');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const pages = [
    { id: 'home', label: 'Home', component: <Home setActivePage={setActivePage} /> },
    { id: 'dashboard', label: 'Analysis Dashboard', component: <AnalysisDashboard /> },
    { id: 'calculator', label: 'Carbon Calculator', component: <CarbonCalculator /> },
    { id: 'report-generator', label: 'Report Generator', component: <ReportGenerator setActivePage={setActivePage} /> },
    { id: 'explorer', label: 'Dataset Explorer', component: <DatasetExplorer /> },
    { id: 'research', label: 'Research', component: <Research /> },
    { id: 'sources', label: 'Data Sources', component: <DataSources /> },
    { id: 'about', label: 'About', component: <About /> },
  ];

  const activeComponent = useMemo(
    () => pages.find((page) => page.id === activePage)?.component,
    [activePage]
  );

  useEffect(() => {
    document.body.classList.toggle('light', theme === 'light');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
      theme === 'dark'
        ? 'bg-slate-950 text-slate-100'
        : 'bg-slate-50 text-slate-900'
    }`}>
      <Header activePage={activePage} setActivePage={setActivePage} toggleTheme={toggleTheme} theme={theme} />
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.35 }}
            className="space-y-10"
          >
            {activeComponent}
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </div>
  );
}

export default App;

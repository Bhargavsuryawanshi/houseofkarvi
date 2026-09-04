'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function ThemeSwitcher() {
  const pathname = usePathname();

  useEffect(() => {
    // Determine theme based on URL path
    let activeTheme = '';
    if (pathname === '/1') activeTheme = 'theme-1';
    else if (pathname === '/2') activeTheme = 'theme-2';
    else if (pathname === '/3') activeTheme = 'theme-3';

    // Remove all previous theme classes
    document.documentElement.classList.remove('theme-1', 'theme-2', 'theme-3');
    
    // Add the new theme class if applicable
    if (activeTheme) {
      document.documentElement.classList.add(activeTheme);
    }
  }, [pathname]);

  const changeTheme = (t: string) => {
    document.documentElement.classList.remove('theme-1', 'theme-2', 'theme-3');
    if (t) document.documentElement.classList.add(t);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50 flex gap-2 p-2 bg-black/80 rounded-full border border-white/20 backdrop-blur-md shadow-2xl">
      <button onClick={() => changeTheme('')} className="px-3 py-1.5 text-xs text-white hover:text-gray-300 font-sans tracking-wide uppercase transition-colors">Default</button>
      <button onClick={() => changeTheme('theme-1')} className="px-3 py-1.5 text-xs text-white hover:text-gray-300 font-sans tracking-wide uppercase transition-colors border-l border-white/20">Minimal</button>
      <button onClick={() => changeTheme('theme-2')} className="px-3 py-1.5 text-xs text-white hover:text-gray-300 font-sans tracking-wide uppercase transition-colors border-l border-white/20">Earth</button>
      <button onClick={() => changeTheme('theme-3')} className="px-3 py-1.5 text-xs text-white hover:text-gray-300 font-sans tracking-wide uppercase transition-colors border-l border-white/20">Emerald</button>
    </div>
  );
}

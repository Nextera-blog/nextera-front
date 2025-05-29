import React, { useEffect, useState } from "react"
import { Header } from "../components/Header"
import { Outlet } from "react-router-dom"
import { Footer } from "../components/Footer"
import TempAuth from "../components/TempAuth"

export const App: React.FunctionComponent = () => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`w-full min-h-screen flex flex-col ${darkMode ? 'bg-sky-950 text-sky-50' : 'dark:bg-sky-100 dark: text-blue-950'}`}>
      <Header onToggleDarkMode={toggleDarkMode} darkMode={darkMode} />
      {/* TempAuth = component for debugging (temporary file - to delete) */}
      <TempAuth />
      <Outlet />
      <Footer />
    </div>
  )
}
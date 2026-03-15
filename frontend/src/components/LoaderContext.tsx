import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import VortexLoader from './VortexLoader';

const LoaderContext = createContext({
  isLoading: false,
});

export const useLoader = () => useContext(LoaderContext);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeRequests, setActiveRequests] = useState(0);
  const [showApiLoader, setShowApiLoader] = useState(false);
  
  // State specifically for the first time the app opens
  const [isInitialBoot, setIsInitialBoot] = useState(true);

  // 1. INITIAL BOOT TIMER: Show for 2.5 seconds on page load
  useEffect(() => {
    const bootTimer = setTimeout(() => {
      setIsInitialBoot(false);
    }, 2500); 

    return () => clearTimeout(bootTimer);
  }, []);

  // 2. ANTI-FLICKER DELAY: Wait 300ms before showing loader for API calls
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (activeRequests > 0) {
      timeoutId = setTimeout(() => setShowApiLoader(true), 300);
    } else {
      setShowApiLoader(false);
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeRequests]);

  // 3. FETCH INTERCEPTOR: Catch all native fetch calls
  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      setActiveRequests((prev) => prev + 1);

      try {
        const response = await originalFetch(...args);
        return response;
      } finally {
        setActiveRequests((prev) => prev - 1);
      }
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // Combine conditions: Show if booting up OR if a slow API call is running
  const isLoaderVisible = isInitialBoot || showApiLoader;

  return (
    <LoaderContext.Provider value={{ isLoading: isLoaderVisible }}>
      {isLoaderVisible && <VortexLoader />}
      {children}
    </LoaderContext.Provider>
  );
};
import React, { useState, createContext, useContext, useEffect } from 'react';

export const stateContext = createContext();

const getFreshContext = () => {
    const storedContext = localStorage.getItem('context');
    if (storedContext) {
      try {
        const parsedContext = JSON.parse(storedContext);
        // Ensure that selectedOptions is an array
        return {
          ...parsedContext,
          selectedOptions: Array.isArray(parsedContext.selectedOptions) ? parsedContext.selectedOptions : [],
        };
      } catch (e) {
        console.error('Error parsing context from localStorage', e);
      }
    }
  
    // Default context if localStorage is empty or invalid
    const defaultContext = {
      participantID: 0,
      timeTaken: 0,
      selectedOptions: []
    };
    
    localStorage.setItem('context', JSON.stringify(defaultContext)); // Store default context
    return defaultContext;
  };
  

export default function useStateContext() {
  const { context, setContext } = useContext(stateContext);
  return {
    context,
    setContext: (obj) => {
      setContext({ ...context, ...obj });
    },
    resetContext:()=>{
        localStorage.removeItem('context')
        setContext(getFreshContext())
    }
  };
}

export function ContextProvider({ children }) {
  const [context, setContext] = useState(getFreshContext());

  // Persist context to localStorage only when it changes
  useEffect(() => {
    localStorage.setItem('context', JSON.stringify(context));
  }, [context]);

  return (
    <stateContext.Provider value={{ context, setContext }}>
      {children}
    </stateContext.Provider>
  );
}

import { useEffect, useState } from "react";

export const useDebounce = (value: string, delay: number = 100) => {
  const [debounced, setDebounced] = useState("");
  useEffect(() => {
    const handleDebounce = setTimeout(() => {
      // toast.success(`Debounced: ${value}`);
      setDebounced(value);
    }, delay);
    return () => {
      clearTimeout(handleDebounce);
    };
  }, [value, delay]);
  return debounced;
};

export function UseFontsLoaded() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if (document?.fonts) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      setFontsLoaded(false);
    }
  }, []);

  return fontsLoaded;
}

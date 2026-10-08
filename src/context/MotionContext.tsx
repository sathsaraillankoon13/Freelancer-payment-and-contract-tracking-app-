import React, { createContext, useContext, useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useAppContext } from '@/context/AppContext';

const MotionContext = createContext(true);

export function MotionProvider({ children }: React.PropsWithChildren) {
  const { currentUser } = useAppContext();
  // Avoid motion until the device preference has been read.
  const [systemReducedMotion, setSystemReducedMotion] = useState(true);

  useEffect(() => {
    let mounted = true;
    let receivedEvent = false;
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', (enabled) => {
      receivedEvent = true;
      setSystemReducedMotion(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (mounted && !receivedEvent) setSystemReducedMotion(enabled);
    }).catch(() => {
      // Keep the accessible default if the platform cannot report its preference.
    });
    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return (
    <MotionContext.Provider value={systemReducedMotion || !!currentUser?.reducedMotion}>
      {children}
    </MotionContext.Provider>
  );
}

export const useReducedMotion = () => useContext(MotionContext);

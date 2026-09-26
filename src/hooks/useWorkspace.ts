import { useState } from 'react';

export function useWorkspace() {
  const [isReady] = useState(true);

  return {
    isReady,
  };
}

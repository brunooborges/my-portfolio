import { useEffect, useState } from 'react';
import { useWindowScroll } from 'react-use';

interface UseScrollHookProps {
  heightScrolled: number;
}

export default function useScrollHook({ heightScrolled }: UseScrollHookProps): boolean {
  const { y } = useWindowScroll();
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    if (y > heightScrolled) {
      setIsScrolled(true);
    } else {
      setIsScrolled(false);
    }
  }, [y]);

  return isScrolled;
}

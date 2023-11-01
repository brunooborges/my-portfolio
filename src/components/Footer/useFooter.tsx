import { useEffect, useState } from 'react';

interface FooterProps {
  count: any[];
}

export default function useFooter(): FooterProps {
  const [count, setCount] = useState<any[]>([]);

  async function loadCounter(): Promise<void> {
    try {
      const res = await fetch(
        'https://4ahbvr5oc6.execute-api.sa-east-1.amazonaws.com/prod/visitorcount',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      const json = await res.json();
      setCount(json.scanData);
    } catch (err) {
      console.error('An error occurred during the data retrieval process:', err);
    }
  }

  useEffect(() => {
    loadCounter().catch(() => {});
  }, []);

  return { count };
}

import React, { useEffect, useState } from 'react';

import { Container } from './styles';

export default function Footer(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const loadCounter = async (): Promise<void> => {
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
      setCount(json);
    } catch (err) {
      console.error('An error occurred during the data retrieval process:', err);
    }
  };

  useEffect(() => {
    loadCounter().catch(() => {});
  }, []);

  return (
    <Container>
      <p>Designed & Built by Bruno Borges © 2023 - Visitors Count: {count}</p>
    </Container>
  );
}

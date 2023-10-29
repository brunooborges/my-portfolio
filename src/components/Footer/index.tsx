import React, { useEffect, useState } from 'react';

import { Container } from './styles';

export default function Footer(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  const loadCounter = async (): Promise<void> => {
    try {
<<<<<<< HEAD
      console.log(process.env.API_URL);
=======
>>>>>>> c8902f85ca1b954aa991e30f962129d60a6605ca
      if (!process.env.API_URL) {
        throw new Error('API URL not defined');
      }

      const res = await fetch(process.env.API_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

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

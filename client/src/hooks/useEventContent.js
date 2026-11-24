import { useEffect, useState } from 'react';
import { api } from '../api/client.js';

export function useEventContent() {
  const [state, setState] = useState({ content: null, error: null, loading: true });

  useEffect(() => {
    let active = true;
    api
      .getEvent()
      .then((content) => active && setState({ content, error: null, loading: false }))
      .catch((error) => active && setState({ content: null, error, loading: false }));
    return () => {
      active = false;
    };
  }, []);

  return state;
}

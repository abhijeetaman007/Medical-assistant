import { useEffect, useState } from 'react';
import { get } from '../utils/requests';

export default (url, lazy = false) => {
  const [isLoading, setIsLoading] = useState(!lazy);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const fetch = (loading = true) => {
    setIsLoading(loading);
    get(url)
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err);
      });
  };

  useEffect(() => {
    if (!lazy) fetch();
  }, []);

  return { isLoading, error, data, fetch };
};

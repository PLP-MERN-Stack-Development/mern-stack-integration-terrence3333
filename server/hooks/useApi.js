import { useState, useEffect } from 'react';

export const useApi = (fn, deps = []) => {
  const [data, setData] = useState(null);
  const [loading, setLoading ] = useState(false);
  const [error, setError] = useState(null);

  const call = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fn(...args);
      setData(res);
      setLoading(false);
      return res;
    } catch (err) {
      setError(err);
      setLoading(false);
      throw err;
    }
  };

  useEffect(() => {
    // Optionally auto-call if fn accepts no args
    // (call() if needed)
  }, deps);

  return { data, loading, error, call, setData };
};

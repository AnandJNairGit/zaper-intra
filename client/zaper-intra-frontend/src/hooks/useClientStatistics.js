// src/hooks/useClientStatistics.js
import { useState, useEffect } from 'react';
import clientService from '../services/clientService';

export const useClientStatistics = (clientId) => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatistics = async (id = clientId) => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await clientService.getClientStatistics(id);
      
      if (response.status === 'success') {
        setStatistics(response.data.statistics);
      } else {
        throw new Error(response.message || 'Failed to fetch statistics');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in useClientStatistics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, [clientId]);

  const refetch = () => {
    fetchStatistics();
  };

  return {
    statistics,
    loading,
    error,
    refetch
  };
};

export default useClientStatistics;

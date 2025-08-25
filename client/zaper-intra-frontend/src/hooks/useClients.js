// src/hooks/useClients.js
import { useState, useEffect } from 'react';
import clientService from '../services/clientService';

export const useClients = (params = {}) => {
  const [clients, setClients] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClients = async (queryParams = params) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await clientService.getClients(queryParams);
      
      if (response.status === 'success') {
        setClients(response.data.clients || []);
        setPagination(response.data.pagination || null);
        setSummary(response.data.summary || null);
      } else {
        throw new Error(response.message || 'Failed to fetch clients');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in useClients:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const refetch = (newParams) => {
    fetchClients(newParams);
  };

  return {
    clients,
    pagination,
    summary,
    loading,
    error,
    refetch
  };
};

export default useClients;

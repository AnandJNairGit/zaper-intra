// src/hooks/useClientStaff.js
import { useState, useEffect } from 'react';
import staffService from '../services/staffService';

export const useClientStaff = (clientId, params = {}) => {
  const [staffs, setStaffs] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchClientStaff = async (queryParams = params) => {
    if (!clientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await staffService.getStaffByClientId(clientId, queryParams);
      
      if (response.status === 'success') {
        setStaffs(response.data.staffs || []);
        setPagination(response.data.pagination || null);
        setSummary(response.data.summary || null);
      } else {
        throw new Error(response.message || 'Failed to fetch staff');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in useClientStaff:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientStaff();
  }, [clientId]);

  const refetch = (newParams) => {
    fetchClientStaff(newParams);
  };

  return {
    staffs,
    pagination,
    summary,
    loading,
    error,
    refetch
  };
};

export default useClientStaff;

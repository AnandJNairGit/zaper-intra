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
      
      // Clean up params - remove undefined, null, and empty string values
      const cleanParams = Object.entries(queryParams).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      console.log('API Call - Client ID:', clientId, 'Params:', cleanParams);
      
      const response = await staffService.getStaffByClientId(clientId, cleanParams);
      
      console.log('API Response:', response);
      
      if (response.status === 'success') {
        // Force re-render by creating new arrays
        setStaffs([...response.data.staffs] || []);
        setPagination(response.data.pagination ? {...response.data.pagination} : null);
        setSummary(response.data.summary ? {...response.data.summary} : null);
      } else {
        throw new Error(response.message || 'Failed to fetch staff');
      }
    } catch (err) {
      setError(err.message);
      console.error('Error in useClientStaff:', err);
      // Reset data on error
      setStaffs([]);
      setPagination(null);
      setSummary(null);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch data when clientId or params change
  useEffect(() => {
    const paramsString = JSON.stringify(params);
    console.log('useClientStaff effect triggered:', { clientId, paramsString });
    fetchClientStaff(params);
  }, [clientId, JSON.stringify(params)]);

  const refetch = (newParams) => {
    fetchClientStaff(newParams || params);
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

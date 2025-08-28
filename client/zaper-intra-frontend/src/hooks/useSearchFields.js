// src/hooks/useSearchFields.js
import { useState, useEffect } from 'react';
import staffService from '../services/staffService';

export const useSearchFields = () => {
  const [searchFields, setSearchFields] = useState([]);
  const [searchTypes, setSearchTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSearchFields = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await staffService.getSearchFields();
        
        if (response.status === 'success') {
          setSearchFields(response.data.searchFields || []);
          setSearchTypes(response.data.searchTypes || []);
        } else {
          throw new Error(response.message || 'Failed to fetch search fields');
        }
      } catch (err) {
        setError(err.message);
        console.error('Error in useSearchFields:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchFields();
  }, []);

  return {
    searchFields,
    searchTypes,
    loading,
    error
  };
};

export default useSearchFields;

// src/hooks/useFilterOptions.js
import { useState, useEffect } from 'react';
import staffService from '../services/staffService';

export const useFilterOptions = () => {
  const [filterOptions, setFilterOptions] = useState({
    combinedFilters: [],
    otFilters: [],
    faceFilters: [],
    salaryFields: [],
    currencies: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define static filter options based on API documentation
  const staticFilterOptions = {
    combinedFilters: [
      { value: '', label: 'All Users', icon: '👥' },
      { value: 'ot_with_face', label: 'OT with Face Registered', icon: '⏰👤' },
      { value: 'ot_without_face', label: 'OT without Face Registered', icon: '⏰❌' },
      { value: 'non_ot_with_face', label: 'Non-OT with Face Registered', icon: '🚫⏰👤' },
      { value: 'non_ot_without_face', label: 'Non-OT without Face Registered', icon: '🚫⏰❌' },
      { value: 'all_ot', label: 'All OT Users', icon: '⏰' },
      { value: 'all_non_ot', label: 'All Non-OT Users', icon: '🚫⏰' },
      { value: 'all_with_face', label: 'All with Face Registered', icon: '👤' },
      { value: 'all_without_face', label: 'All without Face Registered', icon: '❌👤' }
    ],
    otFilters: [
      { value: '', label: 'All OT Status', icon: '📊' },
      { value: 'enabled', label: 'OT Enabled', icon: '✅' },
      { value: 'disabled', label: 'OT Disabled', icon: '❌' }
    ],
    faceFilters: [
      { value: '', label: 'All Face Status', icon: '📊' },
      { value: 'registered', label: 'Face Registered', icon: '👤' },
      { value: 'not_registered', label: 'Face Not Registered', icon: '❌' }
    ],
    salaryFields: [
      { value: 'basic_salary', label: 'Basic Salary', description: 'Base salary before allowances' },
      { value: 'take_home', label: 'Take Home', description: 'Net salary after deductions' },
      { value: 'ctc', label: 'CTC', description: 'Cost to Company (total compensation)' }
    ],
    currencies: ['USD', 'INR', 'EUR', 'AED', 'GBP', 'CAD', 'AUD', 'SGD']
  };

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch dynamic filter options from API
        // const response = await staffService.getFilterOptions();
        // For now, use static options as API might not be implemented yet
        
        setFilterOptions(staticFilterOptions);
      } catch (err) {
        // Fallback to static options if API fails
        console.warn('Failed to fetch filter options from API, using static options:', err);
        setFilterOptions(staticFilterOptions);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  return {
    filterOptions,
    loading,
    error
  };
};

export default useFilterOptions;

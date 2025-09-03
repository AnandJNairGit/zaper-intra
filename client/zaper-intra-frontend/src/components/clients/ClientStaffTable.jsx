// src/components/clients/ClientStaffTable.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { Users, AlertCircle } from 'lucide-react';
import { Table } from '../ui/Table';
import useClientStaff from '../../hooks/useClientStaff';
import useSearchFields from '../../hooks/useSearchFields';
import useFilterOptions from '../../hooks/useFilterOptions';
import SearchAndFilters from './SearchAndFilters';
import ActiveFiltersSummary from './ActiveFiltersSummary';
import { getStaffTableColumns } from './StaffTableColumns';

const ClientStaffTable = ({ clientId, className = '' }) => {
  // Simplified state - combine all filter state into one object
  const [filters, setFilters] = useState({
    // Search
    selectedField: null,
    searchTerm: '',
    debouncedSearchTerm: '',
    searchType: 'like',
    // Filters
    selectedCombinedFilter: null,
    selectedOtFilter: null,
    selectedFaceFilter: null,
    selectedDeviceFilter: null, // Added device filter
    selectedProjectsFilter: '', // Added projects filter
    selectedProjectId: '', // Added project-based filter
    selectedStatus: null,
    // Salary
    selectedSalaryField: 'basic_salary',
    minSalary: '',
    maxSalary: '',
    selectedCurrency: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // Fetch data
  const { searchFields, searchTypes, loading: fieldsLoading, error: fieldsError } = useSearchFields();
  const { filterOptions, loading: filtersLoading, error: filtersError } = useFilterOptions();

  // Debounced search
  const debouncedSetSearch = useMemo(
    () => debounce((value) => {
      setFilters(prev => ({ ...prev, debouncedSearchTerm: value }));
      setCurrentPage(1);
    }, 500),
    []
  );

  useEffect(() => {
    debouncedSetSearch(filters.searchTerm);
    return () => debouncedSetSearch.cancel();
  }, [filters.searchTerm, debouncedSetSearch]);

  // Prepare query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageLimit
    };

    if (filters.debouncedSearchTerm.trim()) {
      params.search = filters.debouncedSearchTerm.trim();
    }

    if (filters.selectedField?.value) {
      params.searchField = filters.selectedField.value;
    }

    if (filters.searchType && filters.searchType !== 'like') {
      params.searchType = filters.searchType;
    }

    if (filters.selectedCombinedFilter?.value) {
      params.combinedFilter = filters.selectedCombinedFilter.value;
    }

    if (filters.selectedOtFilter?.value) {
      params.otFilter = filters.selectedOtFilter.value;
    }

    if (filters.selectedFaceFilter?.value) {
      params.faceFilter = filters.selectedFaceFilter.value;
    }

    if (filters.selectedDeviceFilter?.value) {
      params.deviceFilter = filters.selectedDeviceFilter.value;
    }

    if (filters.selectedProjectsFilter) {
      params.projectsFilter = filters.selectedProjectsFilter;
    }

    if (filters.selectedProjectId) {
      params.projectId = filters.selectedProjectId;
    }

    if (filters.selectedStatus?.value) {
      params.status = filters.selectedStatus.value;
    }

    if (filters.minSalary || filters.maxSalary) {
      params.salaryField = filters.selectedSalaryField;
      if (filters.minSalary) params.minSalary = parseInt(filters.minSalary);
      if (filters.maxSalary) params.maxSalary = parseInt(filters.maxSalary);
      if (filters.selectedCurrency) params.currency = filters.selectedCurrency;
    }

    return params;
  }, [currentPage, pageLimit, filters]);

  const { staffs, pagination, summary, loading, error, refetch } = useClientStaff(clientId, queryParams);

  // Update filters handler
  const updateFilters = useCallback((updates) => {
    setFilters(prev => ({ ...prev, ...updates }));
    setCurrentPage(1);
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilters({
      selectedField: null,
      searchTerm: '',
      debouncedSearchTerm: '',
      searchType: 'like',
      selectedCombinedFilter: null,
      selectedOtFilter: null,
      selectedFaceFilter: null,
      selectedDeviceFilter: null, // Reset device filter
      selectedProjectsFilter: '', // Reset projects filter
      selectedProjectId: '', // Reset project-based filter
      selectedStatus: null,
      selectedSalaryField: 'basic_salary',
      minSalary: '',
      maxSalary: '',
      selectedCurrency: ''
    });
    setCurrentPage(1);
    debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return filters.debouncedSearchTerm ||
           filters.selectedField ||
           filters.searchType !== 'like' ||
           filters.selectedCombinedFilter ||
           filters.selectedOtFilter ||
           filters.selectedFaceFilter ||
           filters.selectedDeviceFilter || // Include device filter
           filters.selectedProjectsFilter || // Include projects filter
           filters.selectedProjectId || // Include project-based filter
           filters.selectedStatus ||
           filters.minSalary ||
           filters.maxSalary ||
           filters.selectedCurrency;
  }, [filters]);

  const columns = useMemo(() => getStaffTableColumns(), []);

  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Users className="w-16 h-16 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {hasActiveFilters ? 'No matching staff found' : 'No staff members found'}
      </h3>
      <p className="text-gray-500 max-w-md">
        {hasActiveFilters 
          ? 'Try adjusting your search terms or filters to find staff members'
          : 'No staff members are currently registered for this client'
        }
      </p>
    </div>
  ), [hasActiveFilters]);

  if (fieldsLoading || filtersLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Loading filters...</span>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Messages */}
      {fieldsError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-700">Search fields: {fieldsError}</span>
        </div>
      )}
      
      {filtersError && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-700">Filter options: {filtersError}</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <AlertCircle className="w-5 h-5 text-red-400 mr-3" />
          <span className="text-red-700">Staff data: {error}</span>
        </div>
      )}

      {/* Search and Filters */}
      <SearchAndFilters
        filters={filters}
        updateFilters={updateFilters}
        clearAllFilters={clearAllFilters}
        searchFields={searchFields || []}
        searchTypes={searchTypes || []}
        filterOptions={filterOptions || { combinedFilters: [], otFilters: [], faceFilters: [], currencies: [] }}
        fieldsLoading={fieldsLoading}
        filtersLoading={filtersLoading}
        clientId={clientId}
      />

      {/* Active Filters Summary */}
      <ActiveFiltersSummary 
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Table */}
      <Table
        columns={columns}
        data={staffs || []}
        loading={loading}
        emptyState={emptyState}
        pagination={pagination}
        onPageChange={setCurrentPage}
        summary={summary}
        showSearch={false}
      />
    </div>
  );
};

export default ClientStaffTable;

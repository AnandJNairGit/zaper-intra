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
    const params = { page: currentPage, limit: pageLimit };

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
    return filters.debouncedSearchTerm || filters.selectedField || filters.searchType !== 'like' ||
           filters.selectedCombinedFilter || filters.selectedOtFilter || filters.selectedFaceFilter ||
           filters.selectedStatus || filters.minSalary || filters.maxSalary || filters.selectedCurrency;
  }, [filters]);

  const columns = useMemo(() => getStaffTableColumns(), []);

  const emptyState = useMemo(() => (
    <div className="flex flex-col items-center justify-center py-16">
      <Users className="h-16 w-16 text-gray-300 mb-4" />
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No staff members found</h3>
      <p className="text-gray-500 text-center max-w-md">
        {hasActiveFilters ? 
          'Try adjusting your search terms or filters to find staff members' : 
          'No staff members are currently registered for this client'
        }
      </p>
    </div>
  ), [hasActiveFilters]);

  if (fieldsLoading || filtersLoading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-100 rounded-xl"></div>
          <div className="h-64 bg-gray-100 rounded-xl"></div>
        </div>
      </div>
    );
  }

  const hasErrors = fieldsError || filtersError || error;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Error Messages */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-red-800">Error loading data</h4>
              <div className="text-sm text-red-700 mt-1">
                {fieldsError && <p>Search fields: {fieldsError}</p>}
                {filtersError && <p>Filter options: {filtersError}</p>}
                {error && <p>Staff data: {error}</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Simplified Search and Filters */}
      <SearchAndFilters
        filters={filters}
        updateFilters={updateFilters}
        clearAllFilters={clearAllFilters}
        searchFields={searchFields}
        searchTypes={searchTypes}
        filterOptions={filterOptions}
        fieldsLoading={fieldsLoading}
        filtersLoading={filtersLoading}
      />

      {/* Active Filters Summary */}
      <ActiveFiltersSummary
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />

      {/* Staff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <Table
          data={staffs}
          columns={columns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setCurrentPage}
          emptyState={emptyState}
          showSearch={false}
          horizontalScroll={true}
        />
      </div>
    </div>
  );
};

export default ClientStaffTable;

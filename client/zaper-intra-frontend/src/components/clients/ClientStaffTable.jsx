// src/components/clients/ClientStaffTable.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import { debounce } from 'lodash';
import { Users } from 'lucide-react';
import { Table } from '../ui/Table';
import useClientStaff from '../../hooks/useClientStaff';
import useSearchFields from '../../hooks/useSearchFields';
import useFilterOptions from '../../hooks/useFilterOptions';
import SearchControls from './SearchControls';
import FilterControls from './FilterControls';
import SalaryFilter from './SalaryFilter';
import ActiveFiltersSummary from './ActiveFiltersSummary';
import { getStaffTableColumns } from './StaffTableColumns';

const ClientStaffTable = ({ clientId, className = '' }) => {
  // Search-related state
  const [selectedField, setSelectedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('like');
  
  // Filter-related state
  const [selectedCombinedFilter, setSelectedCombinedFilter] = useState(null);
  const [selectedOtFilter, setSelectedOtFilter] = useState(null);
  const [selectedFaceFilter, setSelectedFaceFilter] = useState(null);
  
  // Salary filter state
  const [selectedSalaryField, setSelectedSalaryField] = useState('basic_salary');
  const [minSalary, setMinSalary] = useState('');
  const [maxSalary, setMaxSalary] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // Fetch search fields and filter options
  const { searchFields, searchTypes, loading: fieldsLoading } = useSearchFields();
  const { filterOptions, loading: filtersLoading } = useFilterOptions();

  // Create stable debounced function
  const debouncedSetSearch = useMemo(
    () => debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSetSearch(searchTerm);
    
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchTerm, debouncedSetSearch]);

  // Prepare query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageLimit
    };

    // Search parameters
    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }
    
    if (selectedField?.value) {
      params.searchField = selectedField.value;
    }
    
    if (searchType && searchType !== 'like') {
      params.searchType = searchType;
    }

    // Filter parameters
    if (selectedCombinedFilter?.value) {
      params.combinedFilter = selectedCombinedFilter.value;
    }
    
    if (selectedOtFilter?.value) {
      params.otFilter = selectedOtFilter.value;
    }
    
    if (selectedFaceFilter?.value) {
      params.faceFilter = selectedFaceFilter.value;
    }

    // Salary filter parameters
    if (minSalary || maxSalary) {
      params.salaryField = selectedSalaryField;
      
      if (minSalary) {
        params.minSalary = parseInt(minSalary);
      }
      
      if (maxSalary) {
        params.maxSalary = parseInt(maxSalary);
      }
      
      if (selectedCurrency) {
        params.currency = selectedCurrency;
      }
    }

    console.log('Query params being sent:', params);

    return params;
  }, [
    currentPage, 
    pageLimit, 
    debouncedSearchTerm, 
    selectedField, 
    searchType, 
    selectedCombinedFilter, 
    selectedOtFilter, 
    selectedFaceFilter,
    selectedSalaryField,
    minSalary,
    maxSalary,
    selectedCurrency
  ]);

  // Fetch staff data
  const { staffs, pagination, summary, loading, error, refetch } = useClientStaff(clientId, queryParams);

  // Prepare options for child components
  const fieldOptions = useMemo(() => {
    if (!searchFields.length) return [];
    
    return [
      { value: null, label: 'All Fields', icon: 'Search' },
      ...searchFields.map(field => ({
        value: field.alias,
        label: field.alias.charAt(0).toUpperCase() + field.alias.slice(1),
        type: field.type,
        internalField: field.field
      }))
    ];
  }, [searchFields]);

  const typeOptions = useMemo(() => {
    return searchTypes.map(type => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [searchTypes]);

  const combinedFilterSelectOptions = useMemo(() => {
    return filterOptions.combinedFilters.map(filter => ({
      value: filter.value,
      label: filter.label,
      icon: filter.icon
    }));
  }, [filterOptions.combinedFilters]);

  const otFilterSelectOptions = useMemo(() => {
    return filterOptions.otFilters.map(filter => ({
      value: filter.value,
      label: filter.label,
      icon: filter.icon
    }));
  }, [filterOptions.otFilters]);

  const faceFilterSelectOptions = useMemo(() => {
    return filterOptions.faceFilters.map(filter => ({
      value: filter.value,
      label: filter.label,
      icon: filter.icon
    }));
  }, [filterOptions.faceFilters]);

  const currencyOptions = useMemo(() => {
    return [
      { value: '', label: 'Any Currency' },
      ...filterOptions.currencies.map(currency => ({
        value: currency,
        label: currency
      }))
    ];
  }, [filterOptions.currencies]);

  // Event handlers
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  const handleFieldChange = useCallback((option) => {
    setSelectedField(option);
    setCurrentPage(1);
  }, []);

  const handleSearchTypeChange = useCallback((e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleCombinedFilterChange = useCallback((option) => {
    setSelectedCombinedFilter(option);
    setCurrentPage(1);
    if (option) {
      setSelectedOtFilter(null);
      setSelectedFaceFilter(null);
    }
  }, []);

  const handleOtFilterChange = useCallback((option) => {
    setSelectedOtFilter(option);
    setCurrentPage(1);
    if (option) {
      setSelectedCombinedFilter(null);
    }
  }, []);

  const handleFaceFilterChange = useCallback((option) => {
    setSelectedFaceFilter(option);
    setCurrentPage(1);
    if (option) {
      setSelectedCombinedFilter(null);
    }
  }, []);

  const handleSalaryFieldChange = useCallback((e) => {
    setSelectedSalaryField(e.target.value);
    setCurrentPage(1);
  }, []);

  const handleMinSalaryChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMinSalary(value);
      setCurrentPage(1);
    }
  }, []);

  const handleMaxSalaryChange = useCallback((e) => {
    const value = e.target.value;
    if (value === '' || /^\d+$/.test(value)) {
      setMaxSalary(value);
      setCurrentPage(1);
    }
  }, []);

  const handleCurrencyChange = useCallback((option) => {
    setSelectedCurrency(option ? option.value : '');
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setSelectedField(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSearchType('like');
    setSelectedCombinedFilter(null);
    setSelectedOtFilter(null);
    setSelectedFaceFilter(null);
    setSelectedSalaryField('basic_salary');
    setMinSalary('');
    setMaxSalary('');
    setSelectedCurrency('');
    setCurrentPage(1);
    debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return debouncedSearchTerm || selectedField || searchType !== 'like' || 
           selectedCombinedFilter || selectedOtFilter || selectedFaceFilter ||
           minSalary || maxSalary || selectedCurrency;
  }, [
    debouncedSearchTerm, 
    selectedField, 
    searchType, 
    selectedCombinedFilter, 
    selectedOtFilter, 
    selectedFaceFilter,
    minSalary,
    maxSalary,
    selectedCurrency
  ]);

  // Get table columns
  const columns = useMemo(() => getStaffTableColumns(), []);

  // Custom empty state
  const emptyState = useMemo(() => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-900">No staff members found</p>
      <p className="text-sm text-gray-500 mt-1">
        {hasActiveFilters ? 'Try adjusting your search terms or filters' : 'No staff members registered for this client'}
      </p>
    </div>
  ), [hasActiveFilters]);

  if (fieldsLoading || filtersLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Enhanced Search and Filter Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* Search Controls Row */}
        <SearchControls
          fieldOptions={fieldOptions}
          selectedField={selectedField}
          handleFieldChange={handleFieldChange}
          searchTerm={searchTerm}
          handleSearchChange={handleSearchChange}
          searchType={searchType}
          typeOptions={typeOptions}
          handleSearchTypeChange={handleSearchTypeChange}
          fieldsLoading={fieldsLoading}
        />

        {/* Filter Controls Row */}
        <FilterControls
          combinedFilterSelectOptions={combinedFilterSelectOptions}
          selectedCombinedFilter={selectedCombinedFilter}
          handleCombinedFilterChange={handleCombinedFilterChange}
          otFilterSelectOptions={otFilterSelectOptions}
          selectedOtFilter={selectedOtFilter}
          handleOtFilterChange={handleOtFilterChange}
          faceFilterSelectOptions={faceFilterSelectOptions}
          selectedFaceFilter={selectedFaceFilter}
          handleFaceFilterChange={handleFaceFilterChange}
          currencyOptions={currencyOptions}
          selectedCurrency={selectedCurrency}
          handleCurrencyChange={handleCurrencyChange}
          filtersLoading={filtersLoading}
        />

        {/* Salary Filter Section */}
        <SalaryFilter
          filterOptions={filterOptions}
          selectedSalaryField={selectedSalaryField}
          handleSalaryFieldChange={handleSalaryFieldChange}
          minSalary={minSalary}
          handleMinSalaryChange={handleMinSalaryChange}
          maxSalary={maxSalary}
          handleMaxSalaryChange={handleMaxSalaryChange}
          selectedCurrency={selectedCurrency}
          handleClearAllFilters={handleClearAllFilters}
        />

        {/* Active Filters Summary */}
        <ActiveFiltersSummary
          hasActiveFilters={hasActiveFilters}
          selectedField={selectedField}
          debouncedSearchTerm={debouncedSearchTerm}
          searchType={searchType}
          selectedCombinedFilter={selectedCombinedFilter}
          selectedOtFilter={selectedOtFilter}
          selectedFaceFilter={selectedFaceFilter}
          minSalary={minSalary}
          maxSalary={maxSalary}
          selectedCurrency={selectedCurrency}
          handleClearAllFilters={handleClearAllFilters}
        />
      </div>

      {/* Staff Table */}
      <Table
        data={staffs.map(staff => ({ ...staff, id: staff.staff_id }))}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchValue=""
        emptyState={emptyState}
        rowClickable={false}
        sortable={false}
        showSearch={false}
        showPagination={true}
        horizontalScroll={true}
      />
    </div>
  );
};

export default ClientStaffTable;

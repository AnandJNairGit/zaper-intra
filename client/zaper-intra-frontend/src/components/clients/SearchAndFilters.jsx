// src/components/clients/SearchAndFilters.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { Search, Filter, ChevronDown, ChevronUp, UserCheck, Clock, Eye, DollarSign, Smartphone, Briefcase, FolderOpen } from 'lucide-react';
import { staffService } from '../../services/staffService';

const SearchAndFilters = ({
  filters,
  updateFilters,
  clearAllFilters,
  searchFields,
  searchTypes,
  filterOptions,
  fieldsLoading,
  filtersLoading,
  clientId
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [projectOptions, setProjectOptions] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Fetch project options when component mounts
  useEffect(() => {
    const fetchProjectOptions = async () => {
      if (!clientId) return;
      
      setProjectsLoading(true);
      try {
        const response = await staffService.getProjectBasedFilterOptions(clientId);
        const options = [
          { value: '', label: 'All Projects' },
          ...response.data.map(project => ({
            value: project.id,
            label: project.name
          }))
        ];
        setProjectOptions(options);
      } catch (error) {
        console.error('Error fetching project options:', error);
        setProjectOptions([{ value: '', label: 'All Projects' }]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjectOptions();
  }, [clientId]);

  // Prepare options
  const fieldOptions = [
    { value: null, label: 'All Fields' },
    ...searchFields.map(field => ({
      value: field.alias,
      label: field.alias.charAt(0).toUpperCase() + field.alias.slice(1)
    }))
  ];

  const statusOptions = [
    { value: '', label: 'All Staff' },
    { value: 'active', label: 'Active Staff' },
    { value: 'inactive', label: 'Inactive Staff' }
  ];

  const combinedFilterOptions = filterOptions.combinedFilters.map(filter => ({
    value: filter.value,
    label: filter.label
  }));

  const otFilterOptions = filterOptions.otFilters.map(filter => ({
    value: filter.value,
    label: filter.label
  }));

  const faceFilterOptions = filterOptions.faceFilters.map(filter => ({
    value: filter.value,
    label: filter.label
  }));

  // Device filter options
  const deviceFilterOptions = [
    { value: '', label: 'All Devices' },
    { value: 'android', label: 'Android Devices' },
    { value: 'ios', label: 'iOS Devices' },
    { value: 'none', label: 'No Device Registered' }
  ];

  // Projects filter options
  const projectsFilterOptions = [
    { value: '', label: 'All Projects' },
    { value: 'multi', label: 'Multi Projects' },
    { value: 'single', label: 'Single Project' },
    { value: 'none', label: 'No Projects' }
  ];

  const currencyOptions = [
    { value: '', label: 'Any Currency' },
    ...filterOptions.currencies.map(currency => ({
      value: currency,
      label: currency
    }))
  ];

  // Search type options as dropdown
  const searchTypeOptions = searchTypes.map(type => ({
    value: type,
    label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

  // Salary field options
  const salaryFieldOptions = [
    { value: 'basic_salary', label: 'Basic Salary' },
    { value: 'take_home', label: 'Take Home' },
    { value: 'ctc', label: 'CTC' },
    { value: 'gross_salary', label: 'Gross Salary' }
  ];

  // Custom select styles for clean look
  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '42px',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#d1d5db'
      },
      ...(state.isFocused && {
        borderColor: '#3b82f6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.1)'
      })
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9ca3af',
      fontSize: '14px'
    })
  };

  const hasAdvancedFilters = filters.selectedCombinedFilter || 
                             filters.selectedOtFilter || 
                             filters.selectedFaceFilter || 
                             filters.selectedDeviceFilter ||
                             filters.selectedProjectsFilter ||
                             filters.selectedProjectId ||
                             filters.minSalary || 
                             filters.maxSalary;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      {/* Main Search and Basic Filters Row */}
      <div className="flex flex-wrap gap-4 items-end">
        {/* Search Input */}
        <div className="flex-1 min-w-[300px]">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Staff
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="search"
              type="text"
              placeholder="Search by name, email, phone..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            />
          </div>
        </div>

        {/* Search Field Selector */}
        <div className="min-w-[180px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Search In
          </label>
          <Select
            value={filters.selectedField}
            onChange={(value) => updateFilters({ selectedField: value })}
            options={fieldOptions}
            placeholder="All Fields"
            isClearable
            styles={selectStyles}
            isLoading={fieldsLoading}
          />
        </div>

        {/* Search Type Dropdown */}
        {filters.debouncedSearchTerm && (
          <div className="min-w-[140px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Type
            </label>
            <Select
              value={searchTypeOptions.find(option => option.value === filters.searchType)}
              onChange={(value) => updateFilters({ searchType: value?.value || 'like' })}
              options={searchTypeOptions}
              placeholder="Like"
              styles={selectStyles}
            />
          </div>
        )}

        {/* Status Filter */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <UserCheck className="inline w-4 h-4 mr-1" />
            Status
          </label>
          <Select
            value={filters.selectedStatus}
            onChange={(value) => updateFilters({ selectedStatus: value })}
            options={statusOptions}
            placeholder="All Staff"
            isClearable
            styles={selectStyles}
          />
        </div>

        {/* Project-Based Filter */}
        <div className="min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <FolderOpen className="inline w-4 h-4 mr-1" />
            Project
          </label>
          <Select
            value={projectOptions.find(option => option.value === filters.selectedProjectId)}
            onChange={(value) => updateFilters({ selectedProjectId: value?.value || '' })}
            options={projectOptions}
            placeholder="All Projects"
            isClearable
            styles={selectStyles}
            isLoading={projectsLoading}
          />
        </div>

        {/* Projects Filter */}
        <div className="min-w-[160px]">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Briefcase className="inline w-4 h-4 mr-1" />
            Projects
          </label>
          <Select
            value={projectsFilterOptions.find(option => option.value === filters.selectedProjectsFilter)}
            onChange={(value) => updateFilters({ selectedProjectsFilter: value?.value || '' })}
            options={projectsFilterOptions}
            placeholder="All Projects"
            isClearable
            styles={selectStyles}
          />
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex items-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`px-4 py-3 rounded-lg border transition-colors flex items-center gap-2 ${
              hasAdvancedFilters || showAdvanced
                ? 'bg-blue-50 border-blue-200 text-blue-700'
                : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
            }`}
          >
            <Filter className="w-4 h-4" />
            Advanced
            {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            {hasAdvancedFilters && (
              <span className="ml-1 bg-blue-600 text-white text-xs rounded-full w-2 h-2"></span>
            )}
          </button>
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          {/* Filter Options Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Combined Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Filter className="inline w-4 h-4 mr-1" />
                Category
              </label>
              <Select
                value={filters.selectedCombinedFilter}
                onChange={(value) => updateFilters({ selectedCombinedFilter: value })}
                options={combinedFilterOptions}
                placeholder="All Categories"
                isClearable
                styles={selectStyles}
                isLoading={filtersLoading}
              />
            </div>

            {/* OT Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Overtime
              </label>
              <Select
                value={filters.selectedOtFilter}
                onChange={(value) => updateFilters({ selectedOtFilter: value })}
                options={otFilterOptions}
                placeholder="All OT Status"
                isClearable
                styles={selectStyles}
                isLoading={filtersLoading}
              />
            </div>

            {/* Face Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Eye className="inline w-4 h-4 mr-1" />
                Face Registration
              </label>
              <Select
                value={filters.selectedFaceFilter}
                onChange={(value) => updateFilters({ selectedFaceFilter: value })}
                options={faceFilterOptions}
                placeholder="All Face Status"
                isClearable
                styles={selectStyles}
                isLoading={filtersLoading}
              />
            </div>

            {/* Device Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Smartphone className="inline w-4 h-4 mr-1" />
                Device Type
              </label>
              <Select
                value={filters.selectedDeviceFilter}
                onChange={(value) => updateFilters({ selectedDeviceFilter: value })}
                options={deviceFilterOptions}
                placeholder="All Devices"
                isClearable
                styles={selectStyles}
              />
            </div>
          </div>

          {/* Salary Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DollarSign className="inline w-4 h-4 mr-1" />
              Salary Range
            </label>
            <div className="flex gap-2 items-center">
              {/* Salary Type Dropdown */}
              <Select
                value={salaryFieldOptions.find(option => option.value === filters.selectedSalaryField)}
                onChange={(value) => updateFilters({ selectedSalaryField: value?.value || 'basic_salary' })}
                options={salaryFieldOptions}
                placeholder="Salary Type"
                styles={{
                  ...selectStyles,
                  control: (provided, state) => ({
                    ...selectStyles.control(provided, state),
                    minWidth: '140px'
                  })
                }}
              />
              
              <input
                type="number"
                placeholder="Min"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.minSalary}
                onChange={(e) => updateFilters({ minSalary: e.target.value })}
              />
              <span className="text-gray-500">to</span>
              <input
                type="number"
                placeholder="Max"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={filters.maxSalary}
                onChange={(e) => updateFilters({ maxSalary: e.target.value })}
              />
              <Select
                value={filters.selectedCurrency ? { value: filters.selectedCurrency, label: filters.selectedCurrency } : null}
                onChange={(value) => updateFilters({ selectedCurrency: value?.value || '' })}
                options={currencyOptions}
                placeholder="Currency"
                isClearable
                styles={{
                  ...selectStyles,
                  control: (provided, state) => ({
                    ...selectStyles.control(provided, state),
                    minWidth: '120px'
                  })
                }}
              />
            </div>
          </div>

          {/* Clear Filters Button */}
          {hasAdvancedFilters && (
            <div className="flex justify-end pt-4">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;

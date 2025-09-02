// src/components/clients/SearchAndFilters.jsx
import React, { useState } from 'react';
import Select from 'react-select';
import { Search, Filter, ChevronDown, ChevronUp, UserCheck, Clock, Eye, DollarSign } from 'lucide-react';

const SearchAndFilters = ({
  filters,
  updateFilters,
  clearAllFilters,
  searchFields,
  searchTypes,
  filterOptions,
  fieldsLoading,
  filtersLoading
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

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

  const currencyOptions = [
    { value: '', label: 'Any Currency' },
    ...filterOptions.currencies.map(currency => ({
      value: currency,
      label: currency
    }))
  ];

  const typeOptions = searchTypes.map(type => ({
    value: type,
    label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
  }));

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

  const hasAdvancedFilters = filters.selectedCombinedFilter || filters.selectedOtFilter || 
                            filters.selectedFaceFilter || filters.minSalary || filters.maxSalary;

  return (
    <div className="space-y-4">
      {/* Primary Search Bar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Search Input - Takes most space */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={filters.searchTerm}
                onChange={(e) => updateFilters({ searchTerm: e.target.value })}
                placeholder="Search staff members..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-sm"
              />
            </div>
          </div>

          {/* Status Filter - Most important filter */}
          <div>
            <Select
              options={statusOptions}
              value={filters.selectedStatus}
              onChange={(option) => updateFilters({ selectedStatus: option })}
              placeholder="Status..."
              isClearable
              styles={selectStyles}
              className="text-sm"
            />
          </div>

          {/* Advanced Toggle */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`w-full h-[42px] px-4 py-2 rounded-lg border transition-all text-sm font-medium flex items-center justify-center gap-2 ${
                showAdvanced || hasAdvancedFilters
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Filter className="h-4 w-4" />
              Filters
              {hasAdvancedFilters && (
                <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 ml-1">
                  {[filters.selectedCombinedFilter, filters.selectedOtFilter, filters.selectedFaceFilter, 
                    filters.minSalary || filters.maxSalary].filter(Boolean).length}
                </span>
              )}
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Filters - Collapsible */}
      {showAdvanced && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Advanced Filters</h3>
          </div>
          
          <div className="p-6 space-y-6">
            {/* Search Options */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Search Options</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Search Field</label>
                  <Select
                    options={fieldOptions}
                    value={filters.selectedField}
                    onChange={(option) => updateFilters({ selectedField: option })}
                    placeholder="All fields"
                    isClearable
                    isLoading={fieldsLoading}
                    styles={selectStyles}
                    className="text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Search Type</label>
                  <select
                    value={filters.searchType}
                    onChange={(e) => updateFilters({ searchType: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {typeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Filter Categories */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Filter Categories</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    <Filter className="h-3 w-3 inline mr-1" />
                    Combined Filters
                  </label>
                  <Select
                    options={combinedFilterOptions}
                    value={filters.selectedCombinedFilter}
                    onChange={(option) => updateFilters({ 
                      selectedCombinedFilter: option,
                      ...(option && { selectedOtFilter: null, selectedFaceFilter: null })
                    })}
                    placeholder="Select filter..."
                    isClearable
                    isLoading={filtersLoading}
                    styles={selectStyles}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    <Clock className="h-3 w-3 inline mr-1" />
                    Overtime Status
                  </label>
                  <Select
                    options={otFilterOptions}
                    value={filters.selectedOtFilter}
                    onChange={(option) => updateFilters({ 
                      selectedOtFilter: option,
                      ...(option && { selectedCombinedFilter: null })
                    })}
                    placeholder="OT status..."
                    isClearable
                    isLoading={filtersLoading}
                    styles={selectStyles}
                    className="text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    <Eye className="h-3 w-3 inline mr-1" />
                    Face Recognition
                  </label>
                  <Select
                    options={faceFilterOptions}
                    value={filters.selectedFaceFilter}
                    onChange={(option) => updateFilters({ 
                      selectedFaceFilter: option,
                      ...(option && { selectedCombinedFilter: null })
                    })}
                    placeholder="Face status..."
                    isClearable
                    isLoading={filtersLoading}
                    styles={selectStyles}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Salary Filter */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                <DollarSign className="h-4 w-4 inline mr-1" />
                Salary Range
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Salary Type</label>
                  <select
                    value={filters.selectedSalaryField}
                    onChange={(e) => updateFilters({ selectedSalaryField: e.target.value })}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    {filterOptions.salaryFields.map(field => (
                      <option key={field.value} value={field.value}>
                        {field.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Min Salary</label>
                  <input
                    type="number"
                    value={filters.minSalary}
                    onChange={(e) => updateFilters({ minSalary: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Max Salary</label>
                  <input
                    type="number"
                    value={filters.maxSalary}
                    onChange={(e) => updateFilters({ maxSalary: e.target.value })}
                    placeholder="No limit"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">Currency</label>
                  <Select
                    options={currencyOptions}
                    value={currencyOptions.find(opt => opt.value === filters.selectedCurrency) || null}
                    onChange={(option) => updateFilters({ selectedCurrency: option?.value || '' })}
                    placeholder="Currency..."
                    isClearable
                    styles={selectStyles}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Clear Advanced Filters */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilters;

// src/components/clients/FilterControls.jsx
import React from 'react';
import Select from 'react-select';
import { Filter, Clock, Eye, UserCheck, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

const FilterControls = ({
  combinedFilterSelectOptions,
  selectedCombinedFilter,
  handleCombinedFilterChange,
  otFilterSelectOptions,
  selectedOtFilter,
  handleOtFilterChange,
  faceFilterSelectOptions,
  selectedFaceFilter,
  handleFaceFilterChange,
  statusFilterSelectOptions,
  selectedStatus,
  handleStatusFilterChange,
  currencyOptions,
  selectedCurrency,
  handleCurrencyChange,
  filtersLoading,
  error
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      minHeight: '44px',
      borderColor: state.isFocused ? '#3B82F6' : '#D1D5DB',
      boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
      '&:hover': {
        borderColor: '#9CA3AF'
      }
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#6B7280',
      fontSize: '14px'
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3B82F6' : state.isFocused ? '#F3F4F6' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      padding: '12px 16px',
      cursor: 'pointer'
    })
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <div>
            <h3 className="text-sm font-medium text-red-800">Filter Options Error</h3>
            <p className="text-sm text-red-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Filter className="h-5 w-5 text-blue-600" />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
              <p className="text-sm text-gray-500">Narrow down your results</p>
            </div>
          </div>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
          )}
        </button>
      </div>

      {/* Filter Content */}
      {isExpanded && (
        <div className="p-6 space-y-8">
          {/* Primary Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              Primary Filters
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Filter className="h-4 w-4 inline mr-2 text-gray-500" />
                  Combined Filters
                </label>
                <Select
                  options={combinedFilterSelectOptions}
                  value={selectedCombinedFilter}
                  onChange={handleCombinedFilterChange}
                  placeholder="Select combined filter..."
                  isClearable
                  isLoading={filtersLoading}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-gray-500">
                  Quick access to common filter combinations
                </p>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <UserCheck className="h-4 w-4 inline mr-2 text-gray-500" />
                  Staff Status
                </label>
                <Select
                  options={statusFilterSelectOptions}
                  value={selectedStatus}
                  onChange={handleStatusFilterChange}
                  placeholder="Select status..."
                  isClearable
                  isLoading={filtersLoading}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-gray-500">
                  Filter by active or inactive staff members
                </p>
              </div>
            </div>
          </div>

          {/* Secondary Filters */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Secondary Filters
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* OT Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Clock className="h-4 w-4 inline mr-2 text-gray-500" />
                  Overtime Status
                </label>
                <Select
                  options={otFilterSelectOptions}
                  value={selectedOtFilter}
                  onChange={handleOtFilterChange}
                  placeholder="Select OT status..."
                  isClearable
                  isLoading={filtersLoading}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-gray-500">
                  Filter by overtime eligibility
                </p>
              </div>

              {/* Face Filter */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  <Eye className="h-4 w-4 inline mr-2 text-gray-500" />
                  Face Recognition
                </label>
                <Select
                  options={faceFilterSelectOptions}
                  value={selectedFaceFilter}
                  onChange={handleFaceFilterChange}
                  placeholder="Select face status..."
                  isClearable
                  isLoading={filtersLoading}
                  styles={customSelectStyles}
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
                <p className="text-xs text-gray-500">
                  Filter by face registration status
                </p>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {filtersLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-sm text-gray-600">Loading filter options...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterControls;

// src/components/clients/FilterControls.jsx
import React from 'react';
import Select from 'react-select';
import { Filter, Clock, Eye } from 'lucide-react';

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
  currencyOptions,
  selectedCurrency,
  handleCurrencyChange,
  filtersLoading
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
      {/* Combined Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Filter className="w-4 h-4 inline mr-1" />
          Combined Filter
        </label>
        <Select
          options={combinedFilterSelectOptions}
          value={selectedCombinedFilter}
          onChange={handleCombinedFilterChange}
          placeholder="Select combined filter"
          isClearable
          isLoading={filtersLoading}
          className="text-sm"
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: '38px',
              border: '1px solid #d1d5db',
              '&:hover': {
                border: '1px solid #6366f1'
              }
            })
          }}
        />
      </div>

      {/* OT Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Clock className="w-4 h-4 inline mr-1" />
          OT Filter
        </label>
        <Select
          options={otFilterSelectOptions}
          value={selectedOtFilter}
          onChange={handleOtFilterChange}
          placeholder="Select OT filter"
          isClearable
          isLoading={filtersLoading}
          isDisabled={selectedCombinedFilter !== null}
          className="text-sm"
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: '38px',
              border: '1px solid #d1d5db',
              backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
              '&:hover': {
                border: state.isDisabled ? '1px solid #d1d5db' : '1px solid #6366f1'
              }
            })
          }}
        />
      </div>

      {/* Face Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Eye className="w-4 h-4 inline mr-1" />
          Face Filter
        </label>
        <Select
          options={faceFilterSelectOptions}
          value={selectedFaceFilter}
          onChange={handleFaceFilterChange}
          placeholder="Select face filter"
          isClearable
          isLoading={filtersLoading}
          isDisabled={selectedCombinedFilter !== null}
          className="text-sm"
          styles={{
            control: (provided, state) => ({
              ...provided,
              minHeight: '38px',
              border: '1px solid #d1d5db',
              backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
              '&:hover': {
                border: state.isDisabled ? '1px solid #d1d5db' : '1px solid #6366f1'
              }
            })
          }}
        />
      </div>

      {/* Currency Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Currency
        </label>
        <Select
          options={currencyOptions}
          value={currencyOptions.find(c => c.value === selectedCurrency) || null}
          onChange={handleCurrencyChange}
          placeholder="Select currency"
          isClearable
          className="text-sm"
          styles={{
            control: (provided) => ({
              ...provided,
              minHeight: '38px',
              border: '1px solid #d1d5db',
              '&:hover': {
                border: '1px solid #6366f1'
              }
            })
          }}
        />
      </div>
    </div>
  );
};

export default FilterControls;

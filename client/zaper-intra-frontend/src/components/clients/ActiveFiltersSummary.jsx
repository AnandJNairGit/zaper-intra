// src/components/clients/ActiveFiltersSummary.jsx
import React from 'react';
import { X, Filter } from 'lucide-react';

const ActiveFiltersSummary = ({ filters, hasActiveFilters, clearAllFilters }) => {
  if (!hasActiveFilters) return null;

  const activeFilters = [];

  if (filters.debouncedSearchTerm) {
    activeFilters.push({
      label: `"${filters.debouncedSearchTerm}"`,
      type: 'search'
    });
  }

  if (filters.selectedStatus) {
    activeFilters.push({
      label: filters.selectedStatus.label,
      type: 'status'
    });
  }

  if (filters.selectedField) {
    activeFilters.push({
      label: `Field: ${filters.selectedField.label}`,
      type: 'field'
    });
  }

  if (filters.selectedCombinedFilter) {
    activeFilters.push({
      label: filters.selectedCombinedFilter.label,
      type: 'filter'
    });
  }

  if (filters.selectedOtFilter) {
    activeFilters.push({
      label: `OT: ${filters.selectedOtFilter.label}`,
      type: 'ot'
    });
  }

  if (filters.selectedFaceFilter) {
    activeFilters.push({
      label: `Face: ${filters.selectedFaceFilter.label}`,
      type: 'face'
    });
  }

  if (filters.selectedDeviceFilter) {
    activeFilters.push({
      label: `Device: ${filters.selectedDeviceFilter.label}`,
      type: 'device'
    });
  }

  if (filters.minSalary || filters.maxSalary) {
    const range = `${filters.minSalary || '0'} - ${filters.maxSalary || '∞'}${filters.selectedCurrency ? ` ${filters.selectedCurrency}` : ''}`;
    activeFilters.push({
      label: `Salary: ${range}`,
      type: 'salary'
    });
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Filter className="w-4 h-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-900">
            Active Filters ({activeFilters.length})
          </span>
        </div>
        <button
          onClick={clearAllFilters}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
        >
          <X className="w-4 h-4 mr-1" />
          Clear All
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
          >
            {filter.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;

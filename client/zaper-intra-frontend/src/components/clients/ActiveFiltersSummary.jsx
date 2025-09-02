// src/components/clients/ActiveFiltersSummary.jsx
import React from 'react';
import { X, Filter } from 'lucide-react';

const ActiveFiltersSummary = ({ filters, hasActiveFilters, clearAllFilters }) => {
  if (!hasActiveFilters) return null;

  const activeFilters = [];

  if (filters.debouncedSearchTerm) {
    activeFilters.push({ label: `"${filters.debouncedSearchTerm}"`, type: 'search' });
  }
  if (filters.selectedStatus) {
    activeFilters.push({ label: filters.selectedStatus.label, type: 'status' });
  }
  if (filters.selectedField) {
    activeFilters.push({ label: `Field: ${filters.selectedField.label}`, type: 'field' });
  }
  if (filters.selectedCombinedFilter) {
    activeFilters.push({ label: filters.selectedCombinedFilter.label, type: 'filter' });
  }
  if (filters.selectedOtFilter) {
    activeFilters.push({ label: `OT: ${filters.selectedOtFilter.label}`, type: 'ot' });
  }
  if (filters.selectedFaceFilter) {
    activeFilters.push({ label: `Face: ${filters.selectedFaceFilter.label}`, type: 'face' });
  }
  if (filters.minSalary || filters.maxSalary) {
    const range = `${filters.minSalary || '0'} - ${filters.maxSalary || '∞'}${filters.selectedCurrency ? ` ${filters.selectedCurrency}` : ''}`;
    activeFilters.push({ label: `Salary: ${range}`, type: 'salary' });
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600" />
          <span className="text-sm font-medium text-blue-900">
            Filtering {activeFilters.length} criteria
          </span>
        </div>
        <button
          onClick={clearAllFilters}
          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 rounded-md transition-colors"
        >
          <X className="h-3 w-3" />
          Clear
        </button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-3">
        {activeFilters.map((filter, index) => (
          <span
            key={index}
            className="inline-flex items-center px-2.5 py-1 bg-white border border-blue-200 text-blue-800 text-xs font-medium rounded-md"
          >
            {filter.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;

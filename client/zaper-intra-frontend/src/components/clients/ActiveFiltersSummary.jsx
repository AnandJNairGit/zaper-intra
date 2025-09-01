// src/components/clients/ActiveFiltersSummary.jsx
import React from 'react';
import { X } from 'lucide-react';

const ActiveFiltersSummary = ({
  hasActiveFilters,
  selectedField,
  debouncedSearchTerm,
  searchType,
  selectedCombinedFilter,
  selectedOtFilter,
  selectedFaceFilter,
  minSalary,
  maxSalary,
  selectedCurrency,
  handleClearAllFilters
}) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-indigo-900 mb-2">Active Filters:</p>
          <div className="flex flex-wrap gap-2">
            {selectedField && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Field: {selectedField.label}
              </span>
            )}
            {debouncedSearchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Search: "{debouncedSearchTerm}"
              </span>
            )}
            {searchType !== 'like' && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                Type: {searchType.replace('_', ' ')}
              </span>
            )}
            {selectedCombinedFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                Combined: {selectedCombinedFilter.label}
              </span>
            )}
            {selectedOtFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                OT: {selectedOtFilter.label}
              </span>
            )}
            {selectedFaceFilter && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Face: {selectedFaceFilter.label}
              </span>
            )}
            {(minSalary || maxSalary) && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                Salary: {minSalary || '0'} - {maxSalary || '∞'}
                {selectedCurrency && ` (${selectedCurrency})`}
              </span>
            )}
          </div>
        </div>
        <button
          onClick={handleClearAllFilters}
          className="flex items-center text-sm text-indigo-700 hover:text-indigo-900 transition-colors"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </button>
      </div>
    </div>
  );
};

export default ActiveFiltersSummary;

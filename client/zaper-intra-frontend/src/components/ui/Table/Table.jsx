// src/components/ui/Table/Table.jsx
import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import Pagination from './Pagination';
import TableSkeleton from './TableSkeleton';

const Table = ({
  data = [],
  columns = [],
  loading = false,
  error = null,
  pagination = null,
  onPageChange,
  onSearch,
  searchValue = '',
  searchPlaceholder = 'Search...',
  emptyState = null,
  className = '',
  showSearch = true,
  showPagination = true,
  sortable = false,
  onSort,
  sortConfig = null,
  onRowClick,
  rowClickable = false,
  horizontalScroll = false,
  customSearchComponent = null // New prop for custom search component
}) => {
  const [localSearchValue, setLocalSearchValue] = useState(searchValue);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearchValue(value);
    
    if (onSearch) {
      clearTimeout(window.tableSearchTimeout);
      window.tableSearchTimeout = setTimeout(() => {
        onSearch({ search: value });
      }, 500);
    }
  };

  const handleSort = (columnKey) => {
    if (!sortable || !onSort) return;
    onSort(columnKey);
  };

  const handleRowClick = (item) => {
    if (rowClickable && onRowClick) {
      onRowClick(item);
    }
  };

  const getSortIcon = (columnKey) => {
    if (!sortConfig || sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-300" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-gray-600" />
      : <ChevronDown className="w-4 h-4 text-gray-600" />;
  };

  const renderCellContent = (item, column) => {
    if (column.render && typeof column.render === 'function') {
      return column.render(item[column.key], item, column);
    }
    
    const value = item[column.key];
    
    if (column.type === 'date' && value) {
      return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    if (column.type === 'number' && typeof value === 'number') {
      return value.toLocaleString();
    }
    
    return value || '-';
  };

  const defaultEmptyState = (
    <div className="text-center py-12">
      <div className="text-gray-500">
        <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <span className="text-2xl text-gray-400">📋</span>
        </div>
        <p className="text-lg font-medium text-gray-900">No data found</p>
        <p className="text-sm text-gray-500 mt-1">
          {localSearchValue ? 'Try adjusting your search terms' : 'No records to display'}
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <TableSkeleton columns={columns.length} rows={5} showSearch={showSearch} />;
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="text-center text-red-600">
          <div className="text-lg font-medium">Error loading data</div>
          <p className="text-sm text-gray-600 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  const needsHorizontalScroll = horizontalScroll || columns.some(col => col.width);

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Bar - Use custom component if provided */}
      {showSearch && (
        customSearchComponent || (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder={searchPlaceholder}
                  value={localSearchValue}
                  onChange={handleSearchChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                />
              </div>
              {pagination && (
                <div className="text-sm text-gray-500 whitespace-nowrap">
                  Showing {data.length} of {pagination.total} records
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className={needsHorizontalScroll ? "overflow-x-auto" : ""}>
          <div className={needsHorizontalScroll ? "min-w-max" : ""}>
            <table className="min-w-full divide-y divide-gray-200">
              {/* Table Header */}
              <thead className="bg-gray-50">
                <tr>
                  {columns.map((column) => (
                    <th
                      key={column.key}
                      className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                        sortable && column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                      }`}
                      onClick={() => column.sortable && handleSort(column.key)}
                      style={{ width: column.width || 'auto' }}
                    >
                      <div className="flex items-center space-x-1">
                        <span>{column.title}</span>
                        {sortable && column.sortable && getSortIcon(column.key)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              {/* Table Body */}
              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr 
                      key={item.id || index} 
                      className={`transition-colors ${
                        rowClickable 
                          ? 'hover:bg-indigo-50 cursor-pointer active:bg-indigo-100' 
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleRowClick(item)}
                    >
                      {columns.map((column) => (
                        <td
                          key={`${item.id || index}-${column.key}`}
                          className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                        >
                          {renderCellContent(item, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4">
                      {emptyState || defaultEmptyState}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {showPagination && pagination && pagination.total_pages > 1 && (
          <div className="border-t border-gray-200 bg-white">
            <Pagination
              pagination={pagination}
              onPageChange={onPageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Table;

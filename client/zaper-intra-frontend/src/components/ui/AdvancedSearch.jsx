// src/components/ui/AdvancedSearch.jsx
import { useState, useEffect } from 'react';
import { Search, X, Filter, ChevronDown } from 'lucide-react';
import useSearchFields from '../../hooks/useSearchFields';

const AdvancedSearch = ({ 
  onSearch, 
  placeholder = "Search...",
  className = "" 
}) => {
  const [searchText, setSearchText] = useState('');
  const [selectedField, setSelectedField] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  const { searchFields, searchTypes, loading, error } = useSearchFields();

  // Set default values when search fields load
  useEffect(() => {
    if (searchFields.length > 0 && !selectedField) {
      setSelectedField({ alias: 'all', field: 'all', type: 'text', label: 'All Fields' });
    }
    if (searchTypes.length > 0 && !selectedType) {
      const defaultType = searchTypes.find(type => type === 'like') || searchTypes[0];
      setSelectedType({ value: defaultType, label: defaultType.replace('_', ' ').toUpperCase() });
    }
  }, [searchFields, searchTypes, selectedField, selectedType]);

  const handleSearch = () => {
    const searchParams = {
      search: searchText,
      ...(selectedField && selectedField.alias !== 'all' && { searchField: selectedField.alias }),
      ...(selectedType && selectedType.value !== 'like' && { searchType: selectedType.value })
    };
    
    onSearch(searchParams);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchText('');
    setSelectedField(searchFields.length > 0 ? { alias: 'all', field: 'all', type: 'text', label: 'All Fields' } : null);
    setSelectedType(searchTypes.length > 0 ? { value: 'like', label: 'LIKE' } : null);
    onSearch({ search: '' });
  };

  const toggleAdvancedMode = () => {
    setIsAdvancedMode(!isAdvancedMode);
  };

  // Prepare field options
  const fieldOptions = [
    { alias: 'all', field: 'all', type: 'text', label: 'All Fields' },
    ...searchFields.map(field => ({
      ...field,
      label: field.alias.charAt(0).toUpperCase() + field.alias.slice(1).replace('_', ' ')
    }))
  ];

  // Prepare search type options
  const typeOptions = searchTypes.map(type => ({
    value: type,
    label: type.replace('_', ' ').toUpperCase()
  }));

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="animate-pulse flex space-x-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 w-20 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-4 space-y-4 ${className}`}>
      {/* Basic Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={placeholder}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          {searchText && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex gap-2">
          <button
            onClick={toggleAdvancedMode}
            className={`flex items-center px-3 py-2 border rounded-lg transition-colors ${
              isAdvancedMode 
                ? 'border-indigo-500 text-indigo-600 bg-indigo-50' 
                : 'border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            <ChevronDown className={`w-4 h-4 ml-2 transition-transform ${isAdvancedMode ? 'rotate-180' : ''}`} />
          </button>

          <button
            onClick={handleSearch}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Advanced Search Options */}
      {isAdvancedMode && (
        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search In</label>
            <div className="relative">
              <select
                value={selectedField?.alias || ''}
                onChange={(e) => {
                  const field = fieldOptions.find(f => f.alias === e.target.value);
                  setSelectedField(field);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                {fieldOptions.map((field) => (
                  <option key={field.alias} value={field.alias}>
                    {field.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Type</label>
            <div className="relative">
              <select
                value={selectedType?.value || ''}
                onChange={(e) => {
                  const type = typeOptions.find(t => t.value === e.target.value);
                  setSelectedType(type);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none bg-white"
              >
                {typeOptions.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
      )}

      {/* Current Search Info */}
      {(searchText || (selectedField && selectedField.alias !== 'all') || (selectedType && selectedType.value !== 'like')) && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
          <span className="font-medium">Current search:</span>
          {searchText && <span className="bg-white px-2 py-1 rounded border">"{searchText}"</span>}
          {selectedField && selectedField.alias !== 'all' && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">in {selectedField.label}</span>
          )}
          {selectedType && selectedType.value !== 'like' && (
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{selectedType.label}</span>
          )}
          <button
            onClick={clearSearch}
            className="ml-auto text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
          Error loading search options: {error}
        </div>
      )}
    </div>
  );
};

export default AdvancedSearch;

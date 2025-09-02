// // src/components/clients/SearchControls.jsx
// import React from 'react';
// import Select from 'react-select';
// import { Search } from 'lucide-react';

// const SearchControls = ({
//   fieldOptions,
//   selectedField,
//   handleFieldChange,
//   searchTerm,
//   handleSearchChange,
//   searchType,
//   typeOptions,
//   handleSearchTypeChange,
//   fieldsLoading
// }) => {
//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
//       {/* Field Selector */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           <Search className="w-4 h-4 inline mr-1" />
//           Search Field
//         </label>
//         <Select
//           options={fieldOptions}
//           value={selectedField}
//           onChange={handleFieldChange}
//           placeholder="Select field to search"
//           isClearable
//           isLoading={fieldsLoading}
//           className="text-sm"
//           styles={{
//             control: (provided) => ({
//               ...provided,
//               minHeight: '38px',
//               border: '1px solid #d1d5db',
//               '&:hover': {
//                 border: '1px solid #6366f1'
//               }
//             })
//           }}
//         />
//       </div>

//       {/* Search Input */}
//       <div className="lg:col-span-2">
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Search Term
//         </label>
//         <input
//           type="text"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           placeholder={selectedField ? `Search by ${selectedField.label.toLowerCase()}...` : "Search across all fields..."}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//         />
//       </div>

//       {/* Search Type */}
//       <div>
//         <label className="block text-sm font-medium text-gray-700 mb-2">
//           Search Type
//         </label>
//         <select
//           value={searchType}
//           onChange={handleSearchTypeChange}
//           className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//         >
//           {typeOptions.map(option => (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default SearchControls;

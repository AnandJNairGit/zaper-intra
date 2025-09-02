// // src/components/clients/SalaryFilter.jsx
// import React from 'react';
// import { DollarSign, X, CheckCircle2, XCircle } from 'lucide-react';

// const SalaryFilter = ({
//   filterOptions,
//   selectedSalaryField,
//   handleSalaryFieldChange,
//   minSalary,
//   handleMinSalaryChange,
//   maxSalary,
//   handleMaxSalaryChange,
//   selectedCurrency,
//   handleClearAllFilters
// }) => {
//   return (
//     <div className="border-t border-gray-200 pt-6">
//       <div className="mb-4">
//         <h4 className="text-sm font-medium text-gray-700 mb-3">
//           <DollarSign className="w-4 h-4 inline mr-1" />
//           Salary Filter
//         </h4>
        
//         {/* Salary Field Radio Buttons */}
//         <div className="mb-4">
//           <label className="block text-sm font-medium text-gray-600 mb-2">Salary Type</label>
//           <div className="flex flex-wrap gap-6">
//             {filterOptions.salaryFields.map((field) => (
//               <label key={field.value} className="inline-flex items-center">
//                 <input
//                   type="radio"
//                   name="salaryField"
//                   value={field.value}
//                   checked={selectedSalaryField === field.value}
//                   onChange={handleSalaryFieldChange}
//                   className="form-radio h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">
//                   {field.label}
//                   <span className="block text-xs text-gray-500">{field.description}</span>
//                 </span>
//               </label>
//             ))}
//           </div>
//         </div>

//         {/* Salary Range Inputs */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Minimum Salary
//             </label>
//             <input
//               type="number"
//               min="0"
//               step="1000"
//               value={minSalary}
//               onChange={handleMinSalaryChange}
//               placeholder="Enter minimum salary"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-600 mb-2">
//               Maximum Salary
//             </label>
//             <input
//               type="number"
//               min="0"
//               step="1000"
//               value={maxSalary}
//               onChange={handleMaxSalaryChange}
//               placeholder="Enter maximum salary"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
//             />
//           </div>
//         </div>

//         {/* Salary Range Validation */}
//         {minSalary && maxSalary && parseInt(minSalary) > parseInt(maxSalary) && (
//           <div className="mt-2 flex items-center text-red-600">
//             <XCircle className="w-4 h-4 mr-1" />
//             <span className="text-sm">Minimum salary cannot be greater than maximum salary</span>
//           </div>
//         )}
        
//         {(minSalary || maxSalary) && (
//           <div className="mt-2 flex items-center text-green-600">
//             <CheckCircle2 className="w-4 h-4 mr-1" />
//             <span className="text-sm">
//               Filtering by {filterOptions.salaryFields.find(f => f.value === selectedSalaryField)?.label}:
//               {minSalary && ` ≥ ${parseInt(minSalary).toLocaleString()}`}
//               {minSalary && maxSalary && ' and'}
//               {maxSalary && ` ≤ ${parseInt(maxSalary).toLocaleString()}`}
//               {selectedCurrency && ` (${selectedCurrency})`}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Clear All Button */}
//       <div className="flex justify-end">
//         <button
//           onClick={handleClearAllFilters}
//           className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors flex items-center"
//         >
//           <X className="w-4 h-4 mr-2" />
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default SalaryFilter;

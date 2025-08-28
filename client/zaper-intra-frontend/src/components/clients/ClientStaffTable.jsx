// src/components/clients/ClientStaffTable.jsx
import { useState, useMemo, useCallback, useEffect } from 'react';
import Select from 'react-select';
import { debounce } from 'lodash';
import { 
  Users, 
  Eye, 
  EyeOff, 
  Clock, 
  Phone,
  Mail,
  Smartphone,
  MapPin,
  Home,
  AlertTriangle,
  Search,
  Filter
} from 'lucide-react';
import { Table } from '../ui/Table';
import useClientStaff from '../../hooks/useClientStaff';
import useSearchFields from '../../hooks/useSearchFields';

const ClientStaffTable = ({ clientId, className = '' }) => {
  // Search-related state
  const [selectedField, setSelectedField] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('like');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  // Fetch search fields configuration
  const { searchFields, searchTypes, loading: fieldsLoading } = useSearchFields();

  // Create stable debounced function
  const debouncedSetSearch = useMemo(
    () => debounce((value) => {
      setDebouncedSearchTerm(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  // Handle search input changes
  useEffect(() => {
    debouncedSetSearch(searchTerm);
    
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [searchTerm, debouncedSetSearch]);

  // Prepare query parameters
  const queryParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageLimit
    };

    // Only add search params if they have values
    if (debouncedSearchTerm.trim()) {
      params.search = debouncedSearchTerm.trim();
    }
    
    // Use alias instead of field for searchField
    if (selectedField?.value) {
      params.searchField = selectedField.value;
    }
    
    if (searchType && searchType !== 'like') {
      params.searchType = searchType;
    }

    console.log('Query params being sent:', params); // Debug log

    return params;
  }, [currentPage, pageLimit, debouncedSearchTerm, selectedField, searchType]);

  // Fetch staff data
  const { staffs, pagination, summary, loading, error, refetch } = useClientStaff(clientId, queryParams);

  // Use alias for field options instead of internal field names
  const fieldOptions = useMemo(() => {
    if (!searchFields.length) return [];
    
    return [
      { value: null, label: 'All Fields', icon: Search },
      ...searchFields.map(field => ({
        value: field.alias, // Use alias instead of field.field
        label: field.alias.charAt(0).toUpperCase() + field.alias.slice(1),
        type: field.type,
        internalField: field.field
      }))
    ];
  }, [searchFields]);

  // Prepare options for search type selector
  const typeOptions = useMemo(() => {
    return searchTypes.map(type => ({
      value: type,
      label: type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));
  }, [searchTypes]);

  // Search input handler
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
  }, []);

  // Field selection handler
  const handleFieldChange = useCallback((option) => {
    setSelectedField(option);
    setCurrentPage(1);
  }, []);

  // Search type handler
  const handleSearchTypeChange = useCallback((e) => {
    setSearchType(e.target.value);
    setCurrentPage(1);
  }, []);

  // Pagination handler
  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedField(null);
    setSearchTerm('');
    setDebouncedSearchTerm('');
    setSearchType('like');
    setCurrentPage(1);
    debouncedSetSearch.cancel();
  }, [debouncedSetSearch]);

  // Complete table columns with ALL original fields
  const columns = useMemo(() => [
    {
      key: 'staff_details',
      title: 'Staff Details',
      width: '250px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">{item.name}</div>
          <div className="text-xs text-gray-500">Code: {item.code}</div>
          <div className="text-xs text-gray-500">ID: {item.staff_id}</div>
          {item.username !== item.name && (
            <div className="text-xs text-gray-500">Username: {item.username}</div>
          )}
        </div>
      )
    },
    {
      key: 'position_details',
      title: 'Position & Role',
      width: '200px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-sm font-medium text-gray-900">{item.designation}</div>
          <div className="text-xs text-gray-500">{item.job_profile_name}</div>
          <div className="text-xs text-gray-500">{item.contract_type}</div>
          <div className="text-xs text-gray-500">Role ID: {item.role_id}</div>
        </div>
      )
    },
    {
      key: 'contact_info',
      title: 'Contact Information',
      width: '180px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.phone_number ? (
            <div className="flex items-center text-xs text-gray-900">
              <Phone className="w-3 h-3 mr-1" />
              {item.phone_number}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No phone</div>
          )}
          {item.email ? (
            <div className="flex items-center text-xs text-gray-900">
              <Mail className="w-3 h-3 mr-1" />
              {item.email}
            </div>
          ) : (
            <div className="text-xs text-gray-400">No email</div>
          )}
        </div>
      )
    },
    {
      key: 'communication_details',
      title: 'Communication Details',
      width: '250px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.communication_details && item.communication_details.length > 0 ? (
            item.communication_details.map((comm, index) => (
              <div key={index} className="space-y-1">
                {comm.communication_address && (
                  <div className="flex items-start text-xs text-gray-900">
                    <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>{comm.communication_address}</span>
                  </div>
                )}
                {comm.permanent_address && (
                  <div className="flex items-start text-xs text-gray-500">
                    <Home className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                    <span>Permanent: {comm.permanent_address}</span>
                  </div>
                )}
                {comm.country && comm.state && (
                  <div className="text-xs text-gray-500">
                    {comm.state}, {comm.country} {comm.pincode && `- ${comm.pincode}`}
                  </div>
                )}
                {comm.bus_number && (
                  <div className="text-xs text-gray-500">Bus: {comm.bus_number}</div>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No communication details</div>
          )}
        </div>
      )
    },
    {
      key: 'emergency_contact',
      title: 'Emergency Contact',
      width: '180px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.communication_details && item.communication_details.length > 0 ? (
            item.communication_details.map((comm, index) => (
              <div key={index} className="space-y-1">
                {comm.emergency_contact_name && (
                  <div className="flex items-center text-xs text-gray-900">
                    <AlertTriangle className="w-3 h-3 mr-1 text-orange-500" />
                    <span>{comm.emergency_contact_name}</span>
                  </div>
                )}
                {comm.emergency_contact_number && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Phone className="w-3 h-3 mr-1" />
                    <span>{comm.emergency_contact_number}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No emergency contact</div>
          )}
        </div>
      )
    },
    {
      key: 'accommodation_details',
      title: 'Accommodation Details',
      width: '200px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.accommodation_details && item.accommodation_details.length > 0 ? (
            item.accommodation_details.map((acc, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-start text-xs text-gray-900">
                  <Home className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                  <span>{acc.location}</span>
                </div>
                <div className="text-xs text-gray-500">
                  {acc.city}, {acc.country}
                </div>
                {acc.created_at && (
                  <div className="text-xs text-gray-500">
                    Since: {new Date(acc.created_at).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-xs text-gray-400">No accommodation</div>
          )}
        </div>
      )
    },
    {
      key: 'personal_info',
      title: 'Personal Details',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-900">
            {item.gender || 'Not specified'}
          </div>
          {item.age && (
            <div className="text-xs text-gray-500">Age: {item.age}</div>
          )}
          {item.religion && (
            <div className="text-xs text-gray-500">{item.religion}</div>
          )}
          {item.date_of_birth && (
            <div className="text-xs text-gray-500">
              DOB: {new Date(item.date_of_birth).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: (value) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value === 'active' ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'face_registration',
      title: 'Face Registration',
      width: '140px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="flex items-center">
            {item.is_face_registered ? (
              <div className="flex items-center text-green-600">
                <Eye className="w-4 h-4 mr-1" />
                <span className="text-xs">Registered</span>
              </div>
            ) : (
              <div className="flex items-center text-red-600">
                <EyeOff className="w-4 h-4 mr-1" />
                <span className="text-xs">Not Registered</span>
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Photos: {item.total_photos} | Vectors: {item.vector_saved_photos}
          </div>
        </div>
      )
    },
    {
      key: 'overtime',
      title: 'Overtime Details',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="flex items-center">
            {item.ot_applicable ? (
              <div className="flex items-center text-blue-600">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Enabled</span>
              </div>
            ) : (
              <div className="flex items-center text-gray-400">
                <Clock className="w-4 h-4 mr-1" />
                <span className="text-xs">Disabled</span>
              </div>
            )}
          </div>
          {item.ot_above_hour && (
            <div className="text-xs text-gray-500">Above: {item.ot_above_hour}h</div>
          )}
          {item.regular_ot_rate && (
            <div className="text-xs text-gray-500">Rate: {item.regular_ot_rate}</div>
          )}
        </div>
      )
    },
    {
      key: 'salary_details',
      title: 'Salary Information',
      width: '160px',
      render: (_, item) => (
        <div className="space-y-1 text-right">
          {item.basic_salary && parseFloat(item.basic_salary) > 0 ? (
            <div>
              <div className="text-sm font-medium text-gray-900">
                {parseFloat(item.basic_salary).toLocaleString()} {item.salary_currency}
              </div>
              <div className="text-xs text-gray-500">Basic Salary</div>
              {item.take_home_salary && parseFloat(item.take_home_salary) > 0 && (
                <div className="text-xs text-gray-500">
                  Take Home: {parseFloat(item.take_home_salary).toLocaleString()}
                </div>
              )}
              {item.ctc && parseFloat(item.ctc) > 0 && (
                <div className="text-xs text-gray-500">
                  CTC: {parseFloat(item.ctc).toLocaleString()}
                </div>
              )}
            </div>
          ) : (
            <span className="text-gray-400">Not set</span>
          )}
        </div>
      )
    },
    {
      key: 'benefits',
      title: 'Benefits & Eligibility',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className={item.sick_leave_eligibility ? 'text-green-600' : 'text-gray-400'}>
              Sick Leave: {item.sick_leave_eligibility ? '✓' : '✗'}
            </div>
            <div className={item.annual_leave_eligibility ? 'text-green-600' : 'text-gray-400'}>
              Annual: {item.annual_leave_eligibility ? '✓' : '✗'}
            </div>
            <div className={item.insurance_eligibility ? 'text-green-600' : 'text-gray-400'}>
              Insurance: {item.insurance_eligibility ? '✓' : '✗'}
            </div>
            <div className={item.air_ticket_eligibility ? 'text-green-600' : 'text-gray-400'}>
              Air Ticket: {item.air_ticket_eligibility ? '✓' : '✗'}
            </div>
          </div>
        </div>
      )
    },
    {
      key: 'education_skills',
      title: 'Education & Skills',
      width: '200px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.education && (
            <div className="text-xs text-gray-900">{item.education}</div>
          )}
          {item.skills_and_proficiency && (
            <div className="text-xs text-gray-500">Skills: {item.skills_and_proficiency}</div>
          )}
          {item.language_spoken && (
            <div className="text-xs text-gray-500">Languages: {item.language_spoken}</div>
          )}
          {item.skill_type && (
            <div className="text-xs text-gray-500">Type: {item.skill_type}</div>
          )}
        </div>
      )
    },
    {
      key: 'work_details',
      title: 'Work Details',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-900">{item.user_type}</div>
          {item.reporting_to && (
            <div className="text-xs text-gray-500">Reports to: {item.reporting_to}</div>
          )}
          {item.reportees && (
            <div className="text-xs text-gray-500">Reportees: {item.reportees}</div>
          )}
          {item.vendor_id && (
            <div className="text-xs text-gray-500">Vendor: {item.vendor_id}</div>
          )}
        </div>
      )
    },
    {
      key: 'location_details',
      title: 'Location & Region',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-900">{item.client_region}</div>
          {item.accommodation && (
            <div className="text-xs text-gray-500">Accommodation: {item.accommodation}</div>
          )}
          <div className="text-xs text-gray-500">Currency: {item.client_currency || 'Not set'}</div>
        </div>
      )
    },
    {
      key: 'devices',
      title: 'Device Registration',
      width: '150px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="flex items-center">
            <Smartphone className="w-3 h-3 mr-1" />
            <span className="text-xs text-gray-900">{item.registered_devices} devices</span>
          </div>
          {item.device_types && item.device_types.length > 0 && (
            <div className="text-xs text-gray-500">
              Types: {item.device_types.join(', ')}
            </div>
          )}
          {item.last_device_registration && (
            <div className="text-xs text-gray-500">
              Last: {new Date(item.last_device_registration).toLocaleDateString()}
            </div>
          )}
        </div>
      )
    },
    {
      key: 'permissions',
      title: 'Permissions Summary',
      width: '180px',
      render: (_, item) => (
        <div className="space-y-1">
          {item.permissions && (
            <div className="text-xs space-y-1">
              <div className={`${item.permissions.can_perform_check_in ? 'text-green-600' : 'text-gray-400'}`}>
                Check-in: {item.permissions.can_perform_check_in ? '✓' : '✗'}
              </div>
              <div className={`${item.permissions.can_view_reports ? 'text-green-600' : 'text-gray-400'}`}>
                Reports: {item.permissions.can_view_reports ? '✓' : '✗'}
              </div>
              <div className={`${item.permissions.can_adjust ? 'text-green-600' : 'text-gray-400'}`}>
                Adjust: {item.permissions.can_adjust ? '✓' : '✗'}
              </div>
              <div className={`${item.permissions.can_digital_approve ? 'text-green-600' : 'text-gray-400'}`}>
                Approve: {item.permissions.can_digital_approve ? '✓' : '✗'}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'onboard_date',
      title: 'Joining Details',
      width: '140px',
      render: (_, item) => (
        <div className="space-y-1">
          <div className="text-xs text-gray-900">
            {item.onboard_date ? (
              new Date(item.onboard_date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            ) : (
              new Date(item.record_created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })
            )}
          </div>
          {item.days_since_onboarding && (
            <div className="text-xs text-gray-500">
              {item.days_since_onboarding} days
            </div>
          )}
          <div className="text-xs text-gray-500">
            Created: {new Date(item.record_created_at).toLocaleDateString()}
          </div>
        </div>
      )
    }
  ], []);

  // Custom empty state
  const emptyState = useMemo(() => (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-900">No staff members found</p>
      <p className="text-sm text-gray-500 mt-1">
        {debouncedSearchTerm ? 'Try adjusting your search terms' : 'No staff members registered for this client'}
      </p>
    </div>
  ), [debouncedSearchTerm]);

  if (fieldsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Advanced Search Controls */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex items-center space-x-4">
          {/* Field Selector */}
          <div className="w-64">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter className="w-4 h-4 inline mr-1" />
              Search Field
            </label>
            <Select
              options={fieldOptions}
              value={selectedField}
              onChange={handleFieldChange}
              placeholder="Select field to search"
              isClearable
              isLoading={fieldsLoading}
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

          {/* Search Input */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Search className="w-4 h-4 inline mr-1" />
              Search Term
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder={selectedField ? `Search by ${selectedField.label.toLowerCase()}...` : "Search across all fields..."}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            />
          </div>

          {/* Search Type */}
          <div className="w-48">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Type
            </label>
            <select
              value={searchType}
              onChange={handleSearchTypeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              {typeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          <div className="pt-7">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Search Summary */}
        {(debouncedSearchTerm || selectedField) && (
          <div className="mt-4 p-3 bg-indigo-50 rounded-md">
            <p className="text-sm text-indigo-700">
              <span className="font-medium">Active filters:</span>
              {selectedField && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Field: {selectedField.label}
                </span>
              )}
              {debouncedSearchTerm && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Search: "{debouncedSearchTerm}"
                </span>
              )}
              {searchType !== 'like' && (
                <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Type: {searchType.replace('_', ' ')}
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Staff Table */}
      <Table
        data={staffs.map(staff => ({ ...staff, id: staff.staff_id }))}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        searchValue=""
        emptyState={emptyState}
        rowClickable={false}
        sortable={false}
        showSearch={false}
        showPagination={true}
        horizontalScroll={true}
      />
    </div>
  );
};

export default ClientStaffTable;

// src/components/clients/ClientStaffTable.jsx
import { useState, useMemo } from 'react';
import { 
  Users, 
  Eye, 
  EyeOff, 
  Clock, 
  Phone,
  Mail,
  Smartphone
} from 'lucide-react';
import { Table } from '../ui/Table';
import useClientStaff from '../../hooks/useClientStaff';

const ClientStaffTable = ({ clientId, className = '' }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(10);

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageLimit,
    ...(searchTerm && { search: searchTerm })
  }), [currentPage, pageLimit, searchTerm]);

  const { staffs, pagination, summary, loading, error, refetch } = useClientStaff(clientId, queryParams);

  // Define comprehensive table columns for all staff details
  const columns = [
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
  ];

  const handleSearch = (searchValue) => {
    setSearchTerm(searchValue);
    setCurrentPage(1);
    refetch({
      page: 1,
      limit: pageLimit,
      ...(searchValue && { search: searchValue })
    });
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    refetch({
      ...queryParams,
      page: newPage
    });
  };

  // Custom empty state for staff
  const emptyState = (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-900">No staff members found</p>
      <p className="text-sm text-gray-500 mt-1">
        {searchTerm ? 'Try adjusting your search terms' : 'No staff members registered for this client'}
      </p>
    </div>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Staff Table Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-900">Staff Members</h3>
          {summary && (
            <div className="text-sm text-gray-600">
              Client: {summary.client_info?.client_name} | Total: {summary.total_staff} staff
            </div>
          )}
        </div>
      </div>

      {/* Using the existing Table component */}
      <Table
        data={staffs.map(staff => ({ ...staff, id: staff.staff_id }))}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        searchPlaceholder="Search staff by name, code, designation, or any field..."
        emptyState={emptyState}
        rowClickable={false}
        sortable={false}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
};

export default ClientStaffTable;

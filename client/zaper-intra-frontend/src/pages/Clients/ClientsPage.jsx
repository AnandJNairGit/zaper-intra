// src/pages/Clients/ClientsPage.jsx
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Building2, TrendingUp } from 'lucide-react';
import useClients from '../../hooks/useClients';
import { Table } from '../../components/ui/Table';

const ClientsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageLimit] = useState(50);

  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: pageLimit,
    ...(searchTerm && { search: searchTerm })
  }), [currentPage, pageLimit, searchTerm]);

  const { clients, pagination, summary, loading, error, refetch } = useClients(queryParams);

  // Calculate stats from the actual data
  const stats = useMemo(() => {
    if (!clients.length && !summary) return { total: 0, active: 0, totalStaff: 0 };
    
    return {
      total: summary?.total_clients || pagination?.total || 0,
      active: clients.length,
      totalStaff: clients.reduce((sum, client) => sum + (client.total_staff_count || 0), 0)
    };
  }, [clients, summary, pagination]);

  // Handle row click - navigate to client details
  const handleRowClick = (client) => {
    navigate(`/clients/${client.client_id}`);
  };

  // Define table columns
  const columns = [
    {
      key: 'client_name',
      title: 'Client Name',
      sortable: true,
      render: (value, item) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">ID: {item.client_id}</div>
        </div>
      )
    },
    {
      key: 'registered_date',
      title: 'Registered Date',
      type: 'date',
      sortable: true,
      width: '150px'
    },
    {
      key: 'total_staff_count',
      title: 'Staff Count',
      type: 'number',
      sortable: true,
      width: '120px',
      className: 'text-center'
    },
    {
      key: 'total_projects_count',
      title: 'Projects',
      type: 'number',
      sortable: true,
      width: '100px',
      className: 'text-center'
    },
    {
      key: 'status',
      title: 'Status',
      width: '100px',
      render: () => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Active
        </span>
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

  // Custom empty state
  const emptyState = (
    <div className="text-center py-12">
      <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
      <p className="text-lg font-medium text-gray-900">No clients found</p>
      <p className="text-sm text-gray-500 mt-1">
        {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first client'}
      </p>
    </div>
  );

  return (
    <div className="space-y-6 bg-white">
      {/* Page Header */}
      <div className="bg-white p-6 rounded-lg">
        <h1 className="text-3xl font-bold text-gray-900">Clients</h1>
        <p className="mt-2 text-gray-600">
          Manage and monitor your client relationships and their performance metrics.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Building2 className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Clients</p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalStaff}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <Table
        data={clients.map(client => ({ ...client, id: client.client_id }))}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={handlePageChange}
        onSearch={handleSearch}
        searchValue={searchTerm}
        searchPlaceholder="Search clients by name or client number..."
        emptyState={emptyState}
        rowClickable={true}
        onRowClick={handleRowClick}
        sortable={false}
        showSearch={true}
        showPagination={true}
      />
    </div>
  );
};

export default ClientsPage;

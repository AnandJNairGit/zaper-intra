// src/pages/Clients/ClientDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Activity,
  Eye,
  EyeOff,
  Briefcase,
  AlertCircle,
  Loader2
} from 'lucide-react';
import useClientStatistics from '../../hooks/useClientStatistics';
import ClientStaffTable from '../../components/clients/ClientStaffTable';

const ClientDetailsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { statistics, loading, error, refetch } = useClientStatistics(clientId);

  const handleGoBack = () => {
    navigate('/clients');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading client statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 font-medium">Error loading client statistics</p>
          <p className="text-gray-600 mt-2">{error}</p>
          <div className="mt-4 space-x-4">
            <button
              onClick={refetch}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleGoBack}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No statistics found for this client</p>
          <button
            onClick={handleGoBack}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Staff',
      value: statistics.total_staff,
      icon: Users,
      color: 'indigo',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-600',
    },
    {
      title: 'Active Staff',
      value: statistics.active_staff,
      icon: UserCheck,
      color: 'green',
      bgColor: 'bg-green-100',
      textColor: 'text-green-600',
    },
    {
      title: 'Inactive Staff',
      value: statistics.inactive_staff,
      icon: UserX,
      color: 'red',
      bgColor: 'bg-red-100',
      textColor: 'text-red-600',
    },
    {
      title: 'Total Projects',
      value: statistics.total_projects,
      icon: Briefcase,
      color: 'blue',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-600',
    },
  ];

  const faceRegistrationCards = [
    {
      title: 'With Registered Face',
      value: statistics.staff_with_registered_face,
      icon: Eye,
      percentage: statistics.staff_face_registration_percentage,
      color: 'green',
    },
    {
      title: 'Without Registered Face',
      value: statistics.staff_without_registered_face,
      icon: EyeOff,
      percentage: 100 - statistics.staff_face_registration_percentage,
      color: 'red',
    },
  ];

  const overtimeCards = [
    {
      title: 'OT Enabled (With Face)',
      value: statistics.overtime_enabled_staff_with_face,
      icon: Clock,
      color: 'blue',
    },
    {
      title: 'OT Enabled (Without Face)',
      value: statistics.overtime_enabled_staff_without_face,
      icon: Clock,
      color: 'orange',
    },
  ];

  const recentActivityCards = [
    {
      title: 'Staff Onboarded (30 days)',
      value: statistics.staff_onboarded_last_30_days,
      icon: TrendingUp,
      color: 'green',
    },
    {
      title: 'Projects Started (30 days)',
      value: statistics.projects_onboarded_last_30_days,
      icon: Calendar,
      color: 'blue',
    },
    {
      title: 'Projects Ended (30 days)',
      value: statistics.projects_ended_last_30_days,
      icon: TrendingDown,
      color: 'red',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleGoBack}
            className="flex items-center text-indigo-600 hover:text-indigo-800 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Clients
          </button>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {statistics.client_name}
                </h1>
                <p className="text-gray-600 mt-1">Client ID: {statistics.client_id}</p>
              </div>
              
              <div className="flex space-x-4">
                <div className="text-right">
                  <div className="text-sm text-gray-500">Activity Rate</div>
                  <div className="text-2xl font-bold text-green-600">
                    {statistics.staff_activity_percentage}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Face Registration</div>
                  <div className="text-2xl font-bold text-blue-600">
                    {statistics.staff_face_registration_percentage}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${card.bgColor}`}>
                    <IconComponent className={`w-6 h-6 ${card.textColor}`} />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Face Registration Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          
          {/* Face Registration Cards */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Face Registration Status
            </h3>
            <div className="space-y-4">
              {faceRegistrationCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        card.color === 'green' ? 'text-green-600' : 'text-red-600'
                      }`} />
                      <span className="font-medium text-gray-900">{card.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                      <div className={`text-sm ${
                        card.color === 'green' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {card.percentage}%
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Overtime Statistics */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Overtime Enabled Staff
            </h3>
            <div className="space-y-4">
              {overtimeCards.map((card, index) => {
                const IconComponent = card.icon;
                return (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <IconComponent className={`w-5 h-5 mr-3 ${
                        card.color === 'blue' ? 'text-blue-600' : 'text-orange-600'
                      }`} />
                      <span className="font-medium text-gray-900">{card.title}</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{card.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Recent Activity (Last 30 Days)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentActivityCards.map((card, index) => {
              const IconComponent = card.icon;
              return (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                    card.color === 'green' ? 'bg-green-100' :
                    card.color === 'blue' ? 'bg-blue-100' : 'bg-red-100'
                  }`}>
                    <IconComponent className={`w-6 h-6 ${
                      card.color === 'green' ? 'text-green-600' :
                      card.color === 'blue' ? 'text-blue-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{card.value}</div>
                  <div className="text-sm text-gray-600">{card.title}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Staff Details Table */}
        <ClientStaffTable clientId={clientId} />

      </div>
    </div>
  );
};

export default ClientDetailsPage;

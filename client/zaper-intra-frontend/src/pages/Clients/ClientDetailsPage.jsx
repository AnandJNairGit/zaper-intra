// src/pages/Clients/ClientDetailsPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Activity, 
  Eye, 
  EyeOff, 
  Briefcase, 
  AlertCircle, 
  Loader2,
  UserPlus,
  UserMinus,
  Target,
  CheckCircle2,
  XCircle
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600 mb-3" />
          <p className="text-gray-600">Loading client statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error loading client statistics</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={refetch}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!statistics) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No statistics found</h2>
          <p className="text-gray-600">No statistics found for this client</p>
        </div>
      </div>
    );
  }

  // Calculate additional percentages for bottom cards
  const staffOnboardedPercentage = statistics.total_staff > 0 
    ? Math.round((statistics.staff_onboarded_last_30_days / statistics.total_staff) * 100)
    : 0;
  
  const projectsStartedPercentage = statistics.total_projects > 0 
    ? Math.round((statistics.projects_onboarded_last_30_days / statistics.total_projects) * 100)
    : 0;
  
  const projectsEndedPercentage = statistics.total_projects > 0 
    ? Math.round((statistics.projects_ended_last_30_days / statistics.total_projects) * 100)
    : 0;

  // Define statistics cards with linear gradients and calculated percentages
  const statsCards = [
    // Staff Overview
    {
      title: 'Total Staff',
      value: statistics.total_staff,
      icon: Users,
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `Active: ${statistics.active_staff} (${Math.round((statistics.active_staff / statistics.total_staff) * 100)}%) • Inactive: ${statistics.inactive_staff} (${Math.round((statistics.inactive_staff / statistics.total_staff) * 100)}%)`,
      trend: null
    },
    {
      title: 'Staff Activity',
      value: `${statistics.staff_activity_percentage}%`,
      icon: Activity,
      gradient: 'bg-gradient-to-br from-green-500 to-green-700',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${statistics.active_staff} active out of ${statistics.total_staff} total staff`,
      trend: statistics.staff_activity_percentage >= 90 ? 'positive' : statistics.staff_activity_percentage >= 70 ? 'neutral' : 'negative'
    },

    // Face Registration Overview
    {
      title: 'Face Registration',
      value: `${statistics.staff_face_registration_percentage}%`,
      icon: Eye,
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${statistics.staff_with_face_registered} registered (${Math.round((statistics.staff_with_face_registered / statistics.total_staff) * 100)}%) • ${statistics.staff_without_face_registered} pending (${Math.round((statistics.staff_without_face_registered / statistics.total_staff) * 100)}%)`,
      trend: statistics.staff_face_registration_percentage >= 80 ? 'positive' : statistics.staff_face_registration_percentage >= 60 ? 'neutral' : 'negative'
    },

    // OT Eligibility Overview
    {
      title: 'OT Eligibility',
      value: `${statistics.ot_eligibility_percentage}%`,
      icon: Clock,
      gradient: 'bg-gradient-to-br from-amber-500 to-orange-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${statistics.all_ot_users} eligible (${Math.round((statistics.all_ot_users / statistics.total_staff) * 100)}%) • ${statistics.all_non_ot_users} not eligible (${Math.round((statistics.all_non_ot_users / statistics.total_staff) * 100)}%)`,
      trend: null
    },

    // OT with Face Registration
    {
      title: 'OT Staff with Face',
      value: `${statistics.ot_with_face_percentage}%`,
      icon: CheckCircle2,
      gradient: 'bg-gradient-to-br from-emerald-500 to-teal-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${statistics.ot_with_face_registered} registered (${Math.round((statistics.ot_with_face_registered / statistics.all_ot_users) * 100)}%) • ${statistics.ot_without_face_registered} pending (${Math.round((statistics.ot_without_face_registered / statistics.all_ot_users) * 100)}%)`,
      trend: statistics.ot_with_face_percentage >= 80 ? 'positive' : statistics.ot_with_face_percentage >= 60 ? 'neutral' : 'negative'
    },

    // Non-OT with Face Registration
    {
      title: 'Non-OT Staff with Face',
      value: `${statistics.non_ot_with_face_percentage}%`,
      icon: UserCheck,
      gradient: 'bg-gradient-to-br from-slate-500 to-gray-700',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${statistics.non_ot_with_face_registered} registered (${statistics.all_non_ot_users > 0 ? Math.round((statistics.non_ot_with_face_registered / statistics.all_non_ot_users) * 100) : 0}%) • ${statistics.non_ot_without_face_registered} pending (${statistics.all_non_ot_users > 0 ? Math.round((statistics.non_ot_without_face_registered / statistics.all_non_ot_users) * 100) : 0}%)`,
      trend: statistics.all_non_ot_users > 0 ? (statistics.non_ot_with_face_percentage >= 80 ? 'positive' : 'neutral') : null
    },

    // Projects
    {
      title: 'Total Projects',
      value: statistics.total_projects,
      icon: Briefcase,
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `All active project assignments (100% operational)`,
      trend: null
    },

    // Recent Activity - Staff
    {
      title: 'Staff Onboarded (30d)',
      value: statistics.staff_onboarded_last_30_days,
      icon: UserPlus,
      gradient: 'bg-gradient-to-br from-teal-500 to-cyan-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `${staffOnboardedPercentage}% of total staff onboarded in last 30 days`,
      trend: statistics.staff_onboarded_last_30_days > 0 ? 'positive' : 'neutral'
    },

    // Recent Activity - Projects
    {
      title: 'Project Activity (30d)',
      value: statistics.projects_onboarded_last_30_days,
      icon: TrendingUp,
      gradient: 'bg-gradient-to-br from-cyan-500 to-blue-600',
      textColor: 'text-white',
      iconBg: 'bg-white/20',
      iconColor: 'text-white',
      subtitle: `Started: ${statistics.projects_onboarded_last_30_days} (${projectsStartedPercentage}%) • Ended: ${statistics.projects_ended_last_30_days} (${projectsEndedPercentage}%)`,
      trend: statistics.projects_onboarded_last_30_days > 0 ? 'positive' : 'neutral'
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend === 'positive') return <TrendingUp className="h-4 w-4 text-green-300" />;
    if (trend === 'negative') return <TrendingUp className="h-4 w-4 text-red-300 rotate-180" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleGoBack}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span className="font-medium">Back to Clients</span>
                </button>
                <div className="h-8 border-l border-gray-300" />
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{statistics.client_name}</h1>
                  <p className="text-base text-gray-500 mt-1">Client ID: {statistics.client_id}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Statistics Overview</h2>
            <button 
              onClick={refetch}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Activity className="h-4 w-4" />
              Refresh
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <div
                  key={index}
                  className={`${card.gradient} ${card.textColor} rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-sm font-semibold opacity-95">{card.title}</p>
                        {getTrendIcon(card.trend)}
                      </div>
                      <p className="text-3xl font-bold">{typeof card.value === 'number' ? card.value.toLocaleString() : card.value}</p>
                    </div>
                    <div className={`${card.iconBg} p-3 rounded-lg backdrop-blur-sm`}>
                      <Icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                  </div>
                  {card.subtitle && (
                    <p className="text-sm opacity-90 font-medium leading-relaxed">{card.subtitle}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Breakdown Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Detailed Breakdown</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* OT Breakdown */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-3 rounded-lg shadow-md">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Overtime Breakdown</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Total OT Eligible:</span>
                  <span className="font-bold text-gray-900 text-lg">{statistics.breakdown_summary.ot_breakdown.total}</span>
                </div>
                <div className="pl-4 space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      With Face Registered:
                    </span>
                    <span className="font-semibold text-green-700">
                      {statistics.breakdown_summary.ot_breakdown.with_face} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({Math.round((statistics.breakdown_summary.ot_breakdown.with_face / statistics.breakdown_summary.ot_breakdown.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Without Face Registered:
                    </span>
                    <span className="font-semibold text-red-600">
                      {statistics.breakdown_summary.ot_breakdown.without_face} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({Math.round((statistics.breakdown_summary.ot_breakdown.without_face / statistics.breakdown_summary.ot_breakdown.total) * 100)}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Non-OT Breakdown */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-gradient-to-br from-red-500 to-red-600 p-3 rounded-lg shadow-md">
                  <UserX className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Non-OT Breakdown</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-700 font-medium">Total Non-OT:</span>
                  <span className="font-bold text-gray-900 text-lg">{statistics.breakdown_summary.non_ot_breakdown.total}</span>
                </div>
                <div className="pl-4 space-y-3">
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      With Face Registered:
                    </span>
                    <span className="font-semibold text-green-700">
                      {statistics.breakdown_summary.non_ot_breakdown.with_face} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({statistics.breakdown_summary.non_ot_breakdown.total > 0 ? Math.round((statistics.breakdown_summary.non_ot_breakdown.with_face / statistics.breakdown_summary.non_ot_breakdown.total) * 100) : 0}%)
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-600 flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Without Face Registered:
                    </span>
                    <span className="font-semibold text-red-600">
                      {statistics.breakdown_summary.non_ot_breakdown.without_face} 
                      <span className="text-sm text-gray-500 ml-1">
                        ({statistics.breakdown_summary.non_ot_breakdown.total > 0 ? Math.round((statistics.breakdown_summary.non_ot_breakdown.without_face / statistics.breakdown_summary.non_ot_breakdown.total) * 100) : 0}%)
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Table - HEADING REMOVED */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <ClientStaffTable clientId={clientId} />
        </div>
      </div>
    </div>
  );
};

export default ClientDetailsPage;

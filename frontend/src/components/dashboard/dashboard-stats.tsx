'use client';

import { useQuery } from 'react-query';
import { apiClient } from '../../lib/api-client';
import { LoadingSpinner } from '../ui/loading-spinner';
import { 
  DevicePhoneIcon, 
  CreditCardIcon, 
  CheckCircleIcon, 
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

interface DashboardStatsData {
  totalDevices: number;
  activeDevices: number;
  totalProfiles: number;
  activeProfiles: number;
  pendingProfiles: number;
  complianceIssues: number;
}

export function DashboardStats() {
  const { data, isLoading, error } = useQuery<DashboardStatsData>(
    'dashboard-stats',
    async () => {
      const response = await apiClient.get('/dashboard/stats');
      return response.data;
    },
    {
      refetchInterval: 30000, // Refresh every 30 seconds
    }
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-sm text-red-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const stats = [
    {
      name: 'Total Devices',
      value: data?.totalDevices || 0,
      icon: DevicePhoneIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      name: 'Active Devices',
      value: data?.activeDevices || 0,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      name: 'eSIM Profiles',
      value: data?.totalProfiles || 0,
      icon: CreditCardIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      name: 'Compliance Issues',
      value: data?.complianceIssues || 0,
      icon: ExclamationTriangleIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.name} className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-md ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  {stat.name}
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {stat.value.toLocaleString()}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';

import { useQuery } from 'react-query';
import { apiClient } from '../../lib/api-client';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';
import { 
  CreditCardIcon, 
  CheckCircleIcon, 
  ClockIcon,
  ExclamationCircleIcon,
  PauseCircleIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface ESIMProfile {
  id: string;
  iccid: string;
  carrier: string;
  plan: string;
  status: string;
  device?: {
    id: string;
    deviceName: string;
  };
  createdAt: string;
  activationDate?: string;
}

interface ESIMProfilesListProps {
  limit?: number;
}

export function ESIMProfilesList({ limit }: ESIMProfilesListProps) {
  const { data: profiles, isLoading, error } = useQuery<ESIMProfile[]>(
    ['esim-profiles', limit],
    async () => {
      const response = await apiClient.get('/apple/esim/profiles', {
        params: limit ? { limit } : {},
      });
      return response.data;
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
        <p className="text-sm text-red-600">Failed to load eSIM profiles</p>
      </div>
    );
  }

  if (!profiles || profiles.length === 0) {
    return (
      <div className="text-center py-8">
        <CreditCardIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No eSIM profiles</h3>
        <p className="mt-1 text-sm text-gray-500">
          No eSIM profiles have been created yet.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
      case 'installing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'suspended':
        return <PauseCircleIcon className="h-5 w-5 text-orange-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'installing':
        return 'bg-yellow-100 text-yellow-800';
      case 'suspended':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const getCarrierColor = (carrier: string) => {
    const colors = {
      'MPT': 'bg-blue-100 text-blue-800',
      'ATOM': 'bg-purple-100 text-purple-800',
      'OOREDOO': 'bg-red-100 text-red-800',
      'MYTEL': 'bg-green-100 text-green-800',
    };
    return colors[carrier as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="card">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {profiles.map((profile) => (
            <li key={profile.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <CreditCardIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {profile.plan}
                  </p>
                  <p className="text-sm text-gray-500">
                    ICCID: {profile.iccid.slice(-8)}
                  </p>
                  {profile.device ? (
                    <p className="text-xs text-gray-400">
                      Assigned to: {profile.device.deviceName}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-400">Not assigned</p>
                  )}
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getCarrierColor(profile.carrier)}`}>
                      {profile.carrier}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(profile.status)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(profile.status)}`}>
                      {profile.status}
                    </span>
                  </div>
                  
                  <p className="text-xs text-gray-500">
                    {profile.activationDate 
                      ? `Activated ${format(new Date(profile.activationDate), 'MMM d')}`
                      : `Created ${format(new Date(profile.createdAt), 'MMM d')}`
                    }
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {limit && profiles.length >= limit && (
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/esim"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all eSIM profiles →
          </Link>
        </div>
      )}
    </div>
  );
}
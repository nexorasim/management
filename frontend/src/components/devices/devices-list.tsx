'use client';

import { useQuery } from 'react-query';
import { apiClient } from '../../lib/api-client';
import { LoadingSpinner } from '../ui/loading-spinner';
import { format } from 'date-fns';
import { 
  DevicePhoneIcon, 
  CheckCircleIcon, 
  ExclamationCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface Device {
  id: string;
  udid: string;
  deviceName: string;
  model: string;
  osVersion: string;
  isSupervised: boolean;
  enrollmentStatus: string;
  lastSeen: string;
  esimProfiles: any[];
}

interface DevicesListProps {
  limit?: number;
}

export function DevicesList({ limit }: DevicesListProps) {
  const { data: devices, isLoading, error } = useQuery<Device[]>(
    ['devices', limit],
    async () => {
      const response = await apiClient.get('/apple/devices', {
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
        <p className="text-sm text-red-600">Failed to load devices</p>
      </div>
    );
  }

  if (!devices || devices.length === 0) {
    return (
      <div className="text-center py-8">
        <DevicePhoneIcon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No devices</h3>
        <p className="mt-1 text-sm text-gray-500">
          No Apple devices have been enrolled yet.
        </p>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'enrolled':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'enrolled':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  return (
    <div className="card">
      <div className="flow-root">
        <ul className="-my-5 divide-y divide-gray-200">
          {devices.map((device) => (
            <li key={device.id} className="py-4">
              <div className="flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <DevicePhoneIcon className="h-6 w-6 text-gray-600" />
                  </div>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {device.deviceName}
                  </p>
                  <p className="text-sm text-gray-500">
                    {device.model} • iOS {device.osVersion}
                  </p>
                  <p className="text-xs text-gray-400">
                    Last seen: {format(new Date(device.lastSeen), 'MMM d, yyyy HH:mm')}
                  </p>
                </div>
                
                <div className="flex flex-col items-end space-y-1">
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(device.enrollmentStatus)}
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(device.enrollmentStatus)}`}>
                      {device.enrollmentStatus}
                    </span>
                  </div>
                  
                  {device.isSupervised && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                      Supervised
                    </span>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    {device.esimProfiles?.length || 0} eSIM profiles
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {limit && devices.length >= limit && (
        <div className="mt-4 text-center">
          <Link
            href="/dashboard/devices"
            className="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            View all devices →
          </Link>
        </div>
      )}
    </div>
  );
}
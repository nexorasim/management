'use client';

import { useAuth } from '../../lib/auth-context';
import { DashboardLayout } from '../../components/dashboard/dashboard-layout';
import { DashboardStats } from '../../components/dashboard/dashboard-stats';
import { DevicesList } from '../../components/devices/devices-list';
import { ESIMProfilesList } from '../../components/esim/esim-profiles-list';

export default function DashboardPage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user.name}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your eSIM profiles and Apple devices from this dashboard.
          </p>
        </div>

        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Devices</h2>
            <DevicesList limit={5} />
          </div>
          
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-4">Recent eSIM Profiles</h2>
            <ESIMProfilesList limit={5} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
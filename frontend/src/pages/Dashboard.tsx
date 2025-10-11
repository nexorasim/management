import React from 'react';
import { useQuery } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { GET_PROFILE_ANALYTICS } from '../graphql/queries';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading } = useQuery(GET_PROFILE_ANALYTICS);

  const analytics = data ? JSON.parse(data.profileAnalytics) : null;

  const statusData = {
    labels: [t('active'), t('inactive')],
    datasets: [{
      data: analytics ? [analytics.active, analytics.inactive] : [0, 0],
      backgroundColor: ['#10B981', '#EF4444'],
    }],
  };

  const carrierData = {
    labels: ['MPT', 'ATOM', 'Ooredoo', 'Mytel'],
    datasets: [{
      label: t('profiles'),
      data: [45, 32, 28, 35], // Mock data
      backgroundColor: '#3B82F6',
    }],
  };

  if (loading) return <div className="p-6">{t('loading')}</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{t('totalProfiles')}</h3>
          <p className="text-3xl font-bold text-gray-900">{analytics?.total || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{t('activeProfiles')}</h3>
          <p className="text-3xl font-bold text-green-600">{analytics?.active || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{t('inactiveProfiles')}</h3>
          <p className="text-3xl font-bold text-red-600">{analytics?.inactive || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">{t('carriers')}</h3>
          <p className="text-3xl font-bold text-blue-600">4</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('profileStatus')}</h2>
          <div className="w-64 mx-auto">
            <Doughnut data={statusData} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('carrierDistribution')}</h2>
          <Bar data={carrierData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
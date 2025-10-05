"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const client_1 = require("@apollo/client");
const react_i18next_1 = require("react-i18next");
const chart_js_1 = require("chart.js");
const react_chartjs_2_1 = require("react-chartjs-2");
const queries_1 = require("../graphql/queries");
chart_js_1.Chart.register(chart_js_1.ArcElement, chart_js_1.Tooltip, chart_js_1.Legend, chart_js_1.CategoryScale, chart_js_1.LinearScale, chart_js_1.BarElement);
const Dashboard = () => {
    const { t } = (0, react_i18next_1.useTranslation)();
    const { data, loading } = (0, client_1.useQuery)(queries_1.GET_PROFILE_ANALYTICS);
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
                data: [45, 32, 28, 35],
                backgroundColor: '#3B82F6',
            }],
    };
    if (loading)
        return <div className="p-6">{t('loading')}</div>;
    return (<div className="p-6">
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
            <react_chartjs_2_1.Doughnut data={statusData}/>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">{t('carrierDistribution')}</h2>
          <react_chartjs_2_1.Bar data={carrierData}/>
        </div>
      </div>
    </div>);
};
exports.default = Dashboard;
//# sourceMappingURL=Dashboard.js.map
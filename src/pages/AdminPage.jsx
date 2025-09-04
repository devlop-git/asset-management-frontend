import { useAuth } from '../context/AuthContext';

export default function AdminPage() {
  const { user } = useAuth();

  const stats = [
    { name: 'Total Users', value: '2,847', change: '+12%', changeType: 'positive' },
    { name: 'Active Sessions', value: '1,234', change: '+8%', changeType: 'positive' },
    { name: 'Revenue', value: '$42,350', change: '-3%', changeType: 'negative' },
    { name: 'Conversion Rate', value: '3.24%', change: '+0.5%', changeType: 'positive' },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Created new account', time: '2 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '5 minutes ago' },
    { id: 3, user: 'Bob Johnson', action: 'Logged in', time: '8 minutes ago' },
    { id: 4, user: 'Alice Brown', action: 'Made a purchase', time: '12 minutes ago' },
    { id: 5, user: 'Charlie Wilson', action: 'Reset password', time: '15 minutes ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden rounded-lg shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  stat.changeType === 'positive' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {stat.change} from last month
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{activity.user}</p>
                <p className="text-sm text-gray-500">{activity.action}</p>
              </div>
              <div className="text-sm text-gray-500">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <button className="btn-primary text-left p-4 h-auto flex flex-col items-start">
            <span className="font-medium">Create User</span>
            <span className="text-sm opacity-90">Add a new user to the system</span>
          </button>
          <button className="btn-secondary text-left p-4 h-auto flex flex-col items-start">
            <span className="font-medium">Export Data</span>
            <span className="text-sm opacity-90">Download user data as CSV</span>
          </button>
          <button className="btn-secondary text-left p-4 h-auto flex flex-col items-start">
            <span className="font-medium">System Settings</span>
            <span className="text-sm opacity-90">Configure application settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
'use client';

import { 
  ChartBarIcon, 
  CreditCardIcon, 
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ClockIcon,
  WalletIcon,
  BellIcon,
  Cog6ToothIcon,
  PlusIcon,
  ChartPieIcon,
  BuildingLibraryIcon,
  ShoppingBagIcon,
  HomeModernIcon,
  TruckIcon,
  FilmIcon,
  HeartIcon
} from "@heroicons/react/24/outline";
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement
);

export default function DashboardPreview() {
  // Sample data for the charts
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Income',
        data: [3200, 3800, 3500, 4200, 4100, 4800],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Expenses',
        data: [2800, 3200, 2900, 3400, 3300, 3600],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(156, 163, 175, 0.1)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  const transactions = [
    { id: 1, name: 'Grocery Shopping', amount: -120.50, date: '2024-01-15', category: 'Food' },
    { id: 2, name: 'Salary Deposit', amount: 4800.00, date: '2024-01-14', category: 'Income' },
    { id: 3, name: 'Netflix Subscription', amount: -15.99, date: '2024-01-13', category: 'Entertainment' },
    { id: 4, name: 'Freelance Payment', amount: 850.00, date: '2024-01-12', category: 'Income' },
  ];

  const budgetData = {
    labels: ['Housing', 'Transport', 'Food', 'Entertainment', 'Healthcare', 'Other'],
    datasets: [{
      data: [1200, 400, 600, 300, 400, 250],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(107, 114, 128, 0.8)',
      ],
      borderWidth: 0,
    }]
  };

  const portfolioData = {
    labels: ['Stocks', 'Bonds', 'Crypto', 'Real Estate'],
    datasets: [{
      data: [45, 25, 15, 15],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(139, 92, 246, 0.8)',
      ],
      borderWidth: 0,
    }]
  };

  const quickActions = [
    { icon: <BanknotesIcon className="h-6 w-6" />, label: 'Transfer', color: 'bg-blue-100 text-blue-600' },
    { icon: <CreditCardIcon className="h-6 w-6" />, label: 'Pay Bills', color: 'bg-purple-100 text-purple-600' },
    { icon: <WalletIcon className="h-6 w-6" />, label: 'Top Up', color: 'bg-green-100 text-green-600' },
    { icon: <ChartPieIcon className="h-6 w-6" />, label: 'Invest', color: 'bg-orange-100 text-orange-600' },
  ];

  const upcomingBills = [
    { name: 'Rent', amount: 1200, dueDate: '2024-01-30', icon: <HomeModernIcon className="h-5 w-5" />, color: 'bg-blue-100 text-blue-600' },
    { name: 'Car Insurance', amount: 150, dueDate: '2024-02-05', icon: <TruckIcon className="h-5 w-5" />, color: 'bg-green-100 text-green-600' },
    { name: 'Netflix', amount: 15.99, dueDate: '2024-02-10', icon: <FilmIcon className="h-5 w-5" />, color: 'bg-red-100 text-red-600' },
    { name: 'Gym', amount: 50, dueDate: '2024-02-15', icon: <HeartIcon className="h-5 w-5" />, color: 'bg-pink-100 text-pink-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Quick Actions */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Financial Dashboard</h1>
            <p className="text-gray-500">Welcome back, Alex!</p>
          </div>
          <div className="flex items-center space-x-4">
            <button className="bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50">
              <BellIcon className="h-5 w-5" />
            </button>
            <button className="bg-white p-2 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50">
              <Cog6ToothIcon className="h-5 w-5" />
            </button>
            <button className="bg-white px-4 py-2 rounded-lg shadow-sm text-gray-600 hover:bg-gray-50">
              <ClockIcon className="h-5 w-5 inline mr-2" />
              Last 30 Days
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-blue-700">
              + Add Transaction
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {quickActions.map((action, index) => (
            <button key={index} className="flex items-center p-4 bg-white rounded-xl shadow-sm hover:bg-gray-50 transition-colors">
              <div className={`p-3 rounded-lg ${action.color} mr-4`}>
                {action.icon}
              </div>
              <span className="font-medium text-gray-900">{action.label}</span>
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                <p className="text-2xl font-bold text-gray-900">$12,750.80</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+12.5% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Income</p>
                <p className="text-2xl font-bold text-gray-900">$4,850.00</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <ArrowTrendingUpIcon className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              <span>+8.2% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Monthly Expenses</p>
                <p className="text-2xl font-bold text-gray-900">$2,150.00</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <ArrowTrendingDownIcon className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-red-600">
              <ArrowTrendingDownIcon className="h-4 w-4 mr-1" />
              <span>-3.5% from last month</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Savings Goal</p>
                <p className="text-2xl font-bold text-gray-900">75%</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Charts Section */}
        <div className="grid grid-cols-12 gap-6 mb-8">
          {/* Main Chart */}
          <div className="col-span-8 bg-white p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Income vs Expenses</h2>
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </div>
            <Line data={monthlyData} options={chartOptions} />
          </div>

          {/* Budget Overview */}
          <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
            <Doughnut 
              data={budgetData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Recent Transactions - Keep existing code but in col-span-4 */}
          <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${
                      transaction.amount > 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {transaction.amount > 0 ? (
                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-600" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.category}</p>
                    </div>
                  </div>
                  <div className={`font-medium ${
                    transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}{transaction.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 w-full text-center">
              View All Transactions →
            </button>
          </div>

          {/* Investment Portfolio */}
          <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Investment Portfolio</h2>
            <Doughnut 
              data={portfolioData}
              options={{
                cutout: '70%',
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      boxWidth: 12,
                      padding: 15,
                    }
                  }
                }
              }}
            />
            <div className="mt-4">
              <button className="w-full bg-gray-50 text-blue-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium">
                View Investment Details →
              </button>
            </div>
          </div>

          {/* Upcoming Bills */}
          <div className="col-span-4 bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bills</h2>
            <div className="space-y-4">
              {upcomingBills.map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${bill.color}`}>
                      {bill.icon}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{bill.name}</p>
                      <p className="text-sm text-gray-500">Due {new Date(bill.dueDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-gray-900 font-medium">
                    ${bill.amount.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 text-blue-600 text-sm font-medium hover:text-blue-700 w-full text-center">
              View All Bills →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 
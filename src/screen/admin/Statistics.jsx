import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Package
} from 'lucide-react';
import { priceFormatter } from './../../util/priceFormatter';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Đăng ký các components của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function Statistics() {
  // Mock data - Thay thế bằng dữ liệu thực từ API
  const [stats, setStats] = useState({
    totalRevenue: 15000000,
    totalOrders: 150,
    totalCustomers: 80,
    averageOrderValue: 187500,
    revenueGrowth: 12.5,
    orderGrowth: 8.2,
    customerGrowth: 5.7,
    topProducts: [
      { name: 'Cà phê sữa', quantity: 450, revenue: 6750000 },
      { name: 'Trà sữa', quantity: 380, revenue: 5700000 },
      { name: 'Bánh mì', quantity: 320, revenue: 4800000 },
      { name: 'Xôi', quantity: 280, revenue: 4200000 },
      { name: 'Phở', quantity: 250, revenue: 3750000 },
    ],
    hourlyOrders: [
      { hour: '08:00', orders: 15 },
      { hour: '09:00', orders: 25 },
      { hour: '10:00', orders: 35 },
      { hour: '11:00', orders: 45 },
      { hour: '12:00', orders: 55 },
      { hour: '13:00', orders: 40 },
      { hour: '14:00', orders: 30 },
      { hour: '15:00', orders: 25 },
      { hour: '16:00', orders: 20 },
      { hour: '17:00', orders: 15 },
    ],
    weeklyRevenue: [
      { day: 'T2', revenue: 12000000 },
      { day: 'T3', revenue: 15000000 },
      { day: 'T4', revenue: 18000000 },
      { day: 'T5', revenue: 16000000 },
      { day: 'T6', revenue: 20000000 },
      { day: 'T7', revenue: 25000000 },
      { day: 'CN', revenue: 22000000 },
    ],
    categoryRevenue: [
      { name: 'Đồ uống', revenue: 45000000 },
      { name: 'Đồ ăn', revenue: 35000000 },
      { name: 'Tráng miệng', revenue: 20000000 },
      { name: 'Khác', revenue: 10000000 },
    ],
  });

  // Cấu hình cho biểu đồ đường
  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return priceFormatter(value).formattedPrice;
          }
        }
      }
    }
  };

  // Dữ liệu cho biểu đồ đường
  const lineChartData = {
    labels: stats.weeklyRevenue.map(item => item.day),
    datasets: [
      {
        label: 'Doanh thu theo ngày',
        data: stats.weeklyRevenue.map(item => item.revenue),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.4,
      },
    ],
  };

  // Cấu hình cho biểu đồ cột
  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' đơn';
          }
        }
      }
    }
  };

  // Dữ liệu cho biểu đồ cột
  const barChartData = {
    labels: stats.hourlyOrders.map(item => item.hour),
    datasets: [
      {
        label: 'Số đơn hàng theo giờ',
        data: stats.hourlyOrders.map(item => item.orders),
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      },
    ],
  };

  // Cấu hình cho biểu đồ tròn
  const doughnutChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
      title: {
        display: false,
      },
    },
  };

  // Dữ liệu cho biểu đồ tròn
  const doughnutChartData = {
    labels: stats.categoryRevenue.map(item => item.name),
    datasets: [
      {
        data: stats.categoryRevenue.map(item => item.revenue),
        backgroundColor: [
          'rgba(59, 130, 246, 0.5)',
          'rgba(16, 185, 129, 0.5)',
          'rgba(245, 158, 11, 0.5)',
          'rgba(239, 68, 68, 0.5)',
        ],
        borderColor: [
          'rgb(59, 130, 246)',
          'rgb(16, 185, 129)',
          'rgb(245, 158, 11)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
    <div>
          <h1 className="text-2xl font-semibold text-gray-800">Thống kê</h1>
          <p className="text-gray-500">Tổng quan về hoạt động kinh doanh</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200">
          <Calendar className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Hôm nay</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex items-center gap-1 text-green-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.revenueGrowth}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</h3>
          <p className="text-2xl font-semibold text-gray-800">{priceFormatter(stats.totalRevenue).formattedPrice}</p>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.orderGrowth}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng đơn hàng</h3>
          <p className="text-2xl font-semibold text-gray-800">{stats.totalOrders}</p>
        </div>

        {/* Total Customers */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-purple-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">{stats.customerGrowth}%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng khách hàng</h3>
          <p className="text-2xl font-semibold text-gray-800">{stats.totalCustomers}</p>
        </div>

        {/* Average Order Value */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex items-center gap-1 text-orange-600">
              <ArrowUpRight className="w-4 h-4" />
              <span className="text-sm font-medium">5.2%</span>
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">Giá trị đơn hàng trung bình</h3>
          <p className="text-2xl font-semibold text-gray-800">{priceFormatter(stats.averageOrderValue).formattedPrice}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Doanh thu theo ngày</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>7 ngày</span>
            </div>
          </div>
          <div className="h-64">
            <Line options={lineChartOptions} data={lineChartData} />
          </div>
        </div>

        {/* Hourly Orders Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Đơn hàng theo giờ</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>24 giờ</span>
            </div>
          </div>
          <div className="h-64">
            <Bar options={barChartOptions} data={barChartData} />
          </div>
        </div>

        {/* Category Revenue Chart */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Doanh thu theo danh mục</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>4 danh mục</span>
            </div>
          </div>
          <div className="h-64">
            <Doughnut options={doughnutChartOptions} data={doughnutChartData} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Sản phẩm bán chạy</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Package className="w-4 h-4" />
              <span>Top 5</span>
            </div>
          </div>
          <div className="space-y-4">
            {stats.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-gray-800">{product.name}</h4>
                    <p className="text-xs text-gray-500">{product.quantity} đơn</p>
                  </div>
                </div>
                <p className="text-sm font-medium text-gray-800">{priceFormatter(product.revenue).formattedPrice}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Statistics;

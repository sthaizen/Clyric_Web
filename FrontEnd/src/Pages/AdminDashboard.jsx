import React, { useState } from 'react';
import { Search, Bell, TrendingUp, Users, FileText, Video, Award, BarChart3, Settings, LogOut } from 'lucide-react';

export default function InterviewPrepAdmin() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-20 bg-zinc-950 border-r border-zinc-800 flex flex-col items-center py-6 space-y-8">
        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
          <FileText className="w-6 h-6 text-black" />
        </div>
        
        <div className="flex flex-col space-y-6 mt-8">
          <div className="w-12 h-12 bg-zinc-900 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-800 transition border border-zinc-800">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-900 transition">
            <Users className="w-5 h-5" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-900 transition">
            <Video className="w-5 h-5" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-900 transition">
            <Award className="w-5 h-5" />
          </div>
          <div className="w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-900 transition">
            <Settings className="w-5 h-5" />
          </div>
        </div>
        
        <div className="mt-auto w-12 h-12 rounded-lg flex items-center justify-center cursor-pointer hover:bg-zinc-900 transition">
          <LogOut className="w-5 h-5" />
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-20 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-light mb-1">Dashboard</h1>
            <p className="text-zinc-500 text-sm">Welcome back, Admin</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-64 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm focus:outline-none focus:border-zinc-700"
              />
              <Search className="w-4 h-4 absolute right-3 top-3 text-zinc-500" />
            </div>
            <button className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center hover:bg-zinc-800 transition">
              <Bell className="w-5 h-5" />
            </button>
            <div className="w-10 h-10 bg-white rounded-lg"></div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-6 mb-12">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between mb-4">
              <Users className="w-5 h-5 text-zinc-400" />
              <span className="text-xs text-zinc-500">+12.5%</span>
            </div>
            <p className="text-3xl font-light mb-1">8,547</p>
            <p className="text-zinc-500 text-sm">Total Users</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between mb-4">
              <Video className="w-5 h-5 text-zinc-400" />
              <span className="text-xs text-zinc-500">+8.2%</span>
            </div>
            <p className="text-3xl font-light mb-1">1,234</p>
            <p className="text-zinc-500 text-sm">Active Sessions</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between mb-4">
              <Award className="w-5 h-5 text-zinc-400" />
              <span className="text-xs text-zinc-500">+15.3%</span>
            </div>
            <p className="text-3xl font-light mb-1">6,892</p>
            <p className="text-zinc-500 text-sm">Completed</p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="w-5 h-5 text-zinc-400" />
              <span className="text-xs text-zinc-500">+24.1%</span>
            </div>
            <p className="text-3xl font-light mb-1">$45.2K</p>
            <p className="text-zinc-500 text-sm">Revenue</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left Column - Activity */}
          <div className="col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-zinc-950 border border-zinc-800 rounded-lg p-1">
              <button 
                onClick={() => setActiveTab('overview')}
                className={`flex-1 px-4 py-2 rounded-md text-sm transition ${activeTab === 'overview' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Overview
              </button>
              <button 
                onClick={() => setActiveTab('users')}
                className={`flex-1 px-4 py-2 rounded-md text-sm transition ${activeTab === 'users' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                User Activity
              </button>
              <button 
                onClick={() => setActiveTab('performance')}
                className={`flex-1 px-4 py-2 rounded-md text-sm transition ${activeTab === 'performance' ? 'bg-white text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                Performance
              </button>
            </div>

            {/* Activity Graph */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-light mb-1">Session Analytics</h3>
                  <p className="text-zinc-500 text-sm">September 9 - 27, 2024</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light">2,456</p>
                  <p className="text-zinc-500 text-sm">Total Sessions</p>
                </div>
              </div>
              
              <div className="flex items-end justify-between h-48 space-x-2">
                {[18, 25, 22, 30, 28, 35, 32, 38, 35, 42, 38, 45, 40, 35, 38, 42, 38, 35, 40, 38].map((height, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-white hover:bg-zinc-300 transition cursor-pointer rounded-t" 
                    style={{height: `${height}%`}}
                  ></div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-zinc-600">
                <span>9</span>
                <span>11</span>
                <span>13</span>
                <span>15</span>
                <span>17</span>
                <span>19</span>
                <span>21</span>
                <span>23</span>
                <span>25</span>
                <span>27</span>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-light">Recent Activity</h3>
                <select className="px-3 py-1 bg-zinc-900 border border-zinc-800 rounded text-xs focus:outline-none">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-light mb-1">New User Registration</p>
                      <p className="text-xs text-zinc-500">Dec 30, 2025 at 3:30 PM</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">Active</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Video className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Mock Interview Completed</p>
                      <p className="text-xs text-zinc-500">Dec 30, 2025 at 2:15 PM</p>
                    </div>
                  </div>
                  <span className="text-white font-light">+156</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-light mb-1">AI Feedback Generated</p>
                      <p className="text-xs text-zinc-500">Dec 30, 2025 at 1:45 PM</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-zinc-800 text-zinc-300 rounded text-xs">Auto</span>
                </div>

                <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-black" />
                    </div>
                    <div>
                      <p className="font-light mb-1">Performance Report Created</p>
                      <p className="text-xs text-zinc-500">Dec 30, 2025 at 12:30 PM</p>
                    </div>
                  </div>
                  <span className="text-zinc-400 font-light">-234</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Performance Card */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light">Platform Revenue</h3>
                <TrendingUp className="w-5 h-5 text-zinc-400" />
              </div>
              <p className="text-4xl font-light mb-2">$34,010</p>
              <p className="text-zinc-500 text-sm mb-6">+2.5% from last month</p>
              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-white text-black rounded-lg text-sm font-light hover:bg-zinc-200 transition">
                  Export
                </button>
                <button className="flex-1 px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm font-light hover:bg-zinc-800 transition">
                  Details
                </button>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light">Top Categories</h3>
                <button className="text-zinc-400 text-xs hover:text-white transition">View All</button>
              </div>

              <div className="space-y-3">
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-light text-black text-sm">TE</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-sm">Technical</p>
                      <p className="text-xs text-zinc-500">Coding & System Design</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400">$12,456</p>
                    <p className="text-white text-xs">+0.25%</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-light text-black text-sm">BH</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-sm">Behavioral</p>
                      <p className="text-xs text-zinc-500">HR & Soft Skills</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400">$8,543</p>
                    <p className="text-white text-xs">+1.56%</p>
                  </div>
                </div>

                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                      <span className="font-light text-black text-sm">CS</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-light text-sm">Case Study</p>
                      <p className="text-xs text-zinc-500">Business & Strategy</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-zinc-400">$6,234</p>
                    <p className="text-zinc-500 text-xs">-0.18%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Sessions */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-light">Live Sessions</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span className="text-xs text-zinc-500">4 Active</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Video className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-light">Python Developer</p>
                      <p className="text-xs text-zinc-500">Interview #2847</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">$188</p>
                    <p className="text-xs text-zinc-500">Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Users className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-light">Product Manager</p>
                      <p className="text-xs text-zinc-500">Interview #2846</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">$116</p>
                    <p className="text-xs text-zinc-500">Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <Award className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-light">Data Scientist</p>
                      <p className="text-xs text-zinc-500">Interview #2845</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">$215</p>
                    <p className="text-xs text-zinc-500">Active</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg hover:border-zinc-700 transition">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-light">UI/UX Designer</p>
                      <p className="text-xs text-zinc-500">Interview #2844</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-light">$207</p>
                    <p className="text-xs text-zinc-500">Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
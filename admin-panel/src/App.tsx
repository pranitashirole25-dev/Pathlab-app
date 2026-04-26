import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, Bell, Settings, LogOut, FileText, Users, Calendar, Activity, Clock, CheckCircle2 } from 'lucide-react';

const data = [
  { name: 'Nov \'22', completed: 400 },
  { name: 'Dec', completed: 1400 },
  { name: 'Jan', completed: 1350 },
  { name: 'Feb', completed: 2000 },
  { name: 'Mar', completed: 1650 },
  { name: 'Apr', completed: 2000 },
  { name: 'May', completed: 2750 },
  { name: 'Jun', completed: 2400 },
  { name: 'Jul', completed: 2600 },
  { name: 'Aug', completed: 2750 },
  { name: 'Sep', completed: 2900 },
  { name: 'Oct', completed: 3918 },
];

const mockScorecards = [
  { id: 1, name: 'Rahul Sharma', phone: '+91 9876543210', base: 15000, incentive: 2500, penalty: 150, final: 17350, status: 'Active' },
  { id: 2, name: 'Priya Patel', phone: '+91 9876543211', base: 15000, incentive: 3100, penalty: 0, final: 18100, status: 'Active' },
  { id: 3, name: 'Amit Kumar', phone: '+91 9876543212', base: 15000, incentive: 1200, penalty: 400, final: 15800, status: 'Warning' },
];

const mockLeaves = [
  { id: 1, name: 'Amit Kumar', from: '2023-11-01', to: '2023-11-03', reason: 'Family Emergency', status: 'PENDING' },
  { id: 2, name: 'Rahul Sharma', from: '2023-10-28', to: '2023-10-28', reason: 'Sick Leave', status: 'APPROVED' },
];

function App() {
  const [currentView, setCurrentView] = useState<'DASHBOARD' | 'SCORECARDS' | 'LEAVES'>('DASHBOARD');

  return (
    <div className="flex h-screen overflow-hidden bg-darkBg text-slate-200">
      
      {/* Sidebar */}
      <aside className="w-64 border-r border-glassBorder bg-glassBg backdrop-blur-md flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-glassBorder">
          <Activity className="text-primary w-8 h-8 mr-3" />
          <h1 className="text-xl font-bold tracking-wider text-white">PATHOLAB</h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button 
            onClick={() => setCurrentView('DASHBOARD')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${currentView === 'DASHBOARD' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Activity className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button 
            onClick={() => setCurrentView('SCORECARDS')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${currentView === 'SCORECARDS' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Users className="w-5 h-5 mr-3" />
            Staff Scorecards
          </button>
          <button 
            onClick={() => setCurrentView('LEAVES')}
            className={`w-full flex items-center px-4 py-3 rounded-xl font-medium transition-colors ${currentView === 'LEAVES' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'}`}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Leave Management
          </button>
        </nav>
        
        <div className="p-4 border-t border-glassBorder">
          <a href="#" className="flex items-center px-4 py-3 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-xl font-medium transition-colors">
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Glow Effects */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-success/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Header */}
        <header className="h-20 flex shrink-0 items-center justify-between px-8 border-b border-glassBorder bg-glassBg/50 backdrop-blur-sm z-10">
          <div>
            <h2 className="text-2xl font-semibold text-white">
              {currentView === 'DASHBOARD' && 'Admin Dashboard'}
              {currentView === 'SCORECARDS' && 'Staff Scorecards'}
              {currentView === 'LEAVES' && 'Leave Management'}
            </h2>
            <p className="text-sm text-slate-400">October 26, 2023 | 09:42 AM</p>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="search patient, test..." 
                className="pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-64 transition-all"
              />
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-white transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-danger rounded-full ring-2 ring-darkBg"></span>
            </button>
            
            <div className="flex items-center space-x-3 pl-6 border-l border-glassBorder">
              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-slate-600">
                <img src="https://ui-avatars.com/api/?name=Aris+Thorne&background=38BDF8&color=fff" alt="Admin" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Dr. Aris Thorne</p>
                <p className="text-xs text-success flex items-center">
                  <span className="w-1.5 h-1.5 bg-success rounded-full mr-1.5"></span>
                  Online
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto p-8 z-10">
          
          {currentView === 'DASHBOARD' && (
            <>
              {/* Top Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Card 1 */}
                <div className="glass-card flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/30">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-slate-400 font-medium mb-1">Received Bookings</h3>
                  <p className="text-4xl font-bold text-white mb-2">4,572</p>
                  <p className="text-sm text-success flex items-center font-medium">
                    +8.5% <span className="text-slate-500 ml-1 font-normal">this month</span>
                  </p>
                </div>

                {/* Card 2 */}
                <div className="glass-card flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-success/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-success/20 flex items-center justify-center border border-success/30">
                      <CheckCircle2 className="w-6 h-6 text-success" />
                    </div>
                  </div>
                  <h3 className="text-slate-400 font-medium mb-1">Completed Bookings</h3>
                  <p className="text-4xl font-bold text-white mb-2">3,918</p>
                  <p className="text-sm text-success flex items-center font-medium">
                    +12.1% <span className="text-slate-500 ml-1 font-normal">this month</span>
                  </p>
                </div>

                {/* Card 3 */}
                <div className="glass-card flex flex-col relative overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-br from-danger/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-danger/20 flex items-center justify-center border border-danger/30">
                      <Clock className="w-6 h-6 text-danger" />
                    </div>
                  </div>
                  <h3 className="text-slate-400 font-medium mb-1">Delayed Bookings</h3>
                  <p className="text-4xl font-bold text-white mb-2">654</p>
                  <p className="text-sm text-danger flex items-center font-medium">
                    +2.2% <span className="text-slate-500 ml-1 font-normal">this month</span>
                  </p>
                </div>
              </div>

              {/* Chart Section */}
              <div className="glass-card">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-xl font-semibold text-white">Month-on-Month Completed Bookings</h3>
                    <p className="text-sm text-slate-400">Last 12 months for dynamic growth line</p>
                  </div>
                  <select className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2.5 outline-none">
                    <option>Nov '22 - Oct '23</option>
                    <option>Nov '21 - Oct '22</option>
                  </select>
                </div>
                
                <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#38BDF8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#38BDF8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="name" 
                        stroke="#64748b" 
                        tick={{fill: '#94a3b8'}} 
                        axisLine={false} 
                        tickLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="#64748b" 
                        tick={{fill: '#94a3b8'}} 
                        axisLine={false} 
                        tickLine={false}
                        dx={-10}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'rgba(15, 23, 42, 0.9)', 
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          color: '#fff'
                        }}
                        itemStyle={{ color: '#38BDF8' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="completed" 
                        stroke="#38BDF8" 
                        strokeWidth={3}
                        dot={{ r: 4, fill: '#0F172A', stroke: '#38BDF8', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: '#38BDF8', stroke: '#fff', strokeWidth: 2 }}
                        fillOpacity={1} 
                        fill="url(#colorCompleted)" 
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

          {currentView === 'SCORECARDS' && (
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-6">Live Staff Scorecards (Current Month)</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800/50 text-slate-400">
                    <tr>
                      <th className="px-6 py-4 font-medium rounded-tl-xl">Phlebotomist</th>
                      <th className="px-6 py-4 font-medium">Base Salary</th>
                      <th className="px-6 py-4 font-medium text-success">Incentive Pool</th>
                      <th className="px-6 py-4 font-medium text-danger">Delay Penalties</th>
                      <th className="px-6 py-4 font-medium text-primary">Final Payout</th>
                      <th className="px-6 py-4 font-medium rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockScorecards.map((score, i) => (
                      <tr key={score.id} className="border-b border-slate-700/50 hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-white">{score.name}</div>
                          <div className="text-xs text-slate-500">{score.phone}</div>
                        </td>
                        <td className="px-6 py-4">₹{score.base.toLocaleString()}</td>
                        <td className="px-6 py-4 text-success">+₹{score.incentive.toLocaleString()}</td>
                        <td className="px-6 py-4 text-danger">-₹{score.penalty.toLocaleString()}</td>
                        <td className="px-6 py-4 font-bold text-primary">₹{score.final.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${score.status === 'Warning' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'}`}>
                            {score.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentView === 'LEAVES' && (
            <div className="glass-card">
              <h3 className="text-xl font-semibold text-white mb-6">Pending Leave Requests</h3>
              <div className="space-y-4">
                {mockLeaves.map((leave) => (
                  <div key={leave.id} className="bg-slate-800/30 border border-slate-700 rounded-xl p-5 flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-white text-lg">{leave.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">
                        <Calendar className="w-4 h-4 inline mr-1" /> {leave.from} to {leave.to}
                      </p>
                      <p className="text-slate-300 mt-2 bg-slate-800 inline-block px-3 py-1 rounded-md text-sm border border-slate-700">Reason: {leave.reason}</p>
                    </div>
                    
                    {leave.status === 'PENDING' ? (
                      <div className="flex space-x-3">
                        <button className="px-4 py-2 bg-danger/20 hover:bg-danger text-danger hover:text-white rounded-lg font-medium transition-colors">
                          Reject
                        </button>
                        <button className="px-4 py-2 bg-success/20 hover:bg-success text-success hover:text-white rounded-lg font-medium transition-colors">
                          Approve
                        </button>
                      </div>
                    ) : (
                      <span className="px-4 py-2 bg-success/10 text-success rounded-lg font-bold border border-success/20">
                        {leave.status}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}

export default App;

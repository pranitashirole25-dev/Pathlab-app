import { useState } from 'react';
import { MapPin, Clock, Phone, CheckCircle, Navigation, ShieldCheck } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'APPOINTMENT'>('LOGIN');
  const [otp, setOtp] = useState('');
  const [patientOtp, setPatientOtp] = useState('');

  // Mock data
  const appointments = [
    { id: 1, patient: 'John Doe', time: '09:00 AM', location: 'Bandra West, Mumbai', status: 'PENDING', tests: ['Lipid Profile', 'CBC'] },
    { id: 2, patient: 'Sarah Smith', time: '11:30 AM', location: 'Andheri East, Mumbai', status: 'PENDING', tests: ['Thyroid Panel'] }
  ];

  if (view === 'LOGIN') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-slate-100">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-primary mb-2">Staff Portal</h1>
            <p className="text-lightText">Login to manage your appointments</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-darkText mb-1">Phone Number</label>
              <input type="text" placeholder="Enter mobile number" className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none" />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-darkText mb-1">OTP</label>
              <input 
                type="text" 
                placeholder="• • • • • •" 
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none tracking-[0.5em] text-center text-xl font-bold" 
                maxLength={6}
              />
            </div>

            <button 
              onClick={() => setView('DASHBOARD')}
              className="w-full bg-primary hover:bg-sky-600 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-primary/30 mt-4"
            >
              Verify & Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'DASHBOARD') {
    return (
      <div className="min-h-screen bg-slate-50 pb-20">
        <div className="bg-white px-6 pt-12 pb-6 shadow-sm rounded-b-3xl">
          <h1 className="text-2xl font-bold text-darkText">Hello, Rahul 👋</h1>
          <p className="text-lightText mt-1">You have 2 pending appointments today.</p>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-darkText mb-2">Today's Schedule</h2>
          
          {appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-darkText text-lg">{apt.patient}</h3>
                <span className="bg-amber-100 text-amber-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center">
                  <Clock className="w-3 h-3 mr-1" /> {apt.time}
                </span>
              </div>
              
              <div className="flex items-center text-lightText text-sm mb-4">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                {apt.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {apt.tests.map(test => (
                  <span key={test} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{test}</span>
                ))}
              </div>

              <button 
                onClick={() => setView('APPOINTMENT')}
                className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-white font-bold py-3 rounded-xl transition-colors"
              >
                View Details & Start
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view === 'APPOINTMENT') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <div className="bg-white p-4 flex items-center shadow-sm sticky top-0">
          <button onClick={() => setView('DASHBOARD')} className="p-2 mr-2 text-slate-600">
            ← Back
          </button>
          <h1 className="text-lg font-bold">Appointment Details</h1>
        </div>

        <div className="flex-1 p-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-6">
            <h2 className="font-bold text-2xl text-darkText mb-1">John Doe</h2>
            <p className="text-lightText mb-6">+91 98765 43210</p>
            
            <div className="flex space-x-3 mb-6">
              <button className="flex-1 bg-green-100 text-green-700 py-3 rounded-xl font-bold flex justify-center items-center">
                <Phone className="w-4 h-4 mr-2" /> Call
              </button>
              <button className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-xl font-bold flex justify-center items-center">
                <Navigation className="w-4 h-4 mr-2" /> Navigate
              </button>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="font-bold text-darkText mb-4 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
                Arrived at Location?
              </h3>
              <p className="text-sm text-lightText mb-4">
                Ask the patient for the 4-digit OTP sent to their WhatsApp to verify your arrival time and prevent delay penalties.
              </p>
              
              <div className="flex space-x-3">
                <input 
                  type="text" 
                  placeholder="OTP" 
                  value={patientOtp}
                  onChange={(e) => setPatientOtp(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none tracking-widest text-center font-bold" 
                  maxLength={4}
                />
                <button 
                  onClick={() => alert('Arrival Confirmed! Penalty timer stopped.')}
                  className="bg-primary hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                >
                  Verify
                </button>
              </div>
            </div>
          </div>

          <button 
            onClick={() => { alert('Sample collected successfully!'); setView('DASHBOARD'); }}
            className="w-full bg-darkText text-white font-bold py-4 rounded-xl flex justify-center items-center shadow-lg"
          >
            <CheckCircle className="w-5 h-5 mr-2" /> Mark Sample Collected
          </button>
        </div>
      </div>
    );
  }

  return null;
}

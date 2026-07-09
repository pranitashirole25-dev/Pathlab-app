import { useState, useEffect } from 'react';
import { MapPin, Clock, Phone, CheckCircle, Navigation, ShieldCheck, Activity } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'LOGIN' | 'DASHBOARD' | 'APPOINTMENT'>('LOGIN');
  const [otp, setOtp] = useState('');
  const [patientOtp, setPatientOtp] = useState('');
  
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res = await fetch('https://pathology-backend-ipnf.onrender.com/api/bookings/staff');
      const data = await res.json();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'DASHBOARD') {
      fetchAppointments();
    }
  }, [view]);

  const updateStatus = async (id: string, status: string) => {
    try {
      await fetch(`https://pathology-backend-ipnf.onrender.com/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (status === 'COMPLETED') {
        setView('DASHBOARD');
      } else {
        fetchAppointments();
      }
    } catch (err) {
      console.error(err);
    }
  };

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
          <p className="text-lightText mt-1">You have {appointments.length} pending appointments today.</p>
        </div>

        <div className="p-6 space-y-4">
          <h2 className="text-lg font-bold text-darkText mb-2">Today's Schedule</h2>
          
          {loading ? (
            <div className="flex justify-center p-8 text-primary">
              <Activity className="w-8 h-8 animate-spin" />
            </div>
          ) : appointments.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center text-slate-500 shadow-sm">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No appointments pending!</p>
            </div>
          ) : appointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-darkText text-lg">{apt.patient}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-lg flex items-center ${apt.status === 'IN_PROGRESS' ? 'bg-primary/20 text-primary' : 'bg-amber-100 text-amber-700'}`}>
                  <Clock className="w-3 h-3 mr-1" /> {apt.status === 'IN_PROGRESS' ? 'Ongoing' : apt.time}
                </span>
              </div>
              
              <div className="flex items-center text-lightText text-sm mb-4">
                <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                {apt.location}
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {apt.tests.map((test: string) => (
                  <span key={test} className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded-md">{test}</span>
                ))}
              </div>

              <button 
                onClick={() => { setSelectedAppointment(apt); setView('APPOINTMENT'); }}
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
            <h2 className="font-bold text-2xl text-darkText mb-1">{selectedAppointment?.patient}</h2>
            <p className="text-lightText mb-6">{selectedAppointment?.location}</p>
            
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
              
              <div className="flex space-x-3 mb-6">
                <input 
                  type="text" 
                  placeholder="OTP" 
                  value={patientOtp}
                  onChange={(e) => setPatientOtp(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary outline-none tracking-widest text-center font-bold" 
                  maxLength={4}
                />
                {selectedAppointment?.status !== 'IN_PROGRESS' && (
                  <button 
                    onClick={() => {
                      if (patientOtp.length === 4) {
                        updateStatus(selectedAppointment.id, 'IN_PROGRESS');
                        alert('Arrival Confirmed! Penalty timer stopped.');
                      } else {
                        alert('Enter 4 digit OTP');
                      }
                    }}
                    className="bg-primary hover:bg-sky-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          </div>

          <button 
            onClick={() => { 
              updateStatus(selectedAppointment.id, 'COMPLETED');
              alert('Sample collected successfully!'); 
            }}
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

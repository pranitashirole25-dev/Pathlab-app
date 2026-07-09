import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  token: string | null;
  user: any | null;
  patients: any[];
  addresses: any[];
  login: (token: string, user: any) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfiles: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  user: null,
  patients: [],
  addresses: [],
  login: async () => {},
  logout: async () => {},
  refreshProfiles: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  useEffect(() => {
    // Load token from storage on startup
    AsyncStorage.getItem('token').then((t) => {
      if (t) {
        setToken(t);
        AsyncStorage.getItem('user').then((u) => {
          if (u) {
            setUser(JSON.parse(u));
          }
        });
      }
    });
  }, []);

  useEffect(() => {
    if (user && user.id) {
      refreshProfiles();
    }
  }, [user]);

  const refreshProfiles = async () => {
    if (!user) return;
    try {
      const [patientsRes, addressesRes] = await Promise.all([
        fetch(`https://pathology-backend-ipnf.onrender.com/api/users/${user.id}/patients`),
        fetch(`https://pathology-backend-ipnf.onrender.com/api/users/${user.id}/addresses`)
      ]);
      const p = await patientsRes.json();
      const a = await addressesRes.json();
      setPatients(Array.isArray(p) ? p : []);
      setAddresses(Array.isArray(a) ? a : []);
    } catch (err) {
      console.error('Error fetching profiles:', err);
    }
  };

  const login = async (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    await AsyncStorage.setItem('token', newToken);
    await AsyncStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    setPatients([]);
    setAddresses([]);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, patients, addresses, login, logout, refreshProfiles }}>
      {children}
    </AuthContext.Provider>
  );
};

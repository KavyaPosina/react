import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext(null);
const initialDoctors = [
  { id: "d1", name: "Dr. Ananya Rao", email: "ananya@demo.com", password: "doctor123", specialization: "Cardiology", available: true, phone: "9876543210" },
  { id: "d2", name: "Dr. Rahul Kumar", email: "rahul@demo.com", password: "doctor123", specialization: "Dermatology", available: true, phone: "9876543211" },
  { id: "d3", name: "Dr. Priya Sharma", email: "priya@demo.com", password: "doctor123", specialization: "General Medicine", available: true, phone: "9876543212" }
];
const initialUsers = [
  { id: "a1", name: "Administrator", email: "admin@demo.com", password: "admin123", role: "admin" },
  ...initialDoctors.map(d => ({ ...d, role: "doctor" }))
];
const read = (key, fallback) => {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; }
  catch { return fallback; }
};

export function AppProvider({ children }) {
  const [users, setUsers] = useState(() => read("has_users", initialUsers));
  const [doctors, setDoctors] = useState(() => read("has_doctors", initialDoctors));
  const [appointments, setAppointments] = useState(() => read("has_appointments", []));
  const [currentUser, setCurrentUser] = useState(() => read("has_session", null));

  useEffect(() => localStorage.setItem("has_users", JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem("has_doctors", JSON.stringify(doctors)), [doctors]);
  useEffect(() => localStorage.setItem("has_appointments", JSON.stringify(appointments)), [appointments]);
  useEffect(() => {
    if (currentUser) localStorage.setItem("has_session", JSON.stringify(currentUser));
    else localStorage.removeItem("has_session");
  }, [currentUser]);

  const signup = ({ name, email, password }) => {
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) return { ok: false, message: "Email already registered." };
    const user = { id: crypto.randomUUID(), name, email, password, role: "patient", phone: "" };
    setUsers(prev => [...prev, user]);
    setCurrentUser(user);
    return { ok: true, user };
  };
  const login = (email, password, role) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password && u.role === role);
    if (!user) return { ok: false, message: "Invalid email, password, or role." };
    setCurrentUser(user);
    return { ok: true, user };
  };
  const logout = () => setCurrentUser(null);
  const updateUser = (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    setCurrentUser(prev => prev?.id === id ? { ...prev, ...updates } : prev);
  };
  const addDoctor = data => {
    const doctor = { ...data, id: crypto.randomUUID(), role: "doctor", available: true };
    setDoctors(prev => [...prev, doctor]);
    setUsers(prev => [...prev, doctor]);
  };
  const editDoctor = (id, updates) => {
    setDoctors(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
  };
  const deleteDoctor = id => {
    setDoctors(prev => prev.filter(d => d.id !== id));
    setUsers(prev => prev.filter(u => u.id !== id));
  };
  const addAppointment = data => setAppointments(prev => [{ ...data, id: crypto.randomUUID(), status: "Pending", createdAt: new Date().toISOString() }, ...prev]);
  const updateAppointment = (id, updates) => setAppointments(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a));
  const value = { users, doctors, appointments, currentUser, signup, login, logout, updateUser, addDoctor, editDoctor, deleteDoctor, addAppointment, updateAppointment, setDoctors };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
export const useApp = () => useContext(AppContext);
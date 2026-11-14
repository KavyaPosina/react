import React from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";

export default function Layout() {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const links = currentUser?.role === "patient"
    ? [["/patient", "Dashboard"], ["/patient/doctors", "Find Doctors"], ["/patient/appointments", "My Appointments"], ["/patient/profile", "My Profile"]]
    : currentUser?.role === "doctor"
    ? [["/doctor", "Dashboard"], ["/doctor/appointments", "Requests"], ["/doctor/availability", "Availability"], ["/doctor/profile", "My Profile"]]
    : [["/admin", "Dashboard"], ["/admin/doctors", "Manage Doctors"], ["/admin/patients", "Manage Patients"], ["/admin/appointments", "Appointments"]];
  return <div className="app-shell">
    <header className="topbar">
      <NavLink to="/" className="brand"><span className="brand-icon">✚</span> MediCare <small>Appointment Portal</small></NavLink>
      <div className="user-area"><span>{currentUser?.name} <small>({currentUser?.role})</small></span><button className="btn btn-outline btn-small" onClick={() => { logout(); navigate("/login"); }}>Logout</button></div>
    </header>
    <div className="body-layout">
      <aside className="sidebar"><p className="side-caption">MENU</p>{links.map(([to, label]) => <NavLink end={to === "/patient" || to === "/doctor" || to === "/admin"} key={to} to={to} className={({ isActive }) => isActive ? "side-link active" : "side-link"}>{label}</NavLink>)}</aside>
      <main className="main-content"><Outlet /></main>
    </div>
  </div>;
}
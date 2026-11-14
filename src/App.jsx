import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useApp } from "./context/AppContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import { Login, Signup } from "./pages/Auth";
import { PatientDashboard, FindDoctors, PatientAppointments, PatientProfile } from "./pages/Patient";
import { DoctorDashboard, DoctorAppointments, DoctorAvailability, DoctorProfile } from "./pages/Doctor";
import { AdminDashboard, ManageDoctors, ManagePatients, ManageAppointments } from "./pages/Admin";

function Private({role,children}) { return <ProtectedRoute role={role}><Layout/></ProtectedRoute>; }
export default function App() {
  const {currentUser}=useApp();
  return <Routes>
    <Route path="/" element={<Navigate to={currentUser?`/${currentUser.role}`:"/login"} replace/>}/>
    <Route path="/login" element={currentUser?<Navigate to={`/${currentUser.role}`}/>:<Login/>}/>
    <Route path="/signup" element={currentUser?<Navigate to={`/${currentUser.role}`}/>:<Signup/>}/>
    <Route path="/patient" element={<Private role="patient"/>}>
      <Route index element={<PatientDashboard/>}/><Route path="doctors" element={<FindDoctors/>}/><Route path="appointments" element={<PatientAppointments/>}/><Route path="profile" element={<PatientProfile/>}/>
    </Route>
    <Route path="/doctor" element={<Private role="doctor"/>}>
      <Route index element={<DoctorDashboard/>}/><Route path="appointments" element={<DoctorAppointments/>}/><Route path="availability" element={<DoctorAvailability/>}/><Route path="profile" element={<DoctorProfile/>}/>
    </Route>
    <Route path="/admin" element={<Private role="admin"/>}>
      <Route index element={<AdminDashboard/>}/><Route path="doctors" element={<ManageDoctors/>}/><Route path="patients" element={<ManagePatients/>}/><Route path="appointments" element={<ManageAppointments/>}/>
    </Route>
    <Route path="*" element={<Navigate to="/" replace/>}/>
  </Routes>;
}
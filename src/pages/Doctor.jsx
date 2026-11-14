import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import { PageTitle, AppointmentTable, Empty } from "./Patient";

export function DoctorDashboard() {
  const { currentUser, appointments } = useApp(), mine=appointments.filter(a=>a.doctorId===currentUser.id);
  return <><PageTitle title={`Welcome, ${currentUser.name}`} subtitle="Manage your patient appointments and availability."/><div className="stats-grid"><StatCard label="Total requests" value={mine.length} icon="▣"/><StatCard label="Pending" value={mine.filter(a=>a.status==="Pending").length} icon="◷"/><StatCard label="Completed" value={mine.filter(a=>a.status==="Completed").length} icon="✓"/></div><section className="panel"><h3>Recent appointment requests</h3><AppointmentTable rows={mine.slice(0,5)}/></section></>;
}
export function DoctorAppointments() {
  const { currentUser, appointments, updateAppointment }=useApp(), mine=appointments.filter(a=>a.doctorId===currentUser.id);
  return <><PageTitle title="Appointment requests" subtitle="Review requests and update their status."/><section className="panel">{mine.length===0?<Empty text="No appointment requests yet."/>:<div className="table-wrap"><table><thead><tr><th>Patient</th><th>Date & time</th><th>Reason</th><th>Status</th><th>Actions</th></tr></thead><tbody>{mine.map(a=><tr key={a.id}><td>{a.patientName}</td><td>{a.date}<br/><small>{a.time}</small></td><td>{a.reason}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td><td className="actions">{a.status==="Pending"&&<><button className="btn btn-primary btn-small" onClick={()=>updateAppointment(a.id,{status:"Accepted"})}>Accept</button><button className="btn btn-danger btn-small" onClick={()=>updateAppointment(a.id,{status:"Rejected"})}>Reject</button></>}{a.status==="Accepted"&&<button className="btn btn-outline btn-small" onClick={()=>updateAppointment(a.id,{status:"Completed"})}>Complete</button>}</td></tr>)}</tbody></table></div>}</section></>;
}
export function DoctorAvailability() {
  const { currentUser, setDoctors }=useApp(); const doctor=useApp().doctors.find(d=>d.id===currentUser.id);
  const [available,setAvailable]=useState(doctor?.available??true), [saved,setSaved]=useState(false);
  const save=()=>{setDoctors(prev=>prev.map(d=>d.id===currentUser.id?{...d,available}:d));setSaved(true);};
  return <><PageTitle title="Manage availability" subtitle="Choose whether patients can book appointments with you."/><section className="panel narrow"><div className="availability-row"><div><h3>Accepting appointments</h3><p className="muted">When unavailable, your profile is hidden from patient search.</p></div><label className="switch"><input type="checkbox" checked={available} onChange={e=>{setAvailable(e.target.checked);setSaved(false);}}/><span/></label></div>{saved&&<p className="success">Availability updated.</p>}<button className="btn btn-primary" onClick={save}>Save availability</button></section></>;
}
export function DoctorProfile() {
  const { currentUser, updateUser }=useApp(); const [form,setForm]=useState({name:currentUser.name,email:currentUser.email,phone:currentUser.phone||"",specialization:currentUser.specialization||""}); const [saved,setSaved]=useState(false);
  const submit=e=>{e.preventDefault();updateUser(currentUser.id,form);setSaved(true);};
  return <><PageTitle title="Doctor profile" subtitle="Maintain your professional details."/><section className="panel narrow"><form className="form" onSubmit={submit}><label>Name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label><label>Specialization<input value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})} required/></label>{saved&&<p className="success">Profile updated.</p>}<button className="btn btn-primary">Save changes</button></form></section></>;
}
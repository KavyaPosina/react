import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";
import { PageTitle, AppointmentTable, Empty, Modal } from "./Patient";

export function AdminDashboard() {
  const { users, doctors, appointments }=useApp(), patients=users.filter(u=>u.role==="patient");
  return <><PageTitle title="Admin dashboard" subtitle="Overview of the healthcare appointment system."/><div className="stats-grid"><StatCard label="Doctors" value={doctors.length} icon="⚕"/><StatCard label="Patients" value={patients.length} icon="♙"/><StatCard label="Appointments" value={appointments.length} icon="▣"/><StatCard label="Pending" value={appointments.filter(a=>a.status==="Pending").length} icon="◷"/></div><section className="panel"><h3>All appointments</h3><AppointmentTable rows={appointments.slice(0,8)}/></section></>;
}
export function ManageDoctors() {
  const { doctors, addDoctor, editDoctor, deleteDoctor }=useApp();
  const empty={name:"",email:"",password:"doctor123",specialization:"General Medicine",phone:""};
  const [form,setForm]=useState(empty),[editing,setEditing]=useState(null),[show,setShow]=useState(false),[error,setError]=useState("");
  const openAdd=()=>{setForm(empty);setEditing(null);setError("");setShow(true);};
  const openEdit=d=>{setForm({...d});setEditing(d.id);setError("");setShow(true);};
  const submit=e=>{e.preventDefault();if(doctors.some(d=>d.email.toLowerCase()===form.email.toLowerCase()&&d.id!==editing)){setError("Email already exists.");return;}if(editing)editDoctor(editing,form);else addDoctor(form);setShow(false);};
  return <><PageTitle title="Manage doctors" subtitle="Add, edit, and remove doctor accounts."/><div className="toolbar"><span>{doctors.length} doctors registered</span><button className="btn btn-primary" onClick={openAdd}>+ Add doctor</button></div><section className="panel"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Specialization</th><th>Availability</th><th>Actions</th></tr></thead><tbody>{doctors.map(d=><tr key={d.id}><td>{d.name}</td><td>{d.email}</td><td>{d.specialization}</td><td>{d.available?"Available":"Unavailable"}</td><td className="actions"><button className="btn btn-outline btn-small" onClick={()=>openEdit(d)}>Edit</button><button className="btn btn-danger btn-small" onClick={()=>{if(confirm("Delete this doctor?"))deleteDoctor(d.id);}}>Delete</button></td></tr>)}</tbody></table></div></section>
    {show&&<Modal title={editing?"Edit doctor":"Add doctor"} close={()=>setShow(false)}><form className="form" onSubmit={submit}><label>Doctor name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label>Password<input type="text" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required/></label><label>Specialization<select value={form.specialization} onChange={e=>setForm({...form,specialization:e.target.value})}>{["General Medicine","Cardiology","Dermatology","Neurology","Pediatrics","Orthopedics","ENT","Ophthalmology"].map(s=><option key={s}>{s}</option>)}</select></label><label>Phone<input value={form.phone||""} onChange={e=>setForm({...form,phone:e.target.value})}/></label>{error&&<p className="error">{error}</p>}<button className="btn btn-primary full">{editing?"Save changes":"Add doctor"}</button></form></Modal>}
  </>;
}
export function ManagePatients() {
  const { users }=useApp(), patients=users.filter(u=>u.role==="patient");
  return <><PageTitle title="Manage patients" subtitle="View registered patient accounts."/><section className="panel">{patients.length===0?<Empty text="No patients registered yet."/>:<div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Account</th></tr></thead><tbody>{patients.map(p=><tr key={p.id}><td>{p.name}</td><td>{p.email}</td><td>{p.phone||"Not provided"}</td><td><span className="status available">Active</span></td></tr>)}</tbody></table></div>}</section></>;
}
export function ManageAppointments() {
  const { appointments, updateAppointment }=useApp();
  return <><PageTitle title="All appointments" subtitle="Monitor and update appointment statuses."/><section className="panel">{appointments.length===0?<Empty text="No appointments available."/>:<><AppointmentTable rows={appointments}/><div className="admin-status-list"><h3>Update appointment status</h3>{appointments.map(a=><div className="status-edit" key={a.id}><span>{a.patientName} with {a.doctorName} ({a.date})</span><select value={a.status} onChange={e=>updateAppointment(a.id,{status:e.target.value})}><option>Pending</option><option>Accepted</option><option>Rejected</option><option>Completed</option><option>Cancelled</option></select></div>)}</div></>}</section></>;
}
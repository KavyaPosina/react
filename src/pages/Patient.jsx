import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import StatCard from "../components/StatCard";

export function PatientDashboard() {
  const { currentUser, appointments, doctors } = useApp();
  const mine = appointments.filter(a => a.patientId === currentUser.id);
  return <><PageTitle title={`Hello, ${currentUser.name}`} subtitle="Here is an overview of your healthcare activity."/><div className="stats-grid"><StatCard label="Total appointments" value={mine.length} icon="▣"/><StatCard label="Pending requests" value={mine.filter(a=>a.status==="Pending").length} icon="◷"/><StatCard label="Available doctors" value={doctors.filter(d=>d.available).length} icon="⚕"/></div><section className="panel"><div className="panel-head"><h3>Recent appointments</h3><Link to="/patient/appointments">View all</Link></div><AppointmentTable rows={mine.slice(0,5)} /></section><Link className="btn btn-primary" to="/patient/doctors">+ Book an appointment</Link></>;
}
export function FindDoctors() {
  const { doctors, currentUser, addAppointment } = useApp();
  const [search, setSearch] = useState(""), [selected, setSelected] = useState(null), [form, setForm] = useState({ date: "", time: "", reason: "" }), [message, setMessage] = useState("");
  const filtered = useMemo(() => doctors.filter(d => d.available && (`${d.name} ${d.specialization}`).toLowerCase().includes(search.toLowerCase())), [doctors, search]);
  const book = e => { e.preventDefault(); addAppointment({ patientId: currentUser.id, patientName: currentUser.name, doctorId: selected.id, doctorName: selected.name, specialization: selected.specialization, ...form }); setSelected(null); setForm({date:"",time:"",reason:""}); setMessage("Appointment request submitted successfully."); };
  return <><PageTitle title="Find a doctor" subtitle="Search by doctor name or medical specialization."/><input className="search-input" placeholder="Search doctors or specialization..." value={search} onChange={e=>setSearch(e.target.value)}/>{message && <p className="success">{message}</p>}<div className="doctor-grid">{filtered.map(d=><div className="doctor-card" key={d.id}><div className="doctor-avatar">⚕</div><h3>{d.name}</h3><p className="specialty">{d.specialization}</p><span className="status available">Available</span><button className="btn btn-primary full" onClick={()=>setSelected(d)}>Book appointment</button></div>)}</div>{filtered.length===0 && <Empty text="No available doctors found."/>}
    {selected && <Modal title={`Book with ${selected.name}`} close={()=>setSelected(null)}><form className="form" onSubmit={book}><label>Date<input type="date" min={new Date().toISOString().slice(0,10)} value={form.date} onChange={e=>setForm({...form,date:e.target.value})} required/></label><label>Time<input type="time" value={form.time} onChange={e=>setForm({...form,time:e.target.value})} required/></label><label>Reason for visit<textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} required rows="3"/></label><button className="btn btn-primary full">Submit request</button></form></Modal>}
  </>;
}
export function PatientAppointments() {
  const { currentUser, appointments, updateAppointment } = useApp();
  const rows = appointments.filter(a=>a.patientId===currentUser.id);
  return <><PageTitle title="My appointments" subtitle="Track your appointment requests and history."/><section className="panel"><AppointmentTable rows={rows} actions={a=>a.status==="Pending" && <button className="btn btn-danger btn-small" onClick={()=>updateAppointment(a.id,{status:"Cancelled"})}>Cancel</button>}/></section></>;
}
export function PatientProfile() {
  const { currentUser, updateUser } = useApp(); const [form,setForm]=useState({name:currentUser.name,email:currentUser.email,phone:currentUser.phone||""}); const [saved,setSaved]=useState(false);
  const submit=e=>{e.preventDefault();updateUser(currentUser.id,form);setSaved(true);};
  return <><PageTitle title="My profile" subtitle="Update your personal information."/><section className="panel narrow"><form className="form" onSubmit={submit}><label>Full name<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/></label><label>Email<input type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/></label><label>Phone<input value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/></label>{saved&&<p className="success">Profile updated.</p>}<button className="btn btn-primary">Save changes</button></form></section></>;
}
export function AppointmentTable({ rows, actions }) {
  if (!rows.length) return <Empty text="No appointments found." />;
  return <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Doctor</th><th>Date & time</th><th>Reason</th><th>Status</th>{actions&&<th>Action</th>}</tr></thead><tbody>{rows.map(a=><tr key={a.id}><td>{a.patientName}</td><td>{a.doctorName}</td><td>{a.date}<br/><small>{a.time}</small></td><td>{a.reason}</td><td><span className={`status ${a.status.toLowerCase()}`}>{a.status}</span></td>{actions&&<td>{actions(a)}</td>}</tr>)}</tbody></table></div>;
}
export function PageTitle({title,subtitle}) { return <div className="page-title"><h1>{title}</h1><p>{subtitle}</p></div>; }
export function Empty({text}) { return <div className="empty">{text}</div>; }
export function Modal({title,close,children}) { return <div className="modal-backdrop" onMouseDown={e=>e.target===e.currentTarget&&close()}><div className="modal"><div className="panel-head"><h3>{title}</h3><button className="close" onClick={close}>×</button></div>{children}</div></div>; }
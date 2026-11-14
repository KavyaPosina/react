import React from "react";
export default function StatCard({ label, value, icon }) {
  return <div className="stat-card"><div><p>{label}</p><h2>{value}</h2></div><span className="stat-icon">{icon}</span></div>;
}
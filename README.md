# Healthcare Appointment Management System

React + Vite academic demo with Patient, Doctor, and Admin modules.

## Setup
1. Install Node.js.
2. Open this folder in VS Code.
3. Run `npm install`.
4. Run `npm run dev`.
5. Open the localhost URL shown by Vite (usually http://localhost:5173).

## Demo login
- Admin: `admin@demo.com` / `admin123`
- Doctor: `ananya@demo.com` / `doctor123`
- Patient: register a new account using Sign Up.

## Modules
### Patient
Register/login, search available doctors, book appointments, view status/history, cancel pending appointments, edit profile.

### Doctor
Login, view requests, accept/reject requests, mark accepted appointments completed, manage availability, edit profile.

### Admin
Login, dashboard, add/edit/delete doctors, view patient accounts, view all appointments and update appointment status.

## Important demonstration note
This project stores demo accounts and appointment data in browser Local Storage. It is for academic demonstration only. It is not secure authentication and must not be used with real patient data. A production system requires a secure backend, database, access controls, and appropriate privacy/security safeguards.

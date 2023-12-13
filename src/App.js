import React from "react";
import './assets/react.css';
import './assets/responsive.css';
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./containers/login";
import Dashboard from "./pages/admin/dashboard";
import ForgetPsw from "./pages/forget_Psw";
import Attendance from "./pages/admin/attendance";
import Info from "./pages/admin/info";
import ChangePsw from "./pages/change_Psw";
import ShowAttendance from "./pages/admin/showAttendance";
import RemoveEmployee from "./pages/admin/removeEmployee";
import AddShowEmployee from "./pages/employee/edit_show_emp";
import Otp_Generate from "./pages/otp_generate";
import Attendance_Emp from "./pages/employee/attendance_emp";
import AddShow from "./pages/admin/add&show";
import ShowAttendance_emp from "./pages/employee/showAttendance_emp";
import Employee_Dashboard from "./pages/employee/EmployeeDashboard";
import Info_Emp from "./pages/employee/info_emp";
import Attendance_status from "./pages/admin/attendance_status";
import NewPassword from "./pages/admin/new_password";
import NewPasswordEmp from "./pages/employee/new_password_emp";
import Header from "./components/Admin/Header";
import useToken from "./containers/token";
import Footer from "./components/Admin/Footer";
import HeaderUser from "./components/User/Header";
import FooterUser from "./components/User/Footer";
import Report from "./pages/admin/report";

function App() {
    const { token, setToken, secretID, setSecretID, otpToken, setOtpToken, otpExpirationTime, setOtpExpirationTime } = useToken("");

    return (
        <>
            <div>
                <Routes>
                    <Route exact path="/" element={< Navigate to="/login" />} />
                    <Route exact path="/login" element={<LoginPage setToken={setToken} setSecretID={setSecretID} />} />
                    <Route exact path="/forget_psw" element={<ForgetPsw setOtpToken={setOtpToken} setOtpExpirationTime={setOtpExpirationTime} />} />
                    <Route element={<Header />} />
                    <Route element={<Footer />} />
                    <Route element={<HeaderUser />} />
                    <Route element={<FooterUser />} />
                    <Route exact path="/new_password" element={<NewPassword />} />
                    <Route exact path="/new_password_emp" element={<NewPasswordEmp />} />
                    <Route exact path="/dashboard" element={<Dashboard />} />
                    <Route exact path="/attendance" element={<Attendance />} />
                    <Route exact path="/attendance_status" element={<Attendance_status />} />
                    <Route exact path="/my_info" element={<Info />} />
                    <Route exact path="/report" element={<Report />} />
                    <Route exact path="/forget_psw/change_psw" element={<ChangePsw />} />
                    <Route exact path="/show_attendance" element={<ShowAttendance />} />
                    <Route exact path="/remove_employee" element={<RemoveEmployee />} />
                    <Route exact path="/add&show_employee" element={<AddShowEmployee />} />
                    <Route exact path="/forget_psw/otp_generate" element={<Otp_Generate />} />
                    <Route exact path="/attendance_emp" element={<Attendance_Emp />} />
                    <Route exact path="/add&show" element={<AddShow />} />
                    <Route exact path="/show_attendance_emp" element={<ShowAttendance_emp />} />
                    <Route exact path="/dashboard_emp" element={<Employee_Dashboard />} />
                    <Route exact path="/my_info_emp" element={<Info_Emp />} />
                </Routes>
            </div>
        </>
    );
}

export default App;
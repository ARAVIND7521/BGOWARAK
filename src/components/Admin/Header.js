import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from "react-router-dom";
import Cookies from 'js-cookie';
// import Axios from 'axios';
import useToken from '../../containers/token';
import { Modal, Button } from 'react-bootstrap';
import { useDispatch, useSelector } from "react-redux";
import { logout } from '../../action/action';

const Header = React.memo(() => {
    const dispatch = useDispatch();
    const { token } = useToken();
    const navigate = useNavigate();
    const location = useLocation();
    const lists = useRef(null);
    const ref_pass_display = useRef(null);
    const ref_logout_display = useRef(null);
    const [empname, SetEmpName] = useState("");
    const [sessionExpired, setSessionExpired] = useState(false);
    const [sessionTimeout, setSessionTimeout] = useState(false);
    const [show, setShow] = useState(false);
    const user = useSelector((state) => state.searchData);

    useEffect(() => {
        if(user.result === undefined) {
            SetEmpName(user[0].First_Name + " " + user[0].Last_Name);
        } else {
            SetEmpName(user.result[0].First_Name + " " + user.result[0].Last_Name);
        }
        // Axios.post(process.env.REACT_APP_MY_INFO, {
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // }).then((response => {
        //     SetEmpName(response.data[0].First_Name + " " + response.data[0].Last_Name);
        // })).catch(function (error) {
        //     if (error) {
        //         console.log(error);
        //     }
        // });
    }, [user]);
    
    useEffect(() => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        if (userToken && userToken.expiresAt <= Date.now()) {
            setSessionExpired(true);
        }
        setSessionTimeout(sessionExpired);
    }, [sessionExpired]);

    const handleContinue = () => {
        const tokenString = localStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        const newExpirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes in milliseconds
        userToken.expiresAt = newExpirationTime;
        localStorage.setItem('token', JSON.stringify(userToken));
        setSessionExpired(false);
    };

    const handleLogout = () => {
        dispatch(logout());
        setSessionExpired(false);
        localStorage.clear();
        navigate('/login');
    };

    const ChangePassword = () => {
        navigate("/new_password");
    }

    function Click_to_show() {
        let btn = ref_logout_display.current;
        let btn1 = ref_pass_display.current
        if (btn.style.display === "block" && btn1.style.display === "block") {
            btn.style.display = "none";
            btn1.style.display = "none";
        } else {
            btn.style.display = "block";
            btn1.style.display = "block";
        }
    }

    const Logout = () => {
        setShow(true);
    }

    const handle_Logout = () => {
        dispatch(logout());
        localStorage.clear();
        Cookies.remove('token');
        navigate("/login");
    };

    const closeModal = () => {
        setShow(false);
    }

    function MyBTN() {
        const list = lists.current;
        if (list.style.display === "block") {
            list.style.display = "none";
        } else {
            list.style.display = "block";
        }
    }

    return (
        <header>
            <div id="heading" className="header">
                <div className="logo-holder-log logo-log">
                    <h3 id="company_name">BGOWARAK</h3>
                    <p id="company_name_slogan">POWER OF TECHNOLOGIES</p>
                </div>
                <div className="user-menu">
                    <button className="logout_show" onClick={Click_to_show}><b>Welcome </b>{empname}<i className="fa fa-caret-down"></i></button>
                    <nav>
                        <li className="submenu">
                            <button ref={ref_pass_display} className="logout_show btn1 fa fa-user" id="display1" onClick={ChangePassword}> Change Password</button>
                        </li>
                        <li className="submenu">
                            <button ref={ref_logout_display} className="logout_show btn1 fa fa-sign-out" id="display" onClick={(Logout)}>logout</button>
                        </li>
                    </nav>
                </div>

                <Modal show={show} className="fadeout">
                    <Modal.Header closeButton>
                        <Modal.Title>Logout Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Are you sure you want to logout?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" onClick={handle_Logout}>
                            YES
                        </Button>
                        <Button variant="secondary" onClick={closeModal}>
                            NO
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            <button onClick={MyBTN} id="btn_items">
                <div id="line"></div>
                <div id="line"></div>
                <div id="line"></div>
            </button>
            <div ref={lists} id="items">
                <nav id="list">
                    <ul>
                        <li className={`menu ${location.pathname === '/dashboard' ? 'active' : ''}`}>
                            <Link to="/dashboard" className="menu_bar">Dashboard</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/attendance' ? 'active' : ''}`}>
                            <Link to="/attendance" className="menu_bar">Attendance</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/show_attendance' ? 'active' : ''}`}>
                            <Link to="/show_attendance" className="menu_bar">Show Attendance</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/add&show' ? 'active' : ''}`}>
                            <Link to="/add&show" className="menu_bar_extra">Add/Show Employee</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/attendance_status' ? 'active' : ''}`}>
                            <Link to="/attendance_status" className="menu_bar">Attendance Status</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/remove_employee' ? 'active' : ''}`}>
                            <Link to="/remove_employee" className="menu_bar_extra">Remove Employee</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/report' ? 'active' : ''}`}>
                            <Link to="/report" className="menu_bar">Report</Link>
                        </li>
                        <li className={`menu ${location.pathname === '/my_info' ? 'active' : ''}`}>
                            <Link to="/my_info" className="menu_bar">My info</Link>
                        </li>
                    </ul>
                </nav>
            </div>
            {token && sessionExpired && (
                <Modal show={true}>
                    <Modal.Header closeButton>
                        <Modal.Title>Your session has expired</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>If you want to continue the session, click "Continue". Otherwise, click "Logout" to log out.</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" className="button_primary" onClick={handleContinue}>Continue</Button>
                        <Button variant="secondary" className="button_secondary" onClick={handleLogout}>Logout</Button>
                    </Modal.Footer>
                </Modal>
            )}
        </header>
    );
})

export default Header;

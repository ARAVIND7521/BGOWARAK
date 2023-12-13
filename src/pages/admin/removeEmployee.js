import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from 'axios';
import moment from 'moment';
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";

function RemoveEmployee() {
    const navigate = useNavigate();
    const ref_check = useRef(null);
    const ref_check_close3 = useRef(null);
    const ref_check_ok = useRef(null);
    const ref_delete = useRef(null);
    const ref_delete_close2 = useRef(null);
    const ref_delete_ok = useRef(null);
    const ref_empid = useRef(null);
    const ref_secretid = useRef(null);
    const ref_adminpass = useRef(null);
    const ref_reason = useRef(null);
    const [empid, setEmpid] = useState("");
    const [reason, setReason] = useState("");
    const [secretcode, setSecretCode] = useState("");
    const [adminpass, setAdminpass] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const date = moment(new Date()).format('YYYY-MM-DD');
    const ref_dashboard = useRef(null);
    const [EmployeeName, setEmployeeName] = useState("");
    const [Designation, setDesignation] = useState("");
    const [information, setInformation] = useState("");
    const characterCount = reason.length;
    const remainingCharacters = 250;
    const errors = {
        empid: "INVALID EMPLOYEE ID!",
        secretCode: "INVALID SECRET ID!",
        adminPass: "INVALID ADMIN PASS!",
        DATA: "Employee ID required!",
        DATA1: "Enter the password!",
        DATA3: "Enter the secret code!",
        DATA2: "Mention the specify reason!",
        NULL: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error1">{errorMessages.message}</div>
        );

    const handleReasonChange = (e) => {
        const newValue = e.target.value;
        if (newValue.length <= 250) {
            setReason(newValue);
        }
    };

    useEffect(() => {
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    function Clear() {
        setEmpid("");
        setAdminpass("");
        setSecretCode("");
        setReason("");
        setEmployeeName("");
        setDesignation("");
    }

    function Delete() {
        if (empid === "") {
            const EmployeeID = ref_empid.current.focus();
            setErrorMessages({ name: "DATA", message: errors.DATA });
        } else if (EmployeeName === "" || Designation === "") {
            const EmployeeID = ref_empid.current.focus();
            setErrorMessages({ name: "DATA", message: errors.empid });
        } else if (secretcode === "") {
            const SecretID = ref_secretid.current.focus();
            setErrorMessages({ name: "DATA3", message: errors.DATA3 });
        } else if (adminpass === "") {
            const AdminPass = ref_adminpass.current.focus();
            setErrorMessages({ name: "DATA1", message: errors.DATA1 });
        } else if (reason === "") {
            const Reason = ref_reason.current.focus();
            setErrorMessages({ name: "DATA2", message: errors.DATA2 });
        } else if (information.SecretID !== secretcode) {
            const SecretID = ref_secretid.current.focus();
            setErrorMessages({ name: "DATA3", message: errors.secretCode });
        } else if (information.Password !== adminpass) {
            const AdminPass = ref_adminpass.current.focus();
            setErrorMessages({ name: "DATA1", message: errors.adminPass });
        } else {
            axios.post(process.env.REACT_APP_REMOVE_EMPLOYEE, {
                removeid: empid,
                date: date,
                secretcode: secretcode,
                adminpass: adminpass,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                if (response.data.changedRows === 0 || response.data.length === 0) {
                    if (information.SecretID !== secretcode) {
                        setErrorMessages({ name: "DATA3", message: errors.secretCode });
                    } else if (information.Passwod !== adminpass) {
                        setErrorMessages({ name: "DATA1", message: errors.adminPass });
                    } else {
                        setErrorMessages({ name: "DATA", message: errors.empid });
                    }
                } else {
                    setErrorMessages({ name: "DATA1", message: errors.NULL });
                    const btn1 = ref_delete_ok.current;
                    const modal_delete = ref_delete.current;
                    const span = ref_delete_close2.current;
                    modal_delete.style.display = "block";
                    span.onclick = function () {
                        modal_delete.style.display = "none";
                        Clear();
                    }

                    btn1.onclick = function () {
                        modal_delete.style.display = "none";
                        Clear();
                    }
                    setErrorMessages({ name: "DATA3", message: errors.NULL });
                }
            }).catch(handleAxiosError);
        }
    };

    function handleAxiosError(error) {
        if (error.response) {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        } else if (error.request) {
            console.log(error.request);
        } else {
            console.log('Error', error.message);
        }
        console.log(error.config);
    }

    function handleCheck(empid) {
        setEmpid(empid);
        check(empid)
    }

    function check(empid) {
        axios.post(process.env.REACT_APP_DASHBOARD, {
            empid: empid,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            filter(response.data, empid);
        })).catch(handleAxiosError);
    };

    function filter(info, empid) {
        for (let data in info) {
            if (empid == info[data].EmpID) {
                setErrorMessages({ name: "DATA", message: errors.NULL });
                setEmployeeName(info[data].First_Name + " " + info[data].Last_Name);
                setDesignation(info[data].Designation);
            }
            else if (empid >= info[data].EmpID) {
                setErrorMessages({ name: "DATA", message: errors.empid });
                setEmployeeName("");
                setDesignation("");
            } else if (empid == "" || empid <= 0) {
                setErrorMessages({ name: "DATA", message: errors.DATA });
                setEmployeeName("");
                setDesignation("");
            }
        }
    }

    useEffect(() => {
        axios.post(process.env.REACT_APP_MY_INFO, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            setInformation(response.data[0]);
        })).catch(handleAxiosError);
    }, []);


    return (
        <>
            <div id="full_frame">
                <Header />
                <div ref={ref_delete} className="modal">
                    <div className="modal-content">
                        <span ref={ref_delete_close2} className="close">&times;</span>
                        <p>Deleted Successfully!!!</p>
                        <button ref={ref_delete_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_check} className="modal">
                    <div className="modal-content">
                        <span ref={ref_check_close3} className="close">&times;</span>
                        <p>
                            NO CHANGES, INVALID DATA!!!
                            CHECK YOUR EMPLOYEE ID AND PASSWORD
                        </p>
                        <button ref={ref_check_ok} id="okay" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body">
                    <h1>Remove Employee</h1>
                    <form name="myForm" >
                        <div id='name'>
                            <label htmlFor="EmpID">Employee ID</label>
                            <input ref={ref_empid} className="form Employee_ID" type="number" autoComplete="empid" onWheel={e => { e.target.blur() }} onChange={(e) => handleCheck(e.target.value)} value={empid} name="EmpID" placeholder="Employee ID"></input>
                            {renderErrorMessage("DATA")}
                        </div>
                        <div id='name'>
                            <label htmlFor="empid">Employee name</label>
                            <input disabled id="employeeName" className="form" type="text" onChange={(e) => setEmployeeName(e.target.value)} value={EmployeeName} name="ID" placeholder="Employee name"></input>
                        </div>
                        <div id='name'>
                            <label htmlFor="designation">Designation</label>
                            <input disabled className="form Employee_ID" type="text" autoComplete="designation" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                        </div>
                        <div id='name'>
                            <label htmlFor="SecretID">Secret ID</label>
                            <input ref={ref_secretid} id="Secret_code" className="form" type="password" autoComplete="new-password" onChange={(e) => setSecretCode(e.target.value)} value={secretcode} name="secretcode" placeholder="Secret ID"></input>
                            {renderErrorMessage("DATA3")}
                        </div>
                        <div id='name'>
                            <label htmlFor="Passowrd">Password</label>
                            <input ref={ref_adminpass} id="Admin_pass" className="form" type="password" autoComplete="new-password" onChange={(e) => setAdminpass(e.target.value)} value={adminpass} name="pass" placeholder="Password"></input>
                            {renderErrorMessage("DATA1")}
                        </div>
                        <div id='name'>
                            <label htmlFor="reason">Specify reason</label>
                            <textarea ref={ref_reason} id="reason" className="form" type="text" rows="4" cols="50" onChange={handleReasonChange} value={reason} name="reason" placeholder="Reason"></textarea>
                            <div className="character-count-removepage">
                                {characterCount}/{remainingCharacters}
                            </div>
                            {renderErrorMessage("DATA2")}
                        </div>
                        <div id="buttons1">
                            <button id="update" className="button_hide" type="button" onClick={Delete}>DELETE</button>
                            <button id="reset" className="button_next" type="reset" onClick={Clear}>RESET</button>
                        </div>
                    </form>
                </div>
                <Footer />
            </div >
        </>
    )
};

export default RemoveEmployee

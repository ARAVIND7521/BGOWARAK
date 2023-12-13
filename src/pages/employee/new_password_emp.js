import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";

function NewPasswordEmp() {
    const navigate = useNavigate();
    const ref_success_ok = useRef(null);
    const ref_updated = useRef(null);
    const ref_logout_close3 = useRef(null);
    const ref_changePass = useRef(null);
    const ref_pass_save = useRef(null);
    const ref_pass_cancel = useRef(null);
    const [empname, SetEmpName] = useState("");
    const [info, setInfo] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [currentPass, SetCurrentpass] = useState("");
    const [newPass, SetNewpass] = useState("");
    const [confirmingPass, SetConfirmingpass] = useState("");
    // my1stcompany2001@gmail.com
    const errors = {
        CONFIRMED_PASSWORD: "ENTER THE CONFIRM PASSWORD!",
        CONFIRMED_PASSWORD_INVALID: "MISMATCHING CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER THE NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER THE CURRENT PASSWORD!",
        PASSWORD_INVALID: "INVALID PASSWORD!",
        NEW_PASSWORD_ALREADY: "THIS PASSWORD IS ALREADY EXISTS!",
        NEW_PASSWORD_LENGTH: "MINIMUM 8 CHARACTER INCLUDE UPPERCASE LETTER, NUMBER AND SPECIAL CHAR(*,&,...)",
        NULL: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error1">{errorMessages.message}</div>
        );

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        axios.post(process.env.REACT_APP_MY_INFO, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            setInfo(response.data[0]);
            SetEmpName(response.data[0].First_Name + " " + response.data[0].Last_Name)
        })).catch(function (error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                console.log(error.request);
            } else {
                console.log('Error', error.message);
                alert("Authentication error, server is missing!");
            }
            console.log(error.config);
        });
    }, []);

    function Update_newpassword() {
        if (currentPass == "") {
            setErrorMessages({ name: "current_password", message: errors.CURRENT_PASSWORD });
        } else if (newPass == "") {
            setErrorMessages({ name: "new_password", message: errors.NEW_PASSWORD });
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(newPass)) {
            setErrorMessages({ name: "new_password", message: errors.NEW_PASSWORD_LENGTH });
        } else if (confirmingPass == "") {
            setErrorMessages({ name: "confirm_password", message: errors.CONFIRMED_PASSWORD });
        } else if (newPass == confirmingPass) {
            axios.post(process.env.REACT_APP_CHANGE_NEW_PASSWORD, {
                newpassword: newPass,
                currentpassword: currentPass,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response => {
                if (response.data.changedRows === 0 || response.data.length === 0) {
                    if (newPass == info.Password) {
                        setErrorMessages({ name: "new_password", message: errors.NEW_PASSWORD_ALREADY });
                    } else {
                        setErrorMessages({ name: "current_password", message: errors.PASSWORD_INVALID });
                    }
                } else {
                    setErrorMessages({ name: "confirm_password", message: errors.NULL });
                    const modal = ref_updated.current;
                    const btn = ref_success_ok.current
                    const span = ref_logout_close3.current;
                    modal.style.display = "block";
                    span.onclick = function () {
                        localStorage.clear();
                        navigate("/login");
                    }

                    btn.onclick = function () {
                        localStorage.clear();
                        navigate("/login");
                    }
                }
            })).catch(function (error) {
                if (error) {
                    console.log(error);
                }
            });
        } else {
            setErrorMessages({ name: "confirm_password", message: errors.CONFIRMED_PASSWORD_INVALID });
        }
    }

    function Cancel_password() {
        SetCurrentpass("");
        SetNewpass("");
        SetConfirmingpass("");
    }

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_updated} className="modal">
                    <div className="modal-content">
                        <span ref={ref_logout_close3} className="close">&times;</span>
                        <p>Updated Successfully and relogin!</p>
                        <button ref={ref_success_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_changePass} id="body">
                    <center>CHANGE PASSWORD</center>
                    <div id='name' className="mb-3">
                        <label htmlFor="name" className="form-label">Employee name</label>
                        <input id="fullName" className="form-control empName" type="text" disabled placeholder="Name" name="name" value={(empname)}></input>
                    </div>
                    <div id='name' className="mb-3">
                        <label htmlFor="name" className="form-label">Current password</label>
                        <input id="currentPass" className="form-control empName" type="password" placeholder="Current Password" name="name" onChange={(e) => SetCurrentpass(e.target.value)} value={(currentPass)}></input>
                        {renderErrorMessage("current_password")}
                    </div>
                    <div id='name' className="mb-3">
                        <label htmlFor="newPass" className="form-label">New password</label>
                        <input id="newPass" className="form-control empName" type="password" placeholder="New Password" onChange={(e) => SetNewpass(e.target.value)} name="name" value={(newPass)}></input>
                        {renderErrorMessage("new_password")}
                    </div>
                    <div id='name' className="mb-3">
                        <label htmlFor="confirmPass" className="form-label">confirm password</label>
                        <input id="confirmPass" className="form-control empName" type="password" placeholder="Confirm Password" name="name" onChange={(e) => SetConfirmingpass(e.target.value)} value={(confirmingPass)}></input>
                        {renderErrorMessage("confirm_password")}
                    </div>
                    <button ref={ref_pass_save} id="saveButton" onClick={Update_newpassword}>SAVE</button>
                    <button ref={ref_pass_cancel} id="resetButton" onClick={Cancel_password}>RESET</button>
                </div>
                <FooterUser />
            </div>
        </>
    )
};

export default NewPasswordEmp
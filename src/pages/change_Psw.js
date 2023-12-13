import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Axios from 'axios';

function Change_Psw() {
    const navigate = useNavigate();
    const ref_newP = useRef(null);
    const ref_confirmP = useRef(null);
    const [newP, setnewP] = useState("");
    const [confirmP, setconfirmP] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        NEW_PASSWORD: "ENTER THE PASSWORD! AND MINIMUM 8 CHARACTER INCLUDE LOWERCASE, UPPERCASE LETTER, NUMBER AND SPECIAL CHAR(*,&,...)",
        CONFIRM_PASSWORD: "ENTER THE CONFIRM PASSWORD!",
        CONFIRMED_PASSWORD_INVALID: "MISMATCHING CONFIRM PASSWORD!",
        null: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    useEffect(() => {
        if (!localStorage.getItem("OtpToken")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    const Update = (e) => {
        if (newP == "" || !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(newP)) {
            const element = ref_newP.current.focus();
            setErrorMessages({ name: "new_password", message: errors.NEW_PASSWORD });
        } else if (confirmP == "") {
            const element = ref_confirmP.current.focus();
            setErrorMessages({ name: "confirm_password", message: errors.CONFIRM_PASSWORD });
        } else if (newP != confirmP) {
            const element = ref_confirmP.current.focus();
            setErrorMessages({ name: "confirm_password", message: errors.CONFIRMED_PASSWORD_INVALID });
        } else {
            setErrorMessages({ name: "null", message: errors.null });
            Axios.post(process.env.REACT_APP_CHANGE_PASSWORD, {
                newpassword: newP,
            }).then((response) => {
                localStorage.clear();
                navigate("/login");
            }).catch(function (error) {
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
            });
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    function Reset() {
        setnewP("");
        setconfirmP("");
    }

    return (
        <>
            <div id='userCheck'>
                <div id='header_psw'>
                    <div className="logo-holder logo">
                        <h3>BGOWARAK</h3>
                        <p>POWER OF TECHNOLOGIES</p>
                    </div>
                    <h1 id='tag'>CHANGE <span style={{ color: "#45c761" }}>PASSWORD</span></h1>
                    <form name='myform' onSubmit={handleSubmit}>
                        <div id='new_Psw'>
                            <label htmlFor='newP'>New password</label><br />
                            <input ref={ref_newP} id="newP" className='form_psw' type="password" name='nweP' onChange={(e) => setnewP(e.target.value)} value={newP}></input>
                            {renderErrorMessage("null")}
                            {renderErrorMessage("new_password")}
                        </div>
                        <div id='new_Psw'>
                            <label htmlFor='confirmP'>Confirm password</label><br />
                            <input ref={ref_confirmP} id="confirm" className='form_psw' type="password" name='confirmP' onChange={(e) => setconfirmP(e.target.value)} value={confirmP}></input>
                            {renderErrorMessage("null")}
                            {renderErrorMessage("confirm_password")}
                        </div>
                        <center>
                            <button id="idButton" type="submit" onClick={Update}>SUBMIT</button>
                            <button id="idButton_no" type="reset" onClick={Reset}>RESET</button>
                        </center>
                    </form>
                </div>
                <div id="foot_psw">
                    <footer>Copyright@ 2023</footer>
                </div>
            </div>
        </>
    )
}

export default Change_Psw
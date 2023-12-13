import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"
import Axios from 'axios';

function Forget_Psw({ setOtpToken, setOtpExpirationTime }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        input: "Username or email required ro invalid data!",
        null: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );
    function handleSubmit(event) {
        event.preventDefault();
    }

    function Reset() {
        setEmail("");
    }

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

    function Validatepsw() {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) && email !== "") {
            Axios.post(process.env.REACT_APP_SEARCH_USERNAME, {
                username: email
            }).then((response) => {
                if (response.data.length == 0) {
                    setErrorMessages({ name: "name", message: errors.input });
                } else {
                    Axios.post(process.env.REACT_APP_FORGET_PASSWORD, {
                        username: email,
                    }).then((response) => {
                        if (response.data.length == 0) {
                            setErrorMessages({ name: "name", message: errors.input });
                        } else {
                            setOtpToken(response.data.OtpToken);
                            setOtpExpirationTime(response.data.otpExpirationTime);
                            navigate("/forget_psw/otp_generate");
                        }
                    }).catch(handleAxiosError);
                }
            }).catch(handleAxiosError);
        } else if (email !== "") {
            setErrorMessages({ name: "name", message: errors.null });
            Axios.post(process.env.REACT_APP_SEARCH_USERNAME, {
                username: email
            }).then((response) => {
                if (response.data.length == 0) {
                    setErrorMessages({ name: "name", message: errors.input });
                } else {
                    Axios.post(process.env.REACT_APP_FORGET_PASSWORD, {
                        email: email,
                    }).then((response) => {
                        if (response.data.length == 0) {
                            setErrorMessages({ name: "name", message: errors.input });
                        } else {
                            setOtpToken(response.data.OtpToken);
                            setOtpExpirationTime(response.data.otpExpirationTime);
                            navigate("/forget_psw/otp_generate");
                        }
                    }).catch(handleAxiosError);
                }
            }).catch(handleAxiosError);
        } else {
            setErrorMessages({ name: "name", message: errors.input });
        }

    }

    return (
        <>
            <div id='userCheck'>
                <div id='header_psw'>
                    {/* <div className='Back'> */}
                    {/* <button id="idButton1" type="submit" onClick={Validatepsw}>SUBMIT</button> */}
                    <div className="logo-holder logo">
                        <h3>BGOWARAK</h3>
                        <p>POWER OF TECHNOLOGIES</p>
                    </div>
                    {/* </div> */}
                    <h2 id='tag'>CHANGE PASSWORD</h2>
                    <form name='myform_psw' onSubmit={handleSubmit}>
                        <div id='name' className='input-container'>
                            <label htmlFor="userName">USERNAME</label><br />
                            <input id="user" className="form_pass" type="text" name="userName" onChange={(e) => setEmail(e.target.value)} value={email}>
                            </input>
                            <span><i className="fa fa-user icon" id="toggle1"></i></span>
                            {renderErrorMessage("name")}
                        </div>
                        <div className='button-container'>
                            {/* <button id="idButton1" type="submit" onClick={Validatepsw}>BACK</button> */}
                            <button id="idButton1" type="submit" onClick={Validatepsw}>VERIFY</button>
                            <button id="idButton_no1" type="reset" onClick={Reset}>RESET</button>
                        </div>
                    </form>
                </div>
                <div id="foot_psw">
                    <footer>Copyright@ 2023</footer>
                </div>
            </div>
        </>
    )
}

export default Forget_Psw
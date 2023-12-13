import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"
import Axios from 'axios';
import OtpInput from 'react-otp-input';

function Otp_Generate() {
    const navigate = useNavigate();
    const ref_otp = useRef();
    const ref_otpOk = useRef();
    const [otp, setOtp] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        input: "INVALID INPUT",
        null: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
        );

    function clear() {
        setOtp("");
    }
    const calculateRemainingTime = () => {
        const storedExpirationTime = localStorage.getItem("otpExpirationTime");
        if (storedExpirationTime) {
            const storedTime = parseInt(storedExpirationTime, 10);
            return storedTime;
        }
        return 0;
    };

    const [otpExpirationTime, setOtpExpirationTime] = useState(calculateRemainingTime());

    useEffect(() => {
        if (!localStorage.getItem("OtpToken")) {
            localStorage.clear();
            navigate("/login");
        }
        const timer = setInterval(() => {
            console.log(otpExpirationTime);
            if (otpExpirationTime > 0) {
                console.log(otpExpirationTime);
                setOtpExpirationTime((prevTime) => prevTime - 1);
                localStorage.setItem("otpExpirationTime", otpExpirationTime - 1);
            }
        }, 1000);

        return () => clearInterval(timer);

    }, [otpExpirationTime]);

    function Verify() {
        if (otp == "") {
            setErrorMessages({ name: "name", message: errors.input });
        } else {
            setErrorMessages({ name: "name", message: errors.null });
            Axios.post(process.env.REACT_APP_OTP_GENERATE, {
                otp: otp,
            }).then((response) => {
                if (response.data == "") {
                    Invalid();
                } else {
                    navigate("/forget_psw/change_psw");
                }
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

    const Invalid = () => {
        const otp = ref_otp.current;
        const btn1 = ref_otpOk.current;
        otp.style.display = "block";
        btn1.onclick = function () {
            otp.style.display = "none";
            clear();
        }
    }

    return (
        <>
            <div id='userCheck'>
                <div id='header_psw'>
                    <div ref={ref_otp} className="modal">
                        <div className="modal-content">
                            <p>Invalid OTP!!! please enter correct OTP, otherwise try again!!!</p>
                            <button ref={ref_otpOk} id="ok_otp" className="button_hide">ok</button>
                        </div>
                    </div>
                    <div className="logo-holder logo">
                        <h3>BGOWARAK</h3>
                        <p>POWER OF TECHNOLOGIES</p>
                    </div>
                    <h1 id='tag'>ENTER THE ONE-TIME PASSWORD</h1>
                    <OtpInput
                        containerStyle='OtpInput'
                        value={otp}
                        onChange={(value) => {
                            setOtp(value);
                        }}
                        numInputs={6}
                        renderSeparator={<span id='span'> </span>}
                        renderInput={(props) => <input id='otp' {...props} />}
                    />
                    {renderErrorMessage("name")}
                    <div id='verification'>
                        <button id="idButton" type="submit" onClick={Verify}>VERIFY</button>
                        <button id="idButton_no" type="reset" onClick={clear}>RESET</button>
                        <span id='send_one_more'><Link to="/forget_psw" className="forget_password">resend!</Link></span>
                    </div>
                </div>
                <div id="foot_psw">
                    <footer>Copyright@ 2023</footer>
                </div>
            </div>
        </>
    )
}

export default Otp_Generate
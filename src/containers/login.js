import React from 'react';
import { useNavigate, Link } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest, searchUsernameRequest, loginFailure } from '../action/action';
import { store, persistor } from '../redux/configureStore';

function LoginPage({ setToken, setSecretID }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const username = useRef(null);
    const password = useRef(null);
    const [errorMessages, setErrorMessages] = useState({});
    const errors = {
        userName: "Username required!",
        password: "Password required!",
        user_pass: "Username is not exists!!",
        Incorrect_pass: "Password is incorrect!!",
        null: ""
    };
    const [UserName, setUsername] = useState("");
    const [Password, setPassword] = useState("");
    const [passwordType, setPasswordType] = useState("password");
    const user = useSelector((state) => state.searchData);
    const [accurateData, setAccurateData] = useState("");

    const TogglePassword = (e) => {
        e.preventDefault();
        setPasswordType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    };
    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error_log">{errorMessages.message}</div>
        );

    // function handleAxiosError(error) {
    //     if (error.response) {
    //         console.log(error.response.data);
    //         console.log(error.response.status);
    //         console.log(error.response.headers);
    //     } else if (error.request) {
    //         console.log(error.request);
    //     } else {
    //         console.log('Error', error.message);
    //     }
    //     console.log(error.config);
    // }

    function validateForm() {
        if (UserName === "") {
            const element = username.current.focus();
            setErrorMessages({ name: "userName", message: errors.userName });
            dispatch(loginFailure('Username required!'));
        } else if (Password === "") {
            const element = password.current.focus();
            setErrorMessages({ name: "password", message: errors.password });
            dispatch(loginFailure('Password required!'));
        } else {
            fetchData();
            // axios.post(process.env.REACT_APP_SEARCH_USERNAME, {
            //     username: UserName
            // }).then((response) => {
            //     if (response.data.length == 0) {
            //         setErrorMessages({ name: "userName", message: errors.user_pass });
            //     } else if (response.data.length > 0) {
            //         axios.post(process.env.REACT_APP_LOGIN, {
            //             username: UserName,
            //             password: Password
            //         }).then((res) => {
            //             if (res.data.result.length === 0) {
            //                 localStorage.clear();
            //                 setErrorMessages({ name: "password", message: errors.Incorrect_pass });
            //             } else if (res.data.result[0].SecretID == null) {
            //                 setToken(res.data.token);
            //                 navigate("/dashboard_emp");
            //             } else {
            //                 setToken(res.data.token);
            //                 setSecretID(res.data.result[0].SecretID);
            //                 navigate("/dashboard");
            //             }
            //         }).catch(handleAxiosError);
            //     }
            // }).catch(handleAxiosError);
        }
    };

    async function fetchData() {
        try {
            await dispatch(searchUsernameRequest(UserName));
            await dispatch(loginRequest(UserName, Password));
            if (user === null) {
                setErrorMessages({ name: "userName", message: errors.user_pass });
            } 
            // else if (store.getState().searchData.result === undefined) {
            //     setAccurateData(store.getState().searchData[0]);
            //     PageNavirator(accurateData, store.getState());
            // } else {
            //     setAccurateData(store.getState().searchData.result[0]);
            //     PageNavirator(accurateData, store.getState());
            // }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // function PageNavirator(accurateData, store) {
    //     if (accurateData.Password === Password) {
    //         setErrorMessages({ name: "password", message: errors.null });
    //         if (store.secretID) {
    //             setToken(store.token);
    //             setSecretID(store.secretID);
    //             navigate("/dashboard");
    //         } else if ((store.token)) {
    //             setToken(store.token);
    //             navigate("/dashboard_emp");
    //         }
    //     } else {
    //         loginFailure(errors.Incorrect_pass);
    //         setErrorMessages({ name: "password", message: errors.Incorrect_pass });
    //     }
    // }

    useEffect(() => {
        if (store.getState().error == 'Username not found.' && user === null) {
            setErrorMessages({ name: "userName", message: errors.user_pass });
        } else if (user?.result) {
            if (user.result[0].Password === Password) {
                setErrorMessages({ name: "password", message: errors.null });
                if (user.result[0].SecretID) {
                    setToken(user.token);
                    setSecretID(user.result[0].SecretID);
                    navigate("/dashboard");
                } else if ((user.result[0].token)) {
                    setToken(user.token);
                    navigate("/dashboard_emp");
                }
            } else {
                loginFailure(errors.Incorrect_pass);
                setErrorMessages({ name: "password", message: errors.Incorrect_pass });
            }
        }
    }, [user]);

    function handleSubmit(event) {
        event.preventDefault();
    }

    function check() {
        if (UserName) {
            setErrorMessages({ name: 'null', message: errors.null });
        }
    };

    return (
        <>

            <div id='front'>
                <div className="logo-holder logo">
                    <h3>BGOWARAK</h3>
                    <p>POWER OF TECHNOLOGIES</p>
                </div>
                <div id="header">
                    <form name="myForm" onSubmit={handleSubmit}>
                        <div id='loginPage'>
                            <label htmlFor="userName">USERNAME</label><br />
                            <input ref={username} id="user" type="text" name="userName" onKeyUp={check} autoComplete="username" onChange={(e) => setUsername(e.target.value)} value={UserName}>
                            </input><span><i className="fa fa-user icon" id="toggle"></i></span>
                        </div>
                        {renderErrorMessage("userName")}
                        <div id='loginPage'>
                            <label htmlFor="password">PASSWORD</label><br />
                            <input ref={password} id="pass" type={passwordType} name="password" autoComplete="current-password" onKeyUp={check} onChange={(e) => setPassword(e.target.value)} value={Password}>
                            </input><span><i id="toggle" onClick={TogglePassword}>
                                {passwordType === "password" ? <i className="fa fa-eye-slash"></i> : <i className="fa fa-eye"></i>}</i></span>
                        </div>
                        {renderErrorMessage("password")}
                        <div id='loginPage'>
                            <input type="checkbox" value="lsRememberMe" id="rememberMe"></input>
                            <label htmlFor="rememberMe">Remember me</label>
                            <span className="psw">Forgot <Link to="/forget_psw" className="forget_password">password?</Link></span>
                        </div>
                        <button id="button" type="submit" onClick={validateForm}>LOGIN</button>
                    </form>
                </div>
                <div id="foot">
                    <b><footer>Copyright@ 2023</footer></b>
                </div>
            </div>
        </>
    );
}

export default LoginPage
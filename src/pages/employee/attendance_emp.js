import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Axios from 'axios';
import moment from "moment";
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";

function Attendance_Emp() {
    const navigate = useNavigate();
    const ref_date = useRef(null);
    const ref_task = useRef(null);
    const ref_date_ok = useRef(null);
    const ref_success = useRef(null);
    const ref_success_close2 = useRef(null);
    const ref_success_ok = useRef(null);
    const ref_mode = useRef(null);
    const ref_att_date = useRef(null);
    const ref_to_date = useRef(null);
    const ref_date_fromonly = useRef(null);
    const ref_days = useRef(null);
    const ref_pick = useRef(null);
    const min = new Date().getMonth() + 1;
    const max = new Date().getFullYear();
    const [empname, SetEmpName] = useState("");
    const [empId, setEmpID] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [Designation, setDesignation] = useState("");
    const [endDate, setEnddate] = useState("");
    const [toDate, setToDate] = useState("");
    const [task, setTask] = useState("");
    const [date, setDate] = useState("");
    const [mode, setMode] = useState("");
    const [day, setDay] = useState(1);
    const [errorMessages, setErrorMessages] = useState({});
    const myyear = date.substring(0, 4);
    const mymonth = date.substring(5, 7);
    const ref_dashboard = useRef(null);
    const nextDay = new Date(date);
    const errors = {
        CONFIRM_PASSWORD: "ENTER CORRECT CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER CURRENT PASSWORD!",
        NEW_PASSWORD_LENGTH: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMNBER AND SPECIAL CHAR(*,&,...)",
        NULL: "",
        empID: "ENTER THE EMPLOYEE ID",
        name: "INVALID DATA",
        date: "ENTER THE DATE",
        taskBar: "EMPTY",
        mode: "PICK THE MOODE",
        dateFormat: "INVALID DATE!",
        null: "",
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error1">{errorMessages.message}</div>
        );

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

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    function Reset() {
        setDate("");
        setTask("");
        setMode("");
        setDay("");
        setToDate("");
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    const InvalidDate = () => {
        const modal_date = ref_date.current;
        const btn1 = ref_date_ok.current;
        modal_date.style.display = "block";
        btn1.onclick = function () {
            setDate("");
            setErrorMessages({ name: "date", message: errors.date });
            modal_date.style.display = "none";
        }
    }

    useEffect(() => {
        Axios.post(process.env.REACT_APP_MY_INFO, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            const data = response.data[0];
            SetEmpName(data.First_Name + " " + data.Last_Name)
            setEmpID(data.EmpID);
            setFirstname(data.First_Name);
            setLastname(data.Last_Name);
            setDesignation(data.Designation);
        })).catch(handleAxiosError)
    }, []);


    function Clear() {
        const modal_clear = ref_success.current;
        const btn1 = ref_success_ok.current;
        const span = ref_success_close2.current;
        modal_clear.style.display = "block";

        span.onclick = function () {
            modal_clear.style.display = "none";
        }

        btn1.onclick = function () {
            modal_clear.style.display = "none";
            window.location.reload(false);
        }
    }

    function Insert() {
        if (task == "") {
            const element = ref_task.current.focus();
            setErrorMessages({ name: "task", message: errors.taskBar });
        } if (date == "") {
            const element = ref_att_date.current.focus();
            setErrorMessages({ name: "date", message: errors.date });
        } if (mode == "") {
            const element = ref_mode.current.focus();
            setErrorMessages({ name: "mode", message: errors.mode });
        } else if (empId != "" && firstName != "" && lastName != "" && Designation != "" && task != "" && mode != "" && date != "") {
            if (myyear == max && (mymonth == min + 1 || mymonth == min)) {
                setErrorMessages({ name: "date", message: errors.null });
                if (toDate) {
                    Axios.post(process.env.REACT_APP_SHOW_ATTENDANCE_DETAILS, {
                        empid: empId,
                        date: date,
                        dateTo: moment(new Date(toDate)).format("YYYY-MM-DD"),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => {
                        if (response.data[0] == null) {
                            setErrorMessages({ name: "date", message: errors.null });
                            Axios.post(process.env.REACT_APP_ATTENDANCE, {
                                empid: empId,
                                empname: empname,
                                designation: Designation,
                                dateFrom: date,
                                dateTo: moment(new Date(toDate)).format("YYYY-MM-DD"),
                                mode: mode,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) => {
                                Reset();
                                Clear();
                            }).catch(handleAxiosError)
                        }
                        else {
                            let element = ref_att_date.current.focus();
                            setErrorMessages({ name: "date", message: errors.dateFormat });
                            InvalidDate();
                        }
                    })
                } else {
                    Axios.post(process.env.REACT_APP_SHOW_ATTENDANCE_DETAILS, {
                        empid: empId,
                        date: date,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => {
                        if (response.data[0] == null) {
                            setErrorMessages({ name: "date", message: errors.null });
                            Axios.post(process.env.REACT_APP_ATTENDANCE, {
                                empid: empId,
                                empname: empname,
                                designation: Designation,
                                dateFrom: date,
                                mode: mode,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) => {
                                Reset();
                                Clear();
                            }).catch(handleAxiosError)
                        }
                        else {
                            let element = ref_att_date.current.focus();
                            setErrorMessages({ name: "date", message: errors.dateFormat });
                            InvalidDate();
                        }
                    })
                }
            } else {
                let element = ref_att_date.current.focus();
                setErrorMessages({ name: "date", message: errors.dateFormat });
            }
        }
    }

    function handleLeave() {
        let mode_value = ref_mode.current.value;
        if (mode_value == "4") {
            const daysPicker = ref_days.current;
            daysPicker.style.display = "block";
        } else {
            setDay("");
            const toDateInput = ref_to_date.current;
            toDateInput.style.display = "none";
            const daysPicker = ref_days.current;
            daysPicker.style.display = "none";
        }
    }

    function handleDaySelect() {
        let mode_value = ref_mode.current.value;
        if (mode_value != 4) {
            const toDateInput = ref_to_date.current;
            toDateInput.style.display = "none";
            const daysPicker = ref_days.current;
            daysPicker.style.display = "none";
        } else {
            let No_of_days = parseInt(ref_pick.current.value, 10);
            const toDateInput = ref_to_date.current;
            if (No_of_days === 1) {
                setToDate("");
                nextDay.setDate(nextDay.getDate());
                setEnddate(nextDay)
                toDateInput.style.display = "none";
            } else if (No_of_days === 2) {
                nextDay.setDate(nextDay.getDate() + 1);
                if (nextDay.getDay() === 0) {
                    nextDay.setDate(nextDay.getDate() + 1);
                    setToDate(nextDay);
                    setEnddate(nextDay);
                } else {
                    setToDate(nextDay);
                    setEnddate(nextDay);
                }
                toDateInput.style.display = "block";
            } else {
                if (nextDay.getDay() === 6) {
                    nextDay.setDate(nextDay.getDate() + 3);
                    if (nextDay.getDay() === 0) {
                        nextDay.setDate(nextDay.getDate() + 1);
                        setEnddate(nextDay);
                        setToDate(nextDay);
                    } else {
                        setToDate(nextDay);
                        setEnddate(nextDay);
                    }
                } else {
                    nextDay.setDate(nextDay.getDate() + 2);
                    if (nextDay.getDay() === 0) {
                        nextDay.setDate(nextDay.getDate() + 1);
                        setEnddate(nextDay);
                        setToDate(nextDay);
                    } else {
                        setToDate(nextDay);
                        setEnddate(nextDay);
                    }
                }
                toDateInput.style.display = "block";
            }
        }
    }
    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_success} className="modal">
                    <div className="modal-content">
                        <span ref={ref_success_close2} className="close">&times;</span>
                        <p>Updated Successfully!!!</p>
                        <button ref={ref_success_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_date} className="modal">
                    <div className="modal-content">
                        <p>Invalid date! Enter the current date and month or Already exists!</p>
                        <button ref={ref_date_ok} id="ok_date" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body">
                    {renderErrorMessage("success")}
                    <h1>My Attendance</h1>
                    <div id="full_flow">
                        <form name="myForm" method="get" target="_self" onSubmit={handleSubmit}>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input disabled className="form empID" type="number" onWheel={e => { e.target.blur() }} onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="first">First_Name</label>
                                <input disabled className="form fName" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="last">Last_Name</label>
                                <input disabled className="form lName" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="designation">Designation</label>
                                <input disabled className="form design" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="mode">Mode</label>
                                <select ref={ref_mode} id="mode" className="form" onChange={(e) => { setMode(e.target.value); handleLeave(); }} value={mode} name="mode">
                                    <option value={""} disabled>select</option>
                                    <option value={"1"}>WFH</option>
                                    <option value={"2"}>WFO</option>
                                    <option value={"3"}>HYBRID</option>
                                    <option value={"4"}>LEAVE</option>
                                </select>
                                {renderErrorMessage("mode")}
                            </div>
                            <div id="name" ref={ref_days} style={{ display: "none" }}>
                                <label htmlFor="days">Days</label>
                                <select ref={ref_pick} id="days" className="form" onChange={(e) => { setDay(e.target.value); handleDaySelect(); }} value={day} name="days">
                                    <option value={"1"}>One day</option>
                                    <option value={"2"}>Two days</option>
                                    <option value={"3"}>Three days</option>
                                </select>
                                {renderErrorMessage("days")}
                            </div>
                            <div id='name' ref={ref_date_fromonly}>
                                <label htmlFor="date">Date</label>
                                <input ref={ref_att_date} id="date" className="form" type="date" onSelect={handleDaySelect} onChange={(e) => { setDate(e.target.value); }} value={moment(date).day() === 0 ? setDate("") : date} min={min} max={max} name="date"></input>
                                {renderErrorMessage("date")}
                            </div>
                            <div id="name" ref={ref_to_date} style={{ display: "none" }}>
                                <div>
                                    <label htmlFor="date">To</label>
                                    <input className="form dateTo" type="date" onChange={(e) => setToDate(e.target.value)} value={moment(toDate).day() === 0 ? setToDate("") : moment(new Date(toDate)).format("YYYY-MM-DD")} min={date} max={moment(new Date(endDate)).format("YYYY-MM-DD")} name="date"></input>
                                    {renderErrorMessage("date")}
                                </div>
                            </div>
                            <div id='name'>
                                <label htmlFor="task">Task</label>
                                <textarea id="task" ref={ref_task} className="form" type="text" rows="4" cols="50" onChange={(e) => setTask(e.target.value)} value={task} name="task" placeholder="Task"></textarea>
                                {renderErrorMessage("task")}
                            </div>
                            <button id="btn_Submit" type="submit" onClick={Insert}>SUBMIT</button>
                            <button id="btn_Reset" type="reset" onClick={Reset}>RESET</button>
                        </form>
                    </div>
                </div>
                <FooterUser />
            </div>
        </>
    )

}

export default Attendance_Emp
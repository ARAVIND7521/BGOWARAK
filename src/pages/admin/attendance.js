import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Axios from 'axios';
import moment, { months } from "moment";
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";
import * as XLSX from "xlsx";

function Attendance() {
    const navigate = useNavigate();
    const ref_date = useRef(null);
    const ref_date_ok = useRef(null);
    const ref_success = useRef(null);
    const ref_success_close2 = useRef(null);
    const ref_success_ok = useRef(null);
    const ref_empid = useRef(null);
    const ref_design = useRef(null);
    const ref_mode = useRef(null);
    const ref_task = useRef(null);
    const ref_att_date = useRef(null);
    const ref_to_date = useRef(null);
    const ref_date_fromonly = useRef(null);
    const ref_days = useRef(null);
    const ref_pick = useRef(null);
    const ref_update_profile = useRef(null);
    const ref_cancel = useRef(null);
    const ref_upload = useRef(null);
    const ref_file = useRef(null);
    const min = new Date().getMonth() + 1;
    const max = new Date().getFullYear();
    const [empId, setEmpID] = useState("");
    const [Designation, setDesignation] = useState("");
    const [endDate, setEnddate] = useState("");
    const [toDate, setToDate] = useState("");
    const [task, setTask] = useState("");
    const [date, setDate] = useState("");
    const [mode, setMode] = useState("");
    const [day, setDay] = useState(1);
    const [file, setFile] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const myyear = date.substring(0, 4);
    const mymonth = date.substring(5, 7);
    const ref_dashboard = useRef(null);
    const ref_lists = useRef(null);
    const ref_lists_frame = useRef(null);
    const edit_name = useRef(null);
    const [availableDate, setAvailableDate] = useState("");
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const nextDay = new Date(date);
    let element = "";
    const characterCount = task.length;
    const remainingCharacters = 250;
    const [excelData, setExcelData] = useState([]);
    let currentDate = new Date();
    const [lastOfMonth, setLastOfMonth] = useState(new Date());
    const [errorMsg, setErrorMsg] = useState(true);
    const errors = {
        CONFIRM_PASSWORD: "ENTER CORRECT CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER CURRENT PASSWORD!",
        NEW_PASSWORD_LENGTH: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMNBER AND SPECIAL CHAR(*,&,...)",
        NULL: "",
        DATA_PICK: "PICK ANY ONE",
        empID: "NO RECORD FOUND!",
        name: "INVALID DATA",
        date: "ENTER THE DATE",
        taskBar: "EMPTY",
        mode: "PICK THE MOODE",
        dateFormat: "INVALID DATE!",
        null: "",
        EXCEL: "PICK THE FILE",
        EXCELSIZE: "File size exceeds the limit (2MB).",
        EXCELONLY: "Only excel files (.xlsx, .xls) are allowed."
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

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className={errorMsg ? 'error1' : 'error'}>{errorMessages.message}</div>
        );

    useEffect(() => {
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    function Reset() {
        setEmpID("");
        setDesignation("");
        setDate("");
        setTask("");
        setMode("");
        setDay("");
        setToDate("");
        setSearchQuery("");
        editName();
    }

    function handleSubmit(event) {
        event.preventDefault();
    }

    const InvalidDate = (date) => {
        const modal_date = ref_date.current;
        const btn1 = ref_date_ok.current;
        modal_date.style.display = "block";
        setAvailableDate(date);
        btn1.onclick = function () {
            setDate("");
            setToDate("");
            setErrorMessages({ name: "date", message: errors.date });
            modal_date.style.display = "none";
        }
    }

    function Autopick(name) {
        Axios.post(process.env.REACT_APP_DASHBOARD, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            filter(response.data, name);
        })).catch(handleAxiosError);
    }

    function filter(data, name) {
        const filteredEmployees = data.filter((employee) =>
            employee.EmpID.toString().includes(name.toLowerCase()) || employee.First_Name.toLowerCase().includes(name.toLowerCase()) || employee.Last_Name.toLowerCase().includes(name.toLowerCase())
        );
        setFilteredEmployees(filteredEmployees);
        if (filteredEmployees.length === data.length || filteredEmployees.length === null) {
            setErrorMessages({ name: "EmpName", message: errors.null });
        } else if (filteredEmployees.length === 0) {

            setErrorMessages({ name: "EmpName", message: errors.empID });
            setEmpID("");
            setDesignation("");
        } else {
            setErrorMessages({ name: "EmpName", message: errors.null });
            const filterList = ref_lists_frame.current;
            if (filterList) {
                filterList.style.display = "flex";
            }
        }
    }

    const handleSearchChange = (newData) => {
        setSearchQuery(newData);
        Autopick(newData);
    };

    const handleEmployeeSelect = (employee) => {
        setSearchQuery(employee.First_Name + " " + employee.Last_Name);
        setEmpID(employee.EmpID);
        setDesignation(employee.Designation);
        const filteList = ref_lists_frame.current;
        filteList.style.display = "none";
        const searchItems = ref_empid.current;
        searchItems.disabled = true;
        const edit = edit_name.current;
        edit.style.display = "inline-block";
    };

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
        }
    }

    function handleExcelUpload(file) {
        const reader = new FileReader();
        const allowedTypes = [".xlsx", ".xls", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-excel"];
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        if (file) {
            setErrorMsg(false);
            if (file.size > maxSize) {
                setErrorMessages({ name: "file", message: errors.EXCELSIZE });
                setFile("");
                setExcelData("");
            } else if (!allowedTypes.includes(file.type)) {
                setErrorMessages({ name: "file", message: errors.EXCELONLY });
                setFile("");
                setExcelData("");
            } else {
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
                    setExcelData(jsonData);
                };
                reader.readAsArrayBuffer(file);
                setFile(file);
                setLastOfMonth(moment(currentDate, "MMMM-YYYY").endOf('month').format("YYYY-MM-DD"));
            }
        } else {
            setFile("");
        }
    }

    const handleUploaded = () => {
        if (excelData) {
            let excelRowDate = excelData[5];
            let excelRowMode = excelData[6];
            const empID = excelData[6][0];
            const empName = excelData[6][1];
            const designation = excelData[6][2];
            for (let data in excelRowDate) {
                const year = moment(Date(excelData[1][1])).year();
                const month = (moment(Date(excelData[1][0])).month() + 1).toString().padStart(2, '0');
                const day = excelRowDate[data].toString().padStart(2, '0');
                const formattedDate = year + "-" + month + "-" + day;
                if (moment(formattedDate).day() !== 0) {
                    const modal = ref_upload.current;
                    modal.style.display = "none";
                    Axios.post(process.env.REACT_APP_SHOW_ATTENDANCE_DETAILS, {
                        empid: empID,
                        date: formattedDate,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).then((response) => {
                        if (response.data.length === 0) {
                            setErrorMessages({ name: "date", message: errors.null });
                            Axios.post(process.env.REACT_APP_ATTENDANCE, {
                                empid: empID,
                                empname: empName,
                                designation: designation,
                                dateFrom: formattedDate,
                                mode: excelRowMode[data] || 4,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).then((response) => {
                                Reset();
                                if (formattedDate == lastOfMonth) {
                                    Clear();
                                }
                            }).catch(handleAxiosError);
                        }
                        else {
                            InvalidDate();
                        }
                    })
                }
            }
        }
    }

    function Insert() {
        const filteList = ref_lists_frame.current;
        if (task == "") {
            element = ref_task.current.focus();
            setErrorMessages({ name: "task", message: errors.taskBar });
        } if (date == "") {
            element = ref_att_date.current.focus();
            setErrorMessages({ name: "date", message: errors.date });
        } if (mode == "") {
            element = ref_mode.current.focus();
            setErrorMessages({ name: "mode", message: errors.mode });
        } if (searchQuery == "") {
            element = ref_empid.current.focus();
            setErrorMessages({ name: "EmpName", message: errors.empID });
        } else if (empId === "") {
            element = ref_empid.current.focus();
            setErrorMessages({ name: "EmpName", message: errors.empID });
        } else if (filteList.style.display === "flex") {
            element = ref_empid.current.focus();
            setErrorMessages({ name: "EmpName", message: errors.DATA_PICK });
        } else if (empId != "" && searchQuery != "" && Designation != "" && task != "" && mode != "" && date != "") {
            if (myyear == max && (mymonth == min + 1 || mymonth == min)) {
                Axios.post(process.env.REACT_APP_DASHBOARD, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response => {
                    handleData();
                })).catch(handleAxiosError);
            } else {
                element = ref_att_date.current.focus();
                setErrorMessages({ name: "date", message: errors.dateFormat });
            }
        }
    }

    const handleTaskChange = (e) => {
        const newValue = e.target.value;
        if (newValue.length <= 250) {
            setTask(newValue);
        }
    };

    function handleData() {
        setErrorMessages({ name: "date", message: errors.null });
        if (toDate) {
            Axios.post(process.env.REACT_APP_SHOW_ATTENDANCE_DETAILS, {
                empid: empId,
                empname: searchQuery,
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
                        empname: searchQuery,
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
                    InvalidDate(date + " or " + moment(new Date(toDate)).format("YYYY-MM-DD"));
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
                        empname: searchQuery,
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
                    InvalidDate(date);
                }
            })
        }
    }

    function editName() {
        const searchItems = ref_empid.current;
        searchItems.disabled = false;
        const edit = edit_name.current;
        edit.style.display = "none";
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
                setEnddate(nextDay);
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

    function handleSchedule() {
        const modal = ref_upload.current;
        modal.style.display = "block";
    }

    function uploadFrame() {
        if (file === undefined || file == "") {
            setErrorMessages({ name: "file", message: errors.EXCEL });
        } else {
            setErrorMessages({ name: "file", message: errors.NULL });
            handleUploaded();
        }
    }

    function closeFrame() {
        const modal = ref_upload.current;
        modal.style.display = "none";
        window.location.reload(false);
    }

    return (
        <>
            <div id="full_frame">
                <Header />
                <div ref={ref_success} className="modal">
                    <div className="modal-content">
                        <span ref={ref_success_close2} className="close">&times;</span>
                        <p>Updated Successfully!!!</p>
                        <button ref={ref_success_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_date} className="modal">
                    <div className="modal-content">
                        <p>{availableDate ? ("Attendance already available for Date: " + availableDate) : ("Attendance already available")}</p>
                        <button ref={ref_date_ok} id="ok_date" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_upload} className="modal">
                    <div className="modal-content">
                        <b><p>UPLOAD SCHEDULE</p></b>
                        <center>
                            <div id='name'>
                                <input
                                    ref={ref_file}
                                    type="file"
                                    onChange={(e) => handleExcelUpload(e.target.files[0])}
                                />
                                {renderErrorMessage("file")}
                            </div>
                        </center>
                        <button ref={ref_update_profile} id="update" className="button_hide" type="button" onClick={uploadFrame} >UPLOAD</button>
                        <button ref={ref_cancel} id="edit" className="button_next" type="button" onClick={closeFrame} >CLOSE</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body">
                    <div className="profile">
                        <h1>My Attendance</h1>
                        <button className="button_hide" onClick={handleSchedule}>Upload schedule</button>
                    </div>
                    <div id="full_flow">
                        <form name="myForm" method="get" target="_self" onSubmit={handleSubmit}>
                            <div id='name'>
                                <label htmlFor='empname'>Employee Name</label>
                                <input
                                    ref={ref_empid}
                                    id="empname_id"
                                    className='form'
                                    type='text'
                                    onWheel={e => { e.target.blur() }}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    value={searchQuery}
                                    placeholder='Search employee name or employee ID'
                                    name="ID"
                                ></input>
                                <span>
                                    <i ref={edit_name} className="editIcon fa fa-edit" onClick={editName} id="toggle"></i>
                                </span>
                                {filteredEmployees.length > 0 && (
                                    <ul ref={ref_lists_frame} id="atcelement">
                                        {filteredEmployees.map((employee, index) => (
                                            <li id="filterName" ref={ref_lists} key={index} value={index} onClick={(e) => handleEmployeeSelect(employee)}>
                                                {employee.EmpID + "-" + employee.First_Name + " " + employee.Last_Name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {renderErrorMessage('EmpName')}
                            </div>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input disabled className="form empID" type="number" onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="designation">Designation</label>
                                <input ref={ref_design} disabled id="design" className="form" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                                {renderErrorMessage("name")}
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
                                <textarea ref={ref_task} id="task" className="form" type="text" rows="4" cols="50" onChange={handleTaskChange} value={task} name="task" placeholder="task"></textarea>
                                <div className="character-count">
                                    {characterCount}/{remainingCharacters}
                                </div>
                                {renderErrorMessage("task")}
                            </div>
                            <button id="btn_Submit" type="submit" onClick={Insert}>SUBMIT</button>
                            <button id="btn_Reset" type="reset" onClick={Reset}>RESET</button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div >
        </>
    )

}

export default Attendance
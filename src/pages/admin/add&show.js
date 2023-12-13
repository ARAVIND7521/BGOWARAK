import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import moment from 'moment';
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";

function AddShow() {
    const navigate = useNavigate();
    const ref_success = useRef(null);
    const ref_success_ok = useRef(null);
    const ref_username = useRef(null);
    const ref_password = useRef(null);
    const ref_confirmPass = useRef(null);
    const ref_Age = useRef(null);
    const ref_update_save = useRef(null);
    const ref_update_close = useRef(null);
    const ref_edit = useRef(null);
    const ref_edit_open = useRef(null);
    const ref_edit_cancel = useRef(null);
    const ref_show = useRef(null);
    const ref_show_close2 = useRef(null);
    const ref_firstname = useRef(null);
    const ref_lastname = useRef(null);
    const ref_exp = useRef(null);
    const ref_designation = useRef(null);
    const ref_DOB = useRef(null);
    const ref_DOJ = useRef(null);
    const ref_mail = useRef(null);
    const ref_address = useRef(null);
    const ref_zipcode = useRef(null);
    const ref_mobileno = useRef(null);
    const ref_file = useRef(null);
    const ref_dashboard = useRef(null);
    const ref_image = useRef(null);
    const [empId, setEmpID] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [Username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [Designation, setDesignation] = useState("");
    const [DOB, setDOB] = useState("");
    const [Age, setAge] = useState("");
    const [DOJ, setDOJ] = useState("");
    const [DOD, setDOD] = useState(0);
    const [Experience, setExperience] = useState("");
    const [Address, setAddress] = useState("");
    const [Zipcode, setZipcode] = useState("");
    const [MobileNO, setMobileNO] = useState("");
    const [Is_Active, setIs_Active] = useState(1);
    const [OTP, setOTP] = useState("NULL");
    const [info, setInfo] = useState([]);
    const [Mail, setMail] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const [confirmPass, setConfirmPass] = useState("");
    const [file, setFile] = useState();
    const currentDate = new Date().toISOString().split("T")[0];
    const [Profile, setProfile] = useState("no-project.webp");
    const [image, setImage] = useState("");
    let years = Math.floor(Experience);
    const months = Math.round((Experience - years) * 12);
    // my1stcompany2001@gmail.com
    const errors = {
        AGE: "Age is above 18",
        FIRSTNAME: "ENTER THE FIRST NAME!",
        LASTNAME: "ENTER THE LAST NAME!",
        DOB: "ENTER VALID DOB!",
        DOJ: "ENTER VALID DOJ!",
        MAIL: "ENTER VALID MAIL ID!",
        EXPERIENCE: "MENTION THE EXPERIENCE!",
        DESIGNATION: "MENTION THE DESIGNATION!",
        ADDRESS: "ENTER THE ADDRESS!",
        ZIPCODE: "ENTER THE ZIPCODE!",
        MOBILENO: "ENTER THE MOBILE NO!",
        USERNAME: "ENTER THE USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMBER AND SPECIAL CHAR(*,&,...)",
        PASSWORD: "ENTER THE PASSWORD! AND MINIMUM 8 CHARACTER INCLUDE UPPERCASE LETTER, NUMBER AND SPECIAL CHAR(*,&,...)",
        CONFIRM_PASSWORD: "ENTER THE CONFIRM PASSWORD!",
        CONFIRMED_PASSWORD: "MISMATCHING CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER CURRENT PASSWORD!",
        CURRENT_PASSWORD_ALREADY: "ENTER CURRENT PASSWORD OR NEW PASSWORD IS ALREADY EXISTS!",
        NEW_PASSWORD_LENGTH: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE UPPERCASE LETTER, NUMBER AND SPECIAL CHAR(*,&,...)",
        FILE: "UPLOAD FILE!",
        DATA: "ENTER THE DATA",
        DATA2: "INVAILD DATA",
        RECORD: "NO RECORD FOUND!",
        NULL: "",
        IMAGESIZE: "File size exceeds the limit (2MB).",
        IMAGEONLY: "Only image files (JPEG, PNG, GIF, WEBP) are allowed."
    };

    let formattedExperience =
        years > 0
            ? `${years} ${years === 1 ? 'YR' : 'YRS'}`
            : '';

    if (months > 0) {
        formattedExperience += formattedExperience ? ' ' : '';
        formattedExperience += `${months} ${months === 1 ? 'MO' : 'MOS'}`;
    }

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error1">{errorMessages.message}</div>
        );

    const renderErrorMsg = (name) =>
        name === errorMessages.name && (
            <div className="error">{errorMessages.message}</div>
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
        axios.post(process.env.REACT_APP_FIND_EMPLOYEE, {
        }).then((response => {
            setEmpID(response.data.length + 1);
        }
        )).catch(handleAxiosError);
    }, []);

    useEffect(() => {
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    function handleSubmit(event) {
        event.preventDefault();
    }

    function Show_data() {
        const modal_show = ref_show.current;
        const span = ref_show_close2.current;
        modal_show.style.display = "block";
        span.onclick = function () {
            modal_show.style.display = "none";
            window.location.reload(false);
            Reset();
        }
        if (employeeID == "") {
            setErrorMessages({ name: "DATA2", message: errors.DATA2 });
        } else {
            Data();
        }
    }

    function Reset() {
        setFirstname("");
        setLastname("");
        setDOB("");
        setExperience("");
        setDesignation("");
        setDOJ("");
        setAddress("");
        setZipcode("");
        setMobileNO("");
        setPassword("");
        setUsername("");
        setFile("");
        setImage("");
        setAge("");
        setMail("");
        setErrorMessages({ name: "DATA", message: errors.NULL });
    }

    function handleAutopick(newEmpID) {
        setEmployeeID(newEmpID);
        Data(newEmpID);
    }

    function Data(employeeID) {
        axios.post(process.env.REACT_APP_DASHBOARD, {
            empid: employeeID,
        }).then((response => {
            setInfo(response.data);
            filter(response.data, employeeID);
        })).catch(handleAxiosError);
        setErrorMessages({ name: "DATA2", message: errors.NULL });
    }

    function filter(info, employeeID) {
        for (let data in info) {
            if (employeeID == info[data].EmpID) {
                setErrorMessages({ name: "DATA2", message: errors.NULL });
                setFirstname(info[data].First_Name);
                setLastname(info[data].Last_Name);
                setDOB(moment(info[data].DOB).format('YYYY-MM-DD'))
                setExperience(info[data].Experience);
                setDesignation(info[data].Designation);
                setAge(info[data].Age);
                setDOJ(moment(info[data].DOJ).format('YYYY-MM-DD'));
                setAddress(info[data].Address);
                setZipcode(info[data].Zipcode);
                setMobileNO(info[data].MobileNo);
                setProfile(info[data].Profile);
            } else if (employeeID === "" || employeeID >= info[data].EmpID || employeeID <= 0) {
                setErrorMessages({ name: "DATA2", message: errors.RECORD });
                setFirstname("");
                setLastname("");
                setDOB("");
                setExperience("");
                setDesignation("");
                setDOJ("");
                setAddress("");
                setZipcode("");
                setMobileNO("");
                setProfile("no-project.webp");
            }
        }
    }

    function Newdata() {
        if (firstName == "" && Mail == "" && lastName == "" && Designation == "" && Experience == "" && DOJ == "" && Address == "" && Zipcode == "" && MobileNO == "" && DOB == "" && Username == "" && password == "" && confirmPass == "" && file == "" && Age == "") {
            setErrorMessages({ name: "DATA", message: errors.DATA });
        } else if (firstName == "") {
            const element = ref_firstname.current.focus();
            setErrorMessages({ name: "FIRSTNAME", message: errors.FIRSTNAME });
        } else if (lastName == "") {
            const element = ref_lastname.current.focus();
            setErrorMessages({ name: "LASTNAME", message: errors.LASTNAME });
        } else if (Experience == "") {
            const element = ref_exp.current.focus();
            setErrorMessages({ name: "EXPERIENCE", message: errors.EXPERIENCE });
        } else if (Designation == "") {
            const element = ref_designation.current.focus();
            setErrorMessages({ name: "DESIGNATION", message: errors.DESIGNATION });
        } else if (DOB == "") {
            const element = ref_DOB.current.focus();
            setErrorMessages({ name: "DOB", message: errors.DOB });
        } else if (Age < 18 || Age == "" || Age == NaN) {
            const element = ref_DOB.current.focus();
            setErrorMessages({ name: "AGE", message: errors.AGE });
        } else if (DOJ == "") {
            const element = ref_DOJ.current.focus();
            setErrorMessages({ name: "DOJ", message: errors.DOJ });
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(Mail)) {
            const element = ref_mail.current.focus();
            setErrorMessages({ name: "MAIL", message: errors.MAIL });
        } else if (Address == "") {
            const element = ref_address.current.focus();
            setErrorMessages({ name: "ADDRESS", message: errors.ADDRESS });
        } else if (Zipcode == "" || Zipcode.length < 6) {
            const element = ref_zipcode.current.focus();
            setErrorMessages({ name: "ZIPCODE", message: errors.ZIPCODE });
        } else if (MobileNO == "" || MobileNO.length < 10) {
            const element = ref_mobileno.current.focus();
            setErrorMessages({ name: "MOBILENO", message: errors.MOBILENO });
        } else if (file == "" || image == "") {
            const element = ref_file.current.focus();
            setErrorMessages({ name: "FILE", message: errors.FILE });
        } else if (empId !== "" && firstName !== "" && lastName !== "" && Designation !== "" && Experience !== "" && DOJ !== "" && Address !== "" && Zipcode !== "" && MobileNO !== "" && DOB !== "" && Age !== "" && Age >= 18 && Zipcode.length >= 6 && MobileNO.length >= 10 && file !== "" && image !== "" && file !== "") {
            setErrorMessages({ name: "DATA", message: errors.NULL });
            Update_data();
        }
    }

    function handleDOBChange(newDOB) {
        setDOB(newDOB);
        AgeCalculator(newDOB);
    }

    function AgeCalculator(DOB) {
        let dob = new Date(DOB);
        let month_diff = Date.now() - dob.getTime();
        let age_dt = new Date(month_diff);
        let year = age_dt.getUTCFullYear();
        let age = Math.abs(year - 1970);
        if (isNaN(age)) {
            setAge("");
            const element = ref_DOB.current.focus();
            setErrorMessages({ name: "AGE", message: errors.AGE });
        } else {
            setAge(age);
            const element = ref_DOB.current.focus();
            setErrorMessages({ name: "AGE", message: errors.NULL });
        }
    }

    const NewsaveFile = (e) => {
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (file) {
            if (file.size > maxSize) {
                setErrorMessages({ name: "image", message: errors.IMAGESIZE });
                setFile("");
                setImage("");
            } else if (!allowedTypes.includes(file.type)) {
                setErrorMessages({ name: "image", message: errors.IMAGEONLY });
                setFile("");
                setImage("");
            } else {
                setErrorMessages({ name: "image", message: errors.NULL });
                setFile(file);
                setImage(URL.createObjectURL(file));;
            }
        } else {
            setFile("");
            setImage("");
        }
    };

    function Update_data() {
        if (Username == "" || Username.length < 8 || !/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]+$/.test(Username)) {
            const element = ref_username.current.focus();
            setErrorMessages({ name: "USERNAME", message: errors.USERNAME });
        } else if (password == "" || password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(password)) {
            const element = ref_password.current.focus();
            setErrorMessages({ name: "PASSWORD", message: errors.PASSWORD });
        } else if (confirmPass == "") {
            const element = ref_confirmPass.current.focus();
            setErrorMessages({ name: "CONFIRM_PASSWORD", message: errors.CONFIRM_PASSWORD });
        } else if (password !== confirmPass) {
            const element = ref_confirmPass.current.focus();
            setErrorMessages({ name: "CONFIRM_PASSWORD", message: errors.CONFIRMED_PASSWORD });
        } else {
            setErrorMessages({ name: "DATA", message: errors.NULL });
            axios.post(process.env.REACT_APP_ADD_SHOW_ATTENDANCE, {
                empid: empId,
                firstname: firstName,
                lastname: lastName,
                dob: DOB,
                age: Age,
                experience: Experience,
                designation: Designation,
                doj: DOJ,
                dod: DOD,
                address: Address,
                zipcode: Zipcode,
                is_active: Is_Active,
                username: Username.toLowerCase(),
                password: password,
                mobileno: MobileNO,
                otp: OTP,
                mail: Mail,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response => {
                handleUpload();
            })).catch(handleAxiosError);
        }
    }

    const handleUpload = async (e) => {
        const formData = new FormData();
        formData.append("image_file", file);
        formData.append("empid", empId);
        try {
            const res = await axios.post(
                process.env.REACT_APP_UPLOAD,
                formData
            );
            const modal = ref_success.current;
            modal.style.display = "block";
            const btn = ref_success_ok.current;
            btn.onclick = function () {
                modal.style.display = "none";
                window.location.reload(false);
            }
            Reset();
        } catch (ex) {
            console.log(ex);
        }
    };

    function Edit() {
        if (employeeID == "" || firstName == "" || lastName == "" || Designation == "" || Address == "" || Zipcode == "" || MobileNO == "") {
            setErrorMessages({ name: "DATA2", message: errors.DATA2 });
        } else {
            const showModal = ref_show.current;
            const modal = ref_edit.current;
            modal.style.display = "block";
            showModal.style.display = "none";
        }
    }

    function Close() {
        const modal_close = ref_show.current;
        modal_close.style.display = "none";
        window.location.reload(false);
        Reset();
    }

    function Save() {
        if (employeeID == "") {
            setErrorMessages({ name: "DATA2", message: errors.DATA2 });
        } else if (firstName == "") {
            setErrorMessages({ name: "FIRSTNAME", message: errors.FIRSTNAME });
        } else if (lastName == "") {
            setErrorMessages({ name: "LASTNAME", message: errors.LASTNAME });
        } else if (Designation == "") {
            setErrorMessages({ name: "DESIGNATION", message: errors.DESIGNATION });
        } else if (Address == "") {
            setErrorMessages({ name: "ADDRESS", message: errors.ADDRESS });
        } else if (Zipcode == "" || Zipcode.length < 6) {
            setErrorMessages({ name: "ZIPCODE", message: errors.ZIPCODE });
        } else if (MobileNO == "" || MobileNO.length < 10) {
            setErrorMessages({ name: "MOBILENO", message: errors.MOBILENO });
        } else {
            setErrorMessages({ name: "DATA", message: errors.NULL });
            axios.post(process.env.REACT_APP_EDIT_EMPLOYEE, {
                empid: employeeID,
                firstname: firstName,
                lastname: lastName,
                designation: Designation,
                DOB: DOB,
                Age: Age,
                address: Address,
                zipcode: Zipcode,
                mobileno: MobileNO,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response) => {
                const modal = ref_edit.current;
                const mod = ref_show.current;
                modal.style.display = "none";
                mod.style.display = "none";
                const modal1 = ref_success.current;
                modal1.style.display = "block";
                const btn1 = ref_success_ok.current;
                btn1.onclick = function () {
                    modal1.style.display = "none";
                    window.location.reload(false);
                }
                Reset();
            }).catch(handleAxiosError);
        }
    }

    function Close_Cancel() {
        const oldImage = ref_image.current;
        setImage(oldImage.src);
        setFile("");
        Data(employeeID);
        const showModal = ref_show.current;
        showModal.style.display = "block";
        const modal_cancel = ref_edit.current;
        modal_cancel.style.display = "none";
    }

    return (
        <>
            <div id="full_frame">
                <Header />
                <div id="heading" className="header">
                    <div ref={ref_success} className="modal">
                        <div className="modal-content">
                            <p>Updated Successfully!</p>
                            <button ref={ref_success_ok} id="ok" className="button_hide">ok</button>
                        </div>
                    </div>
                    <div ref={ref_show} className="modal">
                        <div className="modal-content">
                            <span ref={ref_show_close2} className="close">&times;</span>
                            <div className="profile">
                                <h1>Show Employee</h1>
                                <img id="photo-upload" src={process.env.REACT_APP_IMAGEURL + Profile} onChange={(e) => setProfile(e.target.value)} alt="Profile" />
                            </div>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input className="form1 employeeID" type="number" onWheel={e => { e.target.blur() }} onChange={(e) => handleAutopick(e.target.value)} value={employeeID} name="ID" placeholder="Emp ID"></input>
                                {renderErrorMessage("DATA2")}
                            </div>
                            <div id="Employees_display">
                                <div id='name'>
                                    <label htmlFor="first">First_Name</label>
                                    <input disabled className="form  responsive_input fName" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                                </div>
                                <div id='name'>
                                    <label htmlFor="last">Last_Name</label>
                                    <input disabled className="form  responsive_input lName" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                                </div>
                            </div>
                            <div id="Employees_display">
                                <div id='name'>
                                    <label htmlFor="experience">Experience</label>
                                    <input disabled className="form1 responsive_input exp" type="text" onChange={(e) => setExperience(e.target.value)} value={formattedExperience} name="Experience" placeholder="0 MONTH"></input>
                                </div>
                                <div id='name'>
                                    <label htmlFor="designation">Designation</label>
                                    <input disabled className="form responsive_input design" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                                </div>
                            </div>
                            <div id='name'>
                                <label htmlFor="dob">DOB</label>
                                <input disabled className="form1 dojion" type="text" onChange={(e) => setDOB(e.target.value)} value={DOB} name="dob" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="doj">DOJ</label>
                                <input disabled className="form1 dojion" type="text" onChange={(e) => setDOJ(e.target.value)} value={DOJ} name="doj" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id="Employees_display">
                                <div id='name' className="move">
                                    <label htmlFor="Address">Address</label>
                                    <input disabled className="form address_pts" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                                </div>
                                <div id='name'>
                                    <label htmlFor="Zipcode">Zipcode</label>
                                    <input disabled className="form zipcode_pts" type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                                </div>
                            </div>
                            <div id='name' className="move1">
                                <label htmlFor="MobileNO">Mobile NO</label>
                                <input disabled className="form mobile_no" type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                            </div>
                            <button ref={ref_edit_open} id="edit" className="button_hide" type="button" onClick={Edit}>EDIT</button>
                            <button ref={ref_update_close} id="update" className="button_next" type="button" onClick={Close}>CANCEL</button>
                        </div>
                    </div>
                    <div ref={ref_edit} className="modal">
                        <div className="modal-content">
                            <div className="profile1">
                                <h1>Edit Employee</h1>
                                <img ref={ref_image} id="photo-upload" src={process.env.REACT_APP_IMAGEURL + Profile} alt="Profile" />
                            </div>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input disabled className="form1 employeeID" type="number" onWheel={e => { e.target.blur() }} onChange={(e) => setEmployeeID(e.target.value)} value={employeeID} name="ID" placeholder="Emp ID"></input>
                                {renderErrorMessage("DATA2")}
                            </div>
                            <div id="Employees_display">
                                <div id='name'>
                                    <label htmlFor="first">First_Name</label>
                                    <input className="form responsive_input fName" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                                    {renderErrorMsg("FIRSTNAME")}
                                </div>

                                <div id='name'>
                                    <label htmlFor="last">Last_Name</label>
                                    <input className="form responsive_input lName" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                                    {renderErrorMsg("LASTNAME")}
                                </div>
                            </div>
                            <div id="Employees_display">
                                <div id='name'>
                                    <label htmlFor="experience">Experience</label>
                                    <input disabled className="form1 responsive_input exp" type="text" onChange={(e) => setExperience(e.target.value)} value={formattedExperience} name="Experience" placeholder="0 MONTH"></input>
                                </div>
                                <div id='name'>
                                    <label htmlFor="designation">Designation</label>
                                    <input className="form responsive_input design" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                                    {renderErrorMsg("DESIGNATION")}
                                </div>
                            </div>
                            <div id='name'>
                                <label htmlFor="dob">DOB</label>
                                <input disabled className="form1 dojion" type="text" onChange={(e) => setDOB(e.target.value)} value={moment(DOB).format('DD-MM-YYYY')} name="dob" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="doj">DOJ</label>
                                <input disabled className="form1 dojion" type="text" onChange={(e) => setDOJ(e.target.value)} value={moment(DOJ).format('DD-MM-YYYY')} name="doj" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id="Employees_display">
                                <div id='name' className="move">
                                    <label htmlFor="Address">Address</label>
                                    <input className="form address_pts" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                                    {renderErrorMsg("ADDRESS")}
                                </div>
                                <div id='name'>
                                    <label htmlFor="Zipcode">Zipcode</label>
                                    <input className="form zipcode_pts" type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                                    {renderErrorMsg("ZIPCODE")}
                                </div>
                            </div>
                            <div id='name' className="move1">
                                <label htmlFor="MobileNO">Mobile NO</label>
                                <input id="mobile_no" className="form" type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                                {renderErrorMsg("MOBILENO")}
                            </div>
                            <button ref={ref_update_save} id="update" className="button_hide" type="button" onClick={Save} >SAVE</button>
                            <button ref={ref_edit_cancel} id="edit" className="button_next" type="button" onClick={Close_Cancel} >CANCEL</button>
                        </div>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body_add_emp">
                    <div id="flex">
                        <h1>Add Employee</h1>
                        <button id="show_emp" onClick={Show_data}>Show</button>
                    </div>
                    <div id="full_flow">
                        <form name="myForm" method="get" target="_self" onSubmit={handleSubmit}>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input disabled className="form empID" type="number" onWheel={e => { e.target.blur() }} onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="first">First Name</label>
                                <input ref={ref_firstname} className="form fName" type="text" onChange={(e) => setFirstname(e.target.value.replace(/[^a-z]/gi, ''))} value={firstName} name="fname" placeholder="First name"></input>
                                {renderErrorMessage("FIRSTNAME")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="last">Last Name</label>
                                <input ref={ref_lastname} className="form lName" type="text" onChange={(e) => setLastname(e.target.value.replace(/[^a-z]/gi, ''))} value={lastName} name="lname" placeholder="Last name"></input>
                                {renderErrorMessage("LASTNAME")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="experience">Experience</label>
                                <select ref={ref_exp} className="form exp" onChange={(e) => setExperience(e.target.value)} value={Experience} name="Experience" placeholder="Experience">
                                    <option value={""} disabled>select</option>
                                    <option value="0 to 1">0-1 Year</option>
                                    <option value="1 to 3">1-3 Years</option>
                                    <option value="3 to 7">3-7 Years</option>
                                    <option value="7 to 10">7-10 Years</option>
                                    <option value="10+">10+ Years</option>
                                </select>
                                {renderErrorMessage("EXPERIENCE")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="designation">Designation</label>
                                <select ref={ref_designation} className="form design" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation">
                                    <option value={""} disabled>select</option>
                                    <option value="Software-trainee">Software-trainee</option>
                                    <option value="Software-Developer-trainee">Software-Developer-trainee</option>
                                    <option value="Software-Developer">Software-Developer</option>
                                    <option value="System Monitoring">System Monitoring</option>
                                    <option value="Designer-trainee">Designer-trainee</option>
                                    <option value="Programmer-trainee">Programmer-trainee</option>
                                    <option value="Web-Developer">Web-Developer</option>
                                    <option value="Tester-trainee">Tester-trainee</option>
                                    <option value="Frontend-Developer">Frontend-Developer</option>
                                    <option value="Internship">Internship</option>
                                    <option value="Designer">Designer</option>
                                    <option value="Programmer">Programmer</option>
                                    <option value="Trainee - Data Analyst">Trainee - Data Analyst</option>
                                    <option value="Senior Software-developer">Senior Software-developer</option>
                                    <option value="Java Developer">Java Developer</option>
                                    <option value="Senior tester">Senior tester</option>
                                    <option value="Full-stack developer">Full-stack developer</option>
                                    <option value="Senior-react developer">Senior-react developer</option>
                                </select>
                                {renderErrorMessage("DESIGNATION")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="dob">DOB</label>
                                <input id="dob" ref={ref_DOB} className="form" type="date" onChange={(e) => handleDOBChange(e.target.value)} max={currentDate} value={DOB} name="dob"></input>
                                {renderErrorMessage("DOB")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="age">Age</label>
                                <input disabled id="age" ref={ref_Age} className="form" type="text" onChange={(e) => setAge(e.target.value)} value={Age} name="age" placeholder="Your age"></input>
                                {renderErrorMessage("AGE")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="doj">DOJ</label>
                                <input id="doj" ref={ref_DOJ} className="form" type="date" onChange={(e) => setDOJ(e.target.value)} max={currentDate} value={DOJ} name="doj"></input>
                                {renderErrorMessage("DOJ")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="mail">Personal mail</label>
                                <input id="mail" ref={ref_mail} className="form" type="text" onChange={(e) => setMail(e.target.value)} value={Mail} name="lname" placeholder="Mail id"></input>
                                {renderErrorMessage("MAIL")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name' className="unwanted">
                                <label htmlFor="dod">DOD</label>
                                <input id="dod" disabled className="form" type="date" onChange={(e) => setDOD(e.target.value)} value={DOD} name="dod"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="Address">Address</label>
                                <input ref={ref_address} className="form address" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                                {renderErrorMessage("ADDRESS")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="Zipcode">Zipcode</label>
                                <input id="zipcode" ref={ref_zipcode} className="form" onWheel={e => { e.target.blur() }} type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                                {renderErrorMessage("ZIPCODE")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="MobileNO">Mobile Number</label>
                                <input ref={ref_mobileno} className="form mobileno" onWheel={e => { e.target.blur() }} type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                                {renderErrorMessage("MOBILENO")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name' className="image-upload">
                                <label htmlFor="Profile">Profile</label>
                                <input id="profile" ref={ref_file} className="form" type="file" onChange={NewsaveFile} name="image_file" />
                                {renderErrorMessage("FILE")}
                                {renderErrorMessage("DATA")}
                                {renderErrorMessage("image")}
                            </div>
                            {image && <img id="preview" src={image} width={"80px"} height={"100px"} alt="Profile"></img>}
                            <div id='name' className="unwanted">
                                <label htmlFor="Active">Active</label>
                                <input id="is_active" disabled className="form" type="number" onChange={(e) => setIs_Active(e.target.value)} value={Is_Active} name="Active"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="USERNAME">Username</label>
                                <input ref={ref_username} className="form empID" type="text" autoComplete="username" onChange={(e) => setUsername(e.target.value.toLowerCase())} value={Username} name="USERNAME" placeholder="Username"></input>
                                {renderErrorMessage("USERNAME")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="PASSWORD">Password</label>
                                <input ref={ref_password} className="form empID" type="password" max={12} autoComplete="new-password" onChange={(e) => setPassword(e.target.value)} value={password} name="PASSWORD" placeholder="password"></input>
                                {renderErrorMessage("PASSWORD")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <div id='name'>
                                <label htmlFor="PASSWORD">Confirm password</label>
                                <input id="passID" ref={ref_confirmPass} className="form" type="password" max={12} autoComplete="new-password" onChange={(e) => setConfirmPass(e.target.value)} value={confirmPass} name="PASSWORD" placeholder="confirm password"></input>
                                {renderErrorMessage("CONFIRM_PASSWORD")}
                                {renderErrorMessage("DATA")}
                            </div>
                            <button id="btn_Submit" type="submit" onClick={Newdata}>SUBMIT</button>
                            <button id="btn_Reset" type="reset" onClick={Reset}>RESET</button>
                        </form>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
};

export default AddShow
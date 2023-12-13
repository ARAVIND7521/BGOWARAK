import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom"
import Axios from 'axios';
import axios from "axios";
import { useEffect } from "react";
import moment from 'moment';
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";

function AddShowEmployee() {
    const navigate = useNavigate();
    const ref_success = useRef(null);
    const ref_success_ok = useRef(null);
    const ref_update_save = useRef(null);
    const ref_edit = useRef(null);
    const ref_edit_cancel = useRef(null);
    const ref_file_2 = useRef(null);
    const ref_dashboard = useRef(null);
    const ref_image = useRef(null);
    const ref_newimage = useRef(null);
    const [empId, setEmpID] = useState("");
    const [empname, SetEmpName] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [Designation, setDesignation] = useState("");
    const [DOJ, setDOJ] = useState("");
    const [Experience, setExperience] = useState("");
    const [Address, setAddress] = useState("");
    const [Zipcode, setZipcode] = useState("");
    const [MobileNO, setMobileNO] = useState("");
    const [emp_Id, setEmp_ID] = useState("");
    const [first_Name, setFirst_name] = useState("");
    const [last_Name, setLast_name] = useState("");
    const [Designation1, setDesignation1] = useState("");
    const [D_O_J, setD_O_J] = useState("");
    const [Experience1, setExperience1] = useState("");
    const [Address1, setAddress1] = useState("");
    const [Zip_code, setZip_code] = useState("");
    const [Mobile_NO, setMobile_NO] = useState("");
    const [DOB, setDOB] = useState("");
    const [Age, setAge] = useState("");
    const [information, setInformation] = useState([]);
    const [errorMessages, setErrorMessages] = useState({});
    const [Profile, setProfile] = useState("");
    const [image, setImage] = useState("");
    const [file, setFile] = useState();
    const errors = {
        USERNAME: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMNBER AND SPECIAL CHAR(*,&,...)",
        PASSWORD: "ENTER THE VALID PASSWORD!",
        CONFIRM_PASSWORD: "ENTER THE VALID CONFIRM PASSWORD!",
        CONFIRMED_PASSWORD: "ENTER CORRECT CONFIRM PASSWORD!",
        NEW_PASSWORD: "ENTER NEW PASSWORD!",
        CURRENT_PASSWORD: "ENTER CURRENT PASSWORD!",
        NEW_PASSWORD_LENGTH: "ENTER THE VALID USERNAME AND MINIMUM 8 CHARACTER INCLUDE NUMNBER AND SPECIAL CHAR(*,&,...)",
        FILE: "UPLOAD FILE!",
        DATA: "INVAILD DATA",
        DATA2: "INVAILD DATA",
        DATA1: "INVAILD DATA",
        NULL: ""
    };

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className="error1">{errorMessages.message}</div>
        );

    function handleSubmit(event) {
        event.preventDefault();
    }

    function Close_Cancel() {
        const modal_cancel = ref_edit.current;
        modal_cancel.style.display = "none";
    }

    function Edit() {
        const modal_edit = ref_edit.current;
        modal_edit.style.display = "block";
        axios.post(`http://localhost:3000/my_info/`, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            setEmp_ID(response.data[0].EmpID)
            setFirst_name(response.data[0].First_Name);
            setLast_name(response.data[0].Last_Name);
            setExperience1(response.data[0].Experience);
            setDesignation1(response.data[0].Designation);
            setD_O_J(response.data[0].DOJ);
            setAddress1(response.data[0].Address);
            setZip_code(response.data[0].Zipcode);
            setMobile_NO(response.data[0].MobileNo);
        })).catch(function (error) {
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
    };

    function Save() {
        if (emp_Id == "" || first_Name == "" || last_Name == "" || Designation1 == "" || Experience1 == "" || D_O_J == "" || Address1 == "" || Zip_code == "" || Mobile_NO == "") {
            setErrorMessages({ name: "DATA2", message: errors.DATA2 });
        } else {
            setErrorMessages({ name: "DATA", message: errors.NULL });
            Axios.post('http://localhost:3000/edit_employee/', {
                empid: empId,
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
                handleUploaded();
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

    const NewsaveFile = (e) => {
        setFile(e.target.files[0]);
        setImage(URL.createObjectURL(e.target.files[0]));
    };


    const saveFile = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFile(file);
            setImage(URL.createObjectURL(file));
            const image = ref_image.current;
            image.style.display = "none";
            const newImage = ref_newimage.current;
            newImage.style.display = "block";
        } else {
            setFile("");
            setImage("");
        }
    };

    const handleUploaded = async (e) => {
        // const mod = ref_show.current;
        const modal = ref_edit.current;
        if (file) {
            const formData = new FormData();
            formData.append("image_file_2", file);
            try {
                const res = await axios.post(
                    "http://localhost:3000/uploading/",
                    formData
                );
                modal.style.display = "none";
                // mod.style.display = "none";
                const modal1 = ref_success.current;
                modal1.style.display = "block";
                const btn1 = ref_success_ok.current;
                btn1.onclick = function () {
                    modal1.style.display = "none";
                }
                window.location.reload(false);
            } catch (ex) {
                console.log(ex);
            }
        } else {
            modal.style.display = "none";
            // mod.style.display = "none";
            const modal1 = ref_success.current;
            modal1.style.display = "block";
            const btn1 = ref_success_ok.current;
            btn1.onclick = function () {
                modal1.style.display = "none";
            }
            window.location.reload(false);
        }
    };

    useEffect(() => {
        axios.post('http://localhost:3000/my_info/', {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            const data = response.data[0];
            setInformation(response.data);
            SetEmpName(data.First_Name + " " + data.Last_Name)
            setEmpID(data.EmpID);
            setFirstname(data.First_Name);
            setLastname(data.Last_Name);
            setExperience(data.Experience);
            setDesignation(data.Designation);
            setDOJ(data.DOJ);
            setDOB(data.DOB);
            setAddress(data.Address);
            setZipcode(data.Zipcode);
            setMobileNO(data.MobileNo);
            setProfile(data.Profile);
        })).catch(function (error) {
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
    }, []);;

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, []);

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_success} className="modal">
                    <div className="modal-content">
                        <p>Updated Successfully!</p>
                        <button ref={ref_success_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_edit} className="modal">
                    <div className="modal-content">
                        <div className="profile1">
                            <h1>Edit Employee</h1>
                            <img ref={ref_newimage} id="photo-upload-visible" src={image} alt="Profile"></img>
                            <img ref={ref_image} id="photo-upload" src={`http://localhost:3000/images/` + Profile} alt="Profile" />
                            <div id='name' className="image-upload-edit">
                                <input id="empID" ref={ref_file_2} className="form" type="file" onChange={saveFile} name="image_file_2" />
                            </div>
                        </div>
                        <div id='name'>
                            <label htmlFor="empid">Emp ID</label>
                            <input disabled id="employeeID" className="form1" type="number" onWheel={e => { e.target.blur() }} onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                            {renderErrorMessage("DATA2")}
                        </div>
                        <div id="Employees_display">
                            <div id='name'>
                                <label htmlFor="first">First Name</label>
                                <input id="fName" className="form responsive_input" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="last">Last Name</label>
                                <input id="lName" className="form responsive_input" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                            </div>
                        </div>
                        <div id="Employees_display">
                            <div id='name'>
                                <label htmlFor="experience">Experience</label>
                                <input disabled id="exp" className="form1 responsive_input" type="text" onChange={(e) => setExperience(e.target.value)} value={Math.floor(Experience) + " YEARS "} name="Experience" placeholder="Experience"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="designation">Designation</label>
                                <input disabled id="design" className="form responsive_input" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                            </div>
                        </div>
                        <div id='name'>
                            <label htmlFor="dob">DOB</label>
                            <input id="dojion" className="form1" type="text" onChange={(e) => setDOB(e.target.value)} value={moment(DOB).format('DD-MM-YYYY')} name="dob" placeholder="DD-MM-YYYY"></input>
                        </div>
                        <div id='name'>
                            <label htmlFor="doj">DOJ</label>
                            <input disabled id="dojion" className="form1" type="text" onChange={(e) => setDOJ(e.target.value)} value={moment(DOJ).format('DD-MM-YYYY')} name="doj" placeholder="DD-MM-YYYY"></input>
                        </div>
                        <div id="Employees_display">
                            <div id='name' className="move">
                                <label htmlFor="Address">Address</label>
                                <input id="address_pts" className="form" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="Zipcode">Zipcode</label>
                                <input id="zipcode_pts" className="form" type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                            </div>
                        </div>
                        <div id='name' className="move1">
                            <label htmlFor="MobileNO">Mobile Number</label>
                            <input id="mobile_no" className="form" type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                        </div>
                        <button ref={ref_update_save} id="update" className="button_hide" type="button" onClick={Save} >SAVE</button>
                        <button ref={ref_edit_cancel} id="edit" className="button_next" type="button" onClick={Close_Cancel} >CANCEL</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body_edit_emp">
                    <div id="full_flow">
                        <form name="myForm" method="get" target="_self" onSubmit={handleSubmit}>
                            <div className="profile">
                                <h1>Show Employee</h1>
                                <img id="photo-upload" src={`http://localhost:3000/images/` + Profile} alt="Profile" />
                            </div>
                            <div id='name'>
                                <label htmlFor="empid">Emp ID</label>
                                <input disabled id="empID" className="form" type="number" onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="first">First_Name</label>
                                <input disabled id="fName" className="form" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="last">Last_Name</label>
                                <input disabled id="lName" className="form" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="experience">Experience</label>
                                <input disabled id="exp" className="form" type="text" onChange={(e) => setExperience(e.target.value)} value={Math.floor(Experience) + " YEARS "} name="Experience" placeholder="Experience"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="designation">Designation</label>
                                <input disabled id="design" className="form" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="dob">DOB</label>
                                <input disabled id="dob" className="form" type="text" onChange={(e) => setDOB(e.target.value)} value={moment(DOB).format('DD-MM-YYYY')} name="dob" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="doj">DOJ</label>
                                <input disabled id="doj" className="form" type="text" onChange={(e) => setDOJ(e.target.value)} value={moment(DOJ).format('DD-MM-YYYY')} name="doj" placeholder="DD-MM-YYYY"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="Address">Address</label>
                                <input disabled id="address" className="form" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="Zipcode">Zipcode</label>
                                <input disabled id="zipcode" className="form" type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                            </div>
                            <div id='name'>
                                <label htmlFor="MobileNO">Mobile Number</label>
                                <input disabled id="mobileno" className="form" type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                            </div>
                            <button id="edit" className="button_hide" type="button" onClick={Edit}>EDIT</button>
                        </form>
                    </div>
                </div>
                <FooterUser />
            </div >
        </>
    )
};

export default AddShowEmployee
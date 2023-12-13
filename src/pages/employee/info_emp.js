import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom"
import axios from "axios";
import moment from 'moment';
import Figure from 'react-bootstrap/Figure';
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";

function Info_Emp() {
    const navigate = useNavigate();
    const [empId, setEmpID] = useState("");
    const [firstName, setFirstname] = useState("");
    const [lastName, setLastname] = useState("");
    const [Designation, setDesignation] = useState("");
    const [DOJ, setDOJ] = useState("");
    const [DOB, setDOB] = useState("");
    const [Experience, setExperience] = useState("");
    const [Age, setAge] = useState("");
    const [Address, setAddress] = useState("");
    const [Zipcode, setZipcode] = useState("");
    const [MobileNO, setMobileNO] = useState("");
    const [Profile, setProfile] = useState("");
    const ref_dashboard = useRef(null);
    const ref_fname = useRef(null);
    const ref_lname = useRef(null);
    const ref_address = useRef(null);
    const ref_zipcode = useRef(null);
    const ref_dob = useRef(null);
    const ref_Age = useRef(null);
    const ref_mobile = useRef(null);
    const ref_update_save = useRef(null);
    const ref_edit_cancel = useRef(null);
    const ref_file_2 = useRef(null);
    const ref_newimage = useRef(null);
    const ref_update_ok = useRef(null);
    const ref_success = useRef(null);
    const ref_imageFrame = useRef(null);
    const ref_update_profile = useRef(null);
    const ref_cancel = useRef(null);
    const ref_edit_button = useRef(null);
    const [image, setImage] = useState("");
    const [file, setFile] = useState();
    const [errorMessages, setErrorMessages] = useState({});
    let years = Math.floor(Experience);
    const months = Math.round((Experience - years) * 12);
    const [errorMsg, setErrorMsg] = useState(true);
    const errors = {
        DATA: "INVALID DATA!",
        FIRSTNAME: "ENTER THE FIRST NAME!",
        LASTNAME: "ENTER THE LAST NAME!",
        DOB: "ENTER VALID DOB!",
        DOB_VALID: "INVALID DOB! AGE IS ABOVE !8",
        ADDRESS: "ENTER THE ADDRESS!",
        ZIPCODE: "ENTER THE ZIPCODE!",
        MOBILENO: "ENTER THE MOBILE NO!",
        NULL: "",
        IMAGE: "PICK THE PROFILE",
        IMAGESIZE: "File size exceeds the limit (2MB).",
        IMAGEONLY: "Only image files (JPEG, PNG, GIF, WEBP) are allowed."
    };

    let formattedExperience =
        years > 0
            ? `${years} ${years === 1 ? 'YEAR' : 'YEARS'}`
            : '';

    if (months > 0) {
        formattedExperience += formattedExperience ? ' ' : '';
        formattedExperience += `${months} ${months === 1 ? 'MONTH' : 'MONTHS'}`;
    }

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div className={errorMsg ? 'error1' : 'error'}>{errorMessages.message}</div>
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

    useEffect(() => {
        axios.post(process.env.REACT_APP_MY_INFO, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            const data = response.data[0];
            setEmpID(data.EmpID);
            setFirstname(data.First_Name);
            setLastname(data.Last_Name);
            setExperience(data.Experience);
            setDesignation(data.Designation);
            setDOJ(data.DOJ);
            setAge(data.Age)
            setDOB(moment(data.DOB).format('YYYY-MM-DD'));
            setAddress(data.Address);
            setZipcode(data.Zipcode);
            setMobileNO(data.MobileNo);
            setProfile(data.Profile);
        })).catch(handleAxiosError)
    }, []);

    function Close_Cancel() {
        axios.post(process.env.REACT_APP_MY_INFO, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            const data = response.data[0];
            setEmpID(data.EmpID);
            setFirstname(data.First_Name);
            setLastname(data.Last_Name);
            setExperience(data.Experience);
            setDesignation(data.Designation);
            setDOJ(data.DOJ);
            setAge(data.Age)
            setDOB(moment(data.DOB).format('YYYY-MM-DD'));
            setAddress(data.Address);
            setZipcode(data.Zipcode);
            setMobileNO(data.MobileNo);
            setProfile(data.Profile);
        })).catch(handleAxiosError)
    };

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
            setAge('');
            const element = ref_dob.current.focus();
            setErrorMessages({ name: "DOB", message: errors.DOB_VALID });
        } else {
            setAge(age);
            const element = ref_dob.current.focus();
            setErrorMessages({ name: "DOB", message: errors.NULL });
        }
    }

    function Save() {
        if (empId == "") {
            setErrorMessages({ name: "DATA2", message: errors.DATA });
        } else if (firstName == "") {
            setErrorMessages({ name: "FIRSTNAME", message: errors.FIRSTNAME });
        } else if (lastName == "") {
            setErrorMessages({ name: "LASTNAME", message: errors.LASTNAME });
        } else if (DOB == "") {
            setErrorMessages({ name: "DOB", message: errors.DOB });
        } else if (Age < 18) {
            setErrorMessages({ name: "DOB", message: errors.DOB_VALID });
        } else if (Address == "") {
            setErrorMessages({ name: "ADDRESS", message: errors.ADDRESS });
        } else if (Zipcode == "" || Zipcode.length < 6) {
            setErrorMessages({ name: "ZIPCODE", message: errors.ZIPCODE });
        } else if (MobileNO == "" || MobileNO.length < 10) {
            setErrorMessages({ name: "MOBILENO", message: errors.MOBILENO });
        } else {
            setErrorMessages({ name: "DATA", message: errors.NULL });
            axios.post(process.env.REACT_APP_EDIT_EMPLOYEE, {
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
                const modal1 = ref_success.current;
                modal1.style.display = "block";
                const btn1 = ref_update_ok.current;
                btn1.onclick = function () {
                    modal1.style.display = "none";
                    window.location.reload(false);
                }
            }).catch(handleAxiosError)
        }
    };

    const handleUploaded = async (e) => {
        if (file) {
            const formData = new FormData();
            formData.append("image_file_2", file);
            formData.append("empid", empId);
            try {
                const res = await axios.post(
                    process.env.REACT_APP_UPLOADING,
                    formData
                );
                const modal = ref_imageFrame.current;
                modal.style.display = "none";
                const modal1 = ref_success.current;
                modal1.style.display = "block";
                const btn1 = ref_update_ok.current;
                btn1.onclick = function () {
                    modal1.style.display = "none";
                    window.location.reload(false);
                }
            } catch (ex) {
                console.log(ex);
            }
        } else {
            const modal = ref_imageFrame.current;
            modal.style.display = "none";
            const modal1 = ref_success.current;
            modal1.style.display = "block";
            const btn1 = ref_update_ok.current;
            btn1.onclick = function () {
                modal1.style.display = "none";
                window.location.reload(false);
            }
        }
    };

    function Edit() {
        const edit = ref_edit_button.current;
        const fname = ref_fname.current;
        const lname = ref_lname.current;
        const DOB = ref_dob.current;
        const Address = ref_address.current;
        const Zipcode = ref_zipcode.current;
        const Mobileno = ref_mobile.current;
        fname.disabled = false;
        lname.disabled = false;
        DOB.disabled = false;
        Address.disabled = false;
        Zipcode.disabled = false;
        Mobileno.disabled = false;
        edit.style.display = "none";
        const save = ref_update_save.current;
        save.style.display = "inline-block";
        const cancel = ref_edit_cancel.current;
        cancel.style.display = "inline-block";
    }

    const saveFile = (e) => {
        const newImage = ref_newimage.current;
        const file = e.target.files[0];
        const maxSize = 2 * 1024 * 1024; // 2MB in bytes
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (file) {
            setErrorMsg(false);
            if (file.size > maxSize) {
                setErrorMessages({ name: "image", message: errors.IMAGESIZE });
                setFile("");
                setImage("");
                newImage.style.display = "none";
            } else if (!allowedTypes.includes(file.type)) {
                setErrorMessages({ name: "image", message: errors.IMAGEONLY });
                setFile("");
                setImage(""); 
                newImage.style.display = "none";
            } else {
                setErrorMessages({ name: "image", message: errors.NULL });
                setFile(file);
                setImage(URL.createObjectURL(file));;
                newImage.style.display = "block";
            }
        } else {
            setFile("");
            setImage("");
        }
    };

    function UploadImage() {
        const modal = ref_imageFrame.current;
        modal.style.display = "block";
    }

    function uploadFrame() {
        if (file === undefined || image === "") {
            setErrorMessages({ name: "image", message: errors.IMAGE });
        } else {
            setErrorMessages({ name: "image", message: errors.NULL });
            handleUploaded();
        }
    }

    function closeFrame() {
        const modal = ref_imageFrame.current;
        modal.style.display = "none";
        window.location.reload(false);
    }

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <div ref={ref_success} className="modal">
                    <div className="modal-content">
                        <p>Updated Successfully!</p>
                        <button ref={ref_update_ok} id="ok" className="button_hide">ok</button>
                    </div>
                </div>
                <div ref={ref_imageFrame} className="modal">
                    <div className="modal-content">
                        <b><p>CHANGE PROFILE</p></b>
                        <center>
                            <img ref={ref_newimage} id="photo-upload-visible1" src={image} alt="Profile"></img>
                            <div id='name' className="image-uload-edit">
                                <input ref={ref_file_2} type="file" onChange={saveFile} name="image_file_2" />
                                {renderErrorMessage("image")}
                            </div>
                        </center>
                        <button ref={ref_update_profile} id="update" className="button_hide" type="button" onClick={uploadFrame} >UPLOAD</button>
                        <button ref={ref_cancel} id="edit" className="button_next" type="button" onClick={closeFrame} >CLOSE</button>
                    </div>
                </div>
                <div ref={ref_dashboard} id="body">
                    <div className="profile">
                        <h1>My Information</h1>
                        <div id="image-frame">
                            <Figure>
                                <Figure.Image
                                    id="photo-upload"
                                    alt="Profile"
                                    src={process.env.REACT_APP_IMAGEURL + Profile}
                                    onClick={UploadImage}
                                />
                            </Figure>
                        </div>
                    </div>
                    <div id='name'>
                        <label htmlFor="empid">Emp ID</label>
                        <input disabled className="form empID" type="number" onChange={(e) => setEmpID(e.target.value)} value={empId} name="ID" placeholder="Emp ID"></input>
                    </div>
                    <div id='name'>
                        <label htmlFor="first">First Name</label>
                        <input disabled ref={ref_fname} className="form fName" type="text" onChange={(e) => setFirstname(e.target.value)} value={firstName} name="fname" placeholder="First name"></input>
                    </div>
                    {renderErrorMessage("FIRSTNAME")}
                    <div id='name'>
                        <label htmlFor="last">Last Name</label>
                        <input disabled ref={ref_lname} className="form lName" type="text" onChange={(e) => setLastname(e.target.value)} value={lastName} name="lname" placeholder="Last name"></input>
                    </div>
                    {renderErrorMessage("LASTNAME")}
                    <div id='name'>
                        <label htmlFor="experience">Experience</label>
                        <input disabled className="form exp" type="text" onChange={(e) => setExperience(e.target.value)} value={formattedExperience} name="Experience" placeholder="Experience"></input>
                    </div>
                    <div id='name'>
                        <label htmlFor="designation">Designation</label>
                        <input disabled className="form design" type="text" onChange={(e) => setDesignation(e.target.value)} value={Designation} name="designation" placeholder="Designation"></input>
                    </div>
                    <div id='name'>
                        <label htmlFor="dob">DOB</label>
                        <input disabled id="dob" ref={ref_dob} className="form" type="date" onChange={(e) => handleDOBChange(e.target.value)} value={DOB} name="dob" placeholder="DD-MM-YYYY"></input>
                    </div>
                    {renderErrorMessage("DOB")}
                    <div id='name'>
                        <label htmlFor="age">AGE</label>
                        <input disabled ref={ref_Age} id="age" className="form" type="number" onChange={(e) => setAge(e.target.value)} value={Age} name="age" placeholder="Age"></input>
                    </div>
                    <div id='name'>
                        <label htmlFor="doj">DOJ</label>
                        <input disabled id="doj" className="form" type="text" onChange={(e) => setDOJ(e.target.value)} value={moment(DOJ).format('DD-MM-YYYY')} name="doj" placeholder="DD-MM-YYYY"></input>
                    </div>
                    <div id='name'>
                        <label htmlFor="Address">Address</label>
                        <input disabled ref={ref_address} className="form address" type="text" onChange={(e) => setAddress(e.target.value)} value={Address} name="Address" placeholder="Address"></input>
                    </div>
                    {renderErrorMessage("ADDRESS")}
                    <div id='name'>
                        <label htmlFor="Zipcode">Zipcode</label>
                        <input disabled id="zipcode" ref={ref_zipcode} className="form" type="number" maxLength={6} pattern="[0-9]{6}" onChange={(e) => setZipcode(e.target.value)} value={Zipcode} name="Zipcode" placeholder="123456"></input>
                    </div>
                    {renderErrorMessage("ZIPCODE")}
                    <div id='name'>
                        <label htmlFor="MobileNO">Mobile Number</label>
                        <input disabled id="mobileno" ref={ref_mobile} className="form" type="number" maxLength={10} pattern="[0-9]{10}" onChange={(e) => setMobileNO(e.target.value)} value={MobileNO} name="MobileNO" placeholder="1234567890"></input>
                    </div>
                    {renderErrorMessage("MOBILENO")}
                    <button ref={ref_edit_button} id="edit" className="button_hide" type="button" onClick={Edit}>EDIT</button>
                    <button ref={ref_update_save} id="update" className="button_hide editIcon" type="button" onClick={Save} >SAVE</button>
                    <button ref={ref_edit_cancel} id="edit" className="button_next editIcon" type="button" onClick={Close_Cancel} >RESET</button>
                </div>
                <FooterUser />
            </div>
        </>
    )

}

export default Info_Emp
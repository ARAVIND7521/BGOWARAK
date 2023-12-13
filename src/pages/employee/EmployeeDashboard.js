import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Axios from 'axios';
import Calendar from 'react-calendar';
import HeaderUser from "../../components/User/Header";
import FooterUser from "../../components/User/Footer";
import { Modal } from 'react-bootstrap';

function Employee_Dashboard() {
    const navigate = useNavigate();
    const ref_calendar = useRef(null);
    const ref_dashboard = useRef(null);
    const [date, setDate] = useState(new Date());
    const [specialEmp, SetSpecialEmp] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const itemsToShow = 4;

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
        Axios.post(process.env.REACT_APP_BIRTHDAY_LIST, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response => {
            SetSpecialEmp(response.data);
        })).catch(handleAxiosError);
    }, [])

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            localStorage.clear();
            navigate("/login");
        }
    }, [navigate]);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const showPrevBirthday = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const showNextBirthday = () => {
        if (currentIndex < specialEmp.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <>
            <div id="full_frame">
                <HeaderUser />
                <Modal style={{ paddingTop: "500px" }} show={showModal} className="fadeout">
                    <Modal.Header closeButton>
                        <Modal.Title>Birthday list
                            <span onClick={closeModal} className="close">&times;</span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div id="allSpecialEmployeeList">
                            {Array.isArray(specialEmp) ?
                                (specialEmp.map((item, index) => {
                                    return (
                                        <div className="birthdayCard" key={index}>
                                            <div className="profileImageContainer">
                                                <img className="profileImage"
                                                    src={process.env.REACT_APP_IMAGEURL + specialEmp[index].Profile} alt="profile" width={"50px"} height={"80px"}>
                                                </img>
                                            </div>
                                            <div className="employeeDetails">
                                                <p className="employeeID-birthcard"><b>EMP ID:</b>{specialEmp[index].EmpID}</p>
                                                <p className="employeeName">{specialEmp[index].First_Name + " " + specialEmp[index].Last_Name}</p>
                                                <p className="employeeDOB">{new Date(specialEmp[index].DOB).toLocaleDateString("es-CL")}</p>
                                            </div>
                                        </div>
                                    );
                                })
                                ) : (
                                    <p>No special employees to display.</p>
                                )}
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button id="closeModalButton" onClick={closeModal}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
                <div ref={ref_dashboard} id="body_admin">
                    <div className='app'>
                        <h1 className='text-center'>Calendar</h1>
                        <div className='calendar-container'>
                            <Calendar ref={ref_calendar} onChange={setDate}
                                maxDate={new Date()}
                                minDate={new Date(1990, 1, 1)}
                                value={date}
                            />
                        </div>
                    </div>
                    <div id="dashborad">
                        <h2 id="Spec_Employee_len">
                            <span className="fa fa-angle-left" onClick={showPrevBirthday}></span>
                            Birthday
                            <span className="fa fa-angle-right" onClick={showNextBirthday}></span>
                        </h2>
                        <div id="specialEmployeeList">
                            {Array.isArray(specialEmp) ? (
                                specialEmp.slice(currentIndex, currentIndex + itemsToShow).map((item, index) => {
                                    return (
                                        <div className="birthdayCard" key={index}>
                                            <div className="profileImageContainer">
                                                <img className="profileImage"
                                                    src={process.env.REACT_APP_IMAGEURL + item.Profile} alt="profile" width={"50px"} height={"80px"}>
                                                </img>
                                            </div>
                                            <div className="employeeDetails">
                                                <p className="employeeID-birthcard"><b>EMP ID:</b>{item.EmpID}</p>
                                                <p className="employeeName">{item.First_Name + " " + item.Last_Name}</p>
                                                <p className="employeeDOB">{new Date(item.DOB).toLocaleDateString("es-CL")}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p>No special employees to display.</p>
                            )}
                        </div>
                        {Array.isArray(specialEmp) && specialEmp.length > itemsToShow && (
                            <button id="viewAllButton" onClick={openModal}>
                                View All
                            </button>
                        )}
                    </div>
                </div>
                <FooterUser />
            </div>
        </>
    )
};

export default Employee_Dashboard
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import axios from "axios";
import moment from 'moment';
import Header from "../../components/Admin/Header";
import Footer from "../../components/Admin/Footer";
import * as XLSX from "xlsx";
import { MDBDataTable } from 'mdbreact';

function Report() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState([]);
    const [year, setYear] = useState(new Date());
    const [dateFrom, setDateFrom] = useState("");
    const [Month, setMonth] = useState("");
    const [dateTo, setDateTo] = useState("");;
    const [designation, setDesignation] = useState("");
    const [errorMessages, setErrorMessages] = useState({});
    const ref_dashboard = useRef(null);
    const acc_option = useRef(null);
    const ref_excel = useRef(null);
    const ref_table = useRef(null);
    const [min, setMin] = useState("");
    const [max, setMax] = useState("");
    const errors = {
        NULL: ""
    };
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const modeMap = {
        1: "Remote",
        2: "In-office",
        3: "Hybird",
        4: "Leave"
    };

    const renderErrorMessage = (name) =>
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
        if (!localStorage.getItem("secretID")) {
            localStorage.clear();
            navigate("/login");
        }
        const currentDate = new Date();
        const currentMonthName = monthNames[currentDate.getMonth()];
        setMonth(currentMonthName);
        const firstDayOfMonth = moment(currentDate, "MMMM YYYY").startOf("month").format("YYYY-MM-DD");
        const lastDayOfMonth = moment(currentDate, "MMMM YYYY").endOf("month").format("YYYY-MM-DD");
        setMin(firstDayOfMonth);
        setMax(lastDayOfMonth);
        setDateFrom(firstDayOfMonth);
        setDateTo(lastDayOfMonth);
        axios.post(process.env.REACT_APP_TEAM_ATTENDANCE, {
            date: firstDayOfMonth,
            dateTo: lastDayOfMonth,
            designation: designation,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setUserData(response.data);
            let Accordion = acc_option.current;
            Accordion.style.display = "block";
            setErrorMessages({ name: "null", message: errors.NULL });
        }).catch(handleAxiosError);
    }, []);

    function handleMonthChange(selectedMonth) {
        setMonth(selectedMonth)
        const firstDayOfMonth = moment(selectedMonth, "MMMM YYYY").startOf("month").format("YYYY-MM-DD");
        const lastDayOfMonth = moment(selectedMonth, "MMMM YYYY").endOf("month").format("YYYY-MM-DD");
        setMin(firstDayOfMonth);
        setMax(lastDayOfMonth);
        setDateFrom(firstDayOfMonth);
        setDateTo(lastDayOfMonth);
    }

    function search() {
        axios.post(process.env.REACT_APP_TEAM_ATTENDANCE, {
            date: dateFrom,
            dateTo: dateTo,
            designation: designation,
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            setUserData(response.data);
            let Accordion = acc_option.current;
            Accordion.style.display = "block";
            setErrorMessages({ name: "null", message: errors.NULL });
        }).catch(handleAxiosError);
    }

    function clear() {
        window.location.reload(false);
    };

    function exportToExcel() {
        const table = ref_table.current.state.rows;
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(table);
        XLSX.utils.book_append_sheet(wb, ws, "Attendance Data");
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        if (designation) {
            a.download = designation + "_Team_attendance.xlsx";
        } else if (min !== dateFrom || max !== dateTo) {
            a.download = dateFrom + " to " + dateTo + " attendance_list.xlsx";
        } else {
            a.download = Month + "_attendance.xlsx";
        }
        a.click();
        URL.revokeObjectURL(url);
    }

    const generateDateRange = (start, end) => {
        const dateRange = [];
        let currentDate = moment(start);
        while (currentDate <= moment(end)) {
            dateRange.push(currentDate.format("YYYY-MM-DD"));
            currentDate.add(1, "days");
        }
        return dateRange;
    };

    const dateRange = generateDateRange(dateFrom, dateTo);
    const groupAttendanceData = (data) => {
        const groupedData = {};
        data.forEach((item) => {
            if (!groupedData[item.EmpID]) {
                groupedData[item.EmpID] = {
                    EmpID: item.EmpID,
                    EmpName: item.EmpName,
                    Designation: item.Designation,
                    Date: item.Date
                };
            }
            groupedData[item.EmpID][moment(item.Date).format("YYYY-MM-DD")] = {
                Mode: modeMap[item.mode] || "N/A",
                Status: item.Status || "N/A",

            };
        });
        return Object.values(groupedData);
    };
    const groupedData = groupAttendanceData(userData);
    return (
        <>
            <div id="full_frame">
                <Header />
                <div ref={ref_dashboard} id="body">
                    <center><h2 id="attendance_h2">Show Attendance</h2></center>
                    <div id="searching">
                        <label htmlFor="date">Year</label>
                        <select id="empMode" disabled onChange={(e) => setYear(e.target.value)} value={moment(year).year()}>
                            <option value="2023">2023</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                        <label htmlFor="date">Month</label>
                        <select id="empMode" onChange={(e) => handleMonthChange(e.target.value)} value={Month}>
                            {monthNames.map((monthName, index) => (
                                <option key={index} value={monthName}>
                                    {monthName}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="date">From</label>
                        <input id="dateFrom" type="date" disabled={!Month} min={min} max={max} onChange={(e) => setDateFrom(e.target.value)} value={moment(dateFrom).format("YYYY-MM-DD")} name="date"></input>
                        {renderErrorMessage("name")}
                        <label htmlFor="date">To</label>
                        <input id="dateTo" type="date" disabled={!Month} min={min} max={max} onChange={(e) => setDateTo(e.target.value)} value={moment(dateTo).format("YYYY-MM-DD")} name="date"></input>
                        {renderErrorMessage("name")}
                        <label htmlFor="status">Designation</label>
                        <select id="empMode" onChange={(e) => setDesignation(e.target.value)} value={designation}>
                            <option value={""}>ALL</option>
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
                        {/* <label htmlFor="mode">Attendance type</label>
                        <select id="empMode" onChange={(e) => setMode(e.target.value)} value={mode}>
                            <option value="">ALL</option>
                            <option value="1">WFH</option>
                            <option value="2">WFO</option>
                            <option value="3">HYBRID</option>
                            <option value="4">LEAVE</option>
                        </select> */}
                    </div>
                    <div id="buttons">
                        <button id="search_buttom1" type="submit" value="search" onClick={(search)}>SEARCH</button>
                        <button id="search_buttom2" type="reset" value="cancel" onClick={(clear)}>RESET</button>
                        {userData && userData.length > 0 && <button id="exportButton" ref={ref_excel} onClick={exportToExcel}>Export to Excel</button>}
                    </div>
                    {userData && userData.length === 0 &&
                        <div className="recordFound">No record found</div>
                    }
                    {userData && userData.length > 0 &&
                        <MDBDataTable
                            ref={ref_table}
                            scrollX
                            striped
                            bordered
                            data={{
                                columns: [
                                    {
                                        label: 'EmpID',
                                        field: 'EmpID',
                                        sort: 'asc',
                                        width: 90,
                                    },
                                    {
                                        label: 'EMPLOYEE NAME',
                                        field: 'EmpName',
                                        sort: 'asc',
                                        width: 150,
                                    },
                                    {
                                        label: 'DESIGNATION',
                                        field: 'Designation',
                                        sort: 'asc',
                                        width: 200,
                                    },
                                    ...dateRange.flatMap((date) => [
                                        {
                                            label: `${moment(date).format('DD-MMM-YYYY')} Mode`,
                                            field: `${date}.Mode`,
                                            sort: 'asc',
                                            width: 100,
                                        },
                                        {
                                            label: `${moment(date).format('DD-MMM-YYYY')} Status`,
                                            field: `${date}.Status`,
                                            sort: 'asc',
                                            width: 100,
                                        },
                                    ]),
                                ],
                                rows: groupedData.map((group, index) => ({
                                    EmpID: group.EmpID,
                                    EmpName: group.EmpName,
                                    Designation: group.Designation,
                                    ...dateRange.reduce(
                                        (acc, date) => ({
                                            ...acc,
                                            [`${date}.Mode`]: moment(date).day() === 0 ? (group[date] ? group[date].Mode : 'Sun') : (group[date] ? group[date].Mode : 'N/A'),
                                            [`${date}.Status`]: moment(date).day() === 0 ? (group[date] ? group[date].Status : 'Sun') : (group[date] ? group[date].Status : 'N/A'),
                                        }),
                                        {}
                                    ),
                                })),
                            }}
                        />
                    }
                </div>
                <Footer />
            </div >
        </>
    )
}

export default Report
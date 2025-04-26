import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./TranscriptCertificate.css";
import logo from "./assets/bhiblue.png";

const TranscriptCertificate = () => {
  const certificateRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    startDate: "",
    graduationDate: "",
    dateIssued: "",
    totalHours: "0",
    totalGPA: "0",
  });

  const [courses, setCourses] = useState([
    { courseName: "", hours: "", grade: "", gpa: "" },
  ]);

  // Function to update formData totalHours and totalGPA
  const calculateTotals = (updatedCourses) => {
    let totalHours = 0;
    let totalGpaPoints = 0;
    let validCourses = 0;

    updatedCourses.forEach((course) => {
      const hours = parseFloat(course.hours);
      const gpa = parseFloat(course.gpa);

      if (!isNaN(hours)) {
        totalHours += hours;
      }
      if (!isNaN(gpa)) {
        totalGpaPoints += gpa;
        validCourses++;
      }
    });

    const averageGPA =
      validCourses > 0 ? (totalGpaPoints / validCourses).toFixed(2) : "0";

    setFormData((prevData) => ({
      ...prevData,
      totalHours: totalHours.toString(),
      totalGPA: averageGPA,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCourseChange = (index, e) => {
    const { name, value } = e.target;
    const updatedCourses = [...courses];
    updatedCourses[index][name] = value;
    setCourses(updatedCourses);
    calculateTotals(updatedCourses); // Recalculate totals whenever courses change
  };

  const addCourse = () => {
    const updatedCourses = [
      ...courses,
      { courseName: "", hours: "", grade: "", gpa: "" },
    ];
    setCourses(updatedCourses);
    calculateTotals(updatedCourses);
  };

  const downloadPDF = () => {
    const input = certificateRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "a4");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("transcript.pdf");
    });
  };

  return (
    <div className="container">
      <h2>BHI Transcript Certificate Generator</h2>

      {/* Form Section */}
      <div className="form-section">
        <input
          type="text"
          name="name"
          placeholder="Student Name"
          value={formData.name}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Student Address"
          value={formData.address}
          onChange={handleInputChange}
        />
        <label>Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleInputChange}
        />
        <label>End Date</label>
        <input
          type="date"
          name="graduationDate"
          value={formData.graduationDate}
          onChange={handleInputChange}
        />
        <label>Certificate Issue Date</label>
        <input
          type="date"
          name="dateIssued"
          value={formData.dateIssued}
          onChange={handleInputChange}
        />

        {courses.map((course, index) => (
          <div key={index} className="course-inputs">
            <input
              type="text"
              name="courseName"
              placeholder="Course Name"
              value={course.courseName}
              onChange={(e) => handleCourseChange(index, e)}
            />
            <input
              type="text"
              name="hours"
              placeholder="Hours"
              value={course.hours}
              onChange={(e) => handleCourseChange(index, e)}
            />
            <input
              type="text"
              name="grade"
              placeholder="Grade"
              value={course.grade}
              onChange={(e) => handleCourseChange(index, e)}
            />
            <input
              type="text"
              name="gpa"
              placeholder="GPA"
              value={course.gpa}
              onChange={(e) => handleCourseChange(index, e)}
            />
          </div>
        ))}

        <button className="add-course-btn" onClick={addCourse}>
          Add Course
        </button>

        <div className="totals">
          <br />
          <label htmlFor="">Total Hours Calculation</label>
          <input
            type="text"
            name="totalHours"
            placeholder="Total Hours"
            value={formData.totalHours}
            readOnly
          />
          <label htmlFor="">Total GPA Calculation</label>
          <input
            type="text"
            name="totalGPA"
            placeholder="Total GPA"
            value={formData.totalGPA}
            readOnly
          />
        </div>

        <button className="download-btn" onClick={downloadPDF}>
          Download PDF
        </button>
      </div>

      {/* Certificate Preview Section */}
      <div ref={certificateRef} className="certificate-preview">
        <div className="certificate-watermark-text">
          BRIGHT HORIZON <br /> INSTITUTE
        </div>
        <div className="certificate-logo-container">
          <img src={logo} alt="Institute Logo" className="certificate-logo" />
        </div>

        <h1 className="certificate-title">Bright Horizon Institute</h1>
        <p className="certificate-subtitle">
          Official Transcript of Academic Records
        </p>

        {/* Fixed Contact Details */}
        <div className="fixed-details">
          <p>591 Summit Avenue Suite 400, Jersey City, NJ 07306</p>
          <p>Telephone: 973-732-2128 | Fax: 973-255-3900</p>
          <p>Email: training@brighthorizoninstitute.com</p>
          <p>FAX: 973-255-3900</p>
        </div>

        {/* Student Info */}
        <div className="certificate-info">
          <p>
            <strong>Name:</strong> {formData.name || "Student Name"}
          </p>
          <p>
            <strong>Address:</strong> {formData.address || "Student Address"}
          </p>
          <p>
            <strong>School Start Date:</strong>{" "}
            {formData.startDate || "Start Date"}
          </p>
          <p>
            <strong>Graduation Date:</strong>{" "}
            {formData.graduationDate || "Graduation Date"}
          </p>
        </div>

        {/* Courses Table */}
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course</th>
              <th>Hours</th>
              <th>Grade</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course, index) => (
              <tr key={index}>
                <td>{course.courseName || "Course Name"}</td>
                <td>{course.hours || "Hours"}</td>
                <td>{course.grade || "Grade"}</td>
                <td>{course.gpa || "GPA"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Info */}
        <div className="certificate-info">
          <p>
            <strong>Total Hours:</strong> {formData.totalHours || "___"}
          </p>
          <p>
            <strong>Total GPA:</strong> {formData.totalGPA || "___"}
          </p>
        </div>

        {/* Grading Scale Table */}
        <h3>Grading Scale</h3>
        <table className="grading-scale-table">
          <tbody>
            <tr>
              <td>A+ 98 (4.00)</td>
              <td>A 94 (4.00)</td>
              <td>A- 90 (4.00)</td>
              <td>B+ 87 (3.00)</td>
              <td>B 84 (3.00)</td>
              <td>B- 80 (3.00)</td>
              <td rowSpan="2">
                Pass/Fail Courses <br />
                70% Min. Passing Grade
              </td>
            </tr>
            <tr>
              <td>C+ 77 (2.00)</td>
              <td>C 74 (2.00)</td>
              <td>C- 70 (2.00)</td>
              <td>D+ 67 (1.00)</td>
              <td>D 64 (1.00)</td>
              <td>D- 60 (1.00)</td>
            </tr>
          </tbody>
        </table>
        <p>
          This certifies that the information herein is complete and accurate.
        </p>
        {/* Director Info */}
        <div className="director-date-row">
          <div className="signature-block">
            <p>
              <strong>Director:</strong> Zeba Fatima
            </p>
            <div className="signature-line">
              Signature: ________________________
            </div>
          </div>
          <p>
            <strong>Date Issued:</strong> {formData.dateIssued || "Date"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TranscriptCertificate;

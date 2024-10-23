import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    department: "",
    designation: "",
    dob: "",
    profilePicture: null,
  });

  const [errors, setErrors] = useState({});
  const [response, setResponse] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    let validationErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.fullName) {
      validationErrors.fullName = "Full name is required";
    } else if (!/^[A-Za-z\s]+$/.test(formData.fullName)) {
      validationErrors.fullName = "Full name must contain only alphabets";
    }

    if (!formData.email) {
      validationErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      validationErrors.email = "Invalid email format";
    }

    if (!formData.contactNumber) {
      validationErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      validationErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!formData.department) {
      validationErrors.department = "Department is required";
    }

    if (!formData.designation) {
      validationErrors.designation = "Designation is required";
    }

    if (!formData.dob) {
      validationErrors.dob = "Date of birth is required";
    }

    if (!formData.profilePicture) {
      validationErrors.profilePicture = "Profile picture is required";
    }

    return validationErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, profilePicture: e.target.files[0] });
    console.log("hellpe", e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = new FormData();
        console.log("heeeeeeeee", formData.profilePicture.name);
        data.append("fullName", formData.fullName);
        data.append("email", formData.email);
        data.append("contactNumber", formData.contactNumber);
        data.append("department", formData.department);
        data.append("designation", formData.designation);
        data.append("dob", formData.dob);
        data.append("profilePicture", formData.profilePicture);

        const response = await axios.post(
          "http://127.0.0.1:8000/api/employeedetails/",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setResponse(response.data.message);
        navigate("/register");
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">Employee Details Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter full name"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email Address</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Contact Number</label>
          <input
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.contactNumber ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter contact number"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.department ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter department"
          />
          {errors.department && (
            <p className="text-red-500 text-sm mt-1">{errors.department}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={formData.designation}
            onChange={handleChange}
            className={`w-full px-4 py-2 border ${
              errors.designation ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter designation"
          />
          {errors.designation && (
            <p className="text-red-500 text-sm mt-1">{errors.designation}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            max={new Date().toISOString().split("T")[0]}
            className={`w-full px-4 py-2 border ${
              errors.dob ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.dob && (
            <p className="text-red-500 text-sm mt-1">{errors.dob}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            onChange={handleFileChange}
            className={`w-full px-4 py-2 border ${
              errors.profilePicture ? "border-red-500" : "border-gray-300"
            } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {errors.profilePicture && (
            <p className="text-red-500 text-sm mt-1">{errors.profilePicture}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Submit
        </button>

        {response && <p className="text-green-500 mt-4">{response}</p>}
      </form>
    </div>
  );
};

export default EmployeeForm;

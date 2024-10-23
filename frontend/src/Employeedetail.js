import React, { useEffect, useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import Icon from "react-crud-icons";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const fetchEmployees = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/employee");
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/delete/${id}/`);
      setEmployees(employees.filter((employee) => employee.id !== id));
    } catch (error) {
      console.error("Error deleting employee", error);
    }
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handlePrintIDCard = (employee) => {
    console.log("Printing ID Card for:", employee.fullName);
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("Employee ID Card", doc.internal.pageSize.getWidth() / 2, 20, {
      align: "center",
    });
    if (employee.profilePicture) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = `http://localhost:8000${employee.profilePicture}`;
      console.log("Giving the image", img.src);

      img.onload = () => {
        const imgWidth = 50;
        const imgHeight = 50;
        const xPos = (doc.internal.pageSize.getWidth() - imgWidth) / 2;
        const yPos = 30;

        doc.setDrawColor(255, 255, 255);
        doc.roundedRect(
          xPos - 5,
          yPos - 5,
          imgWidth + 10,
          imgHeight + 10,
          5,
          5
        );
        doc.addImage(img, "JPEG", xPos, yPos, imgWidth, imgHeight);

        doc.setFontSize(14);
        doc.text(`Full Name: ${employee.fullName}`, 14, yPos + imgHeight + 10);
        doc.text(
          `Designation: ${employee.designation}`,
          14,
          yPos + imgHeight + 20
        );
        doc.text(
          `Department: ${employee.department}`,
          14,
          yPos + imgHeight + 30
        );

        doc.save(`${employee.fullName}_ID_Card.pdf`);
      };

      img.onerror = () => {
        console.error("Error loading image. Generating PDF without image.");

        doc.setFontSize(14);
        doc.text(`Full Name: ${employee.fullName}`, 14, 40);
        doc.text(`Designation: ${employee.designation}`, 14, 50);
        doc.text(`Department: ${employee.department}`, 14, 60);
        doc.save(`${employee.fullName}_ID_Card.pdf`);
      };
    } else {
      doc.setFontSize(14);
      doc.text(`Full Name: ${employee.fullName}`, 14, 40);
      doc.text(`Designation: ${employee.designation}`, 14, 50);
      doc.text(`Department: ${employee.department}`, 14, 60);
      doc.save(`${employee.fullName}_ID_Card.pdf`);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("fullName", selectedEmployee.fullName);
    formData.append("email", selectedEmployee.email);
    formData.append("contactNumber", selectedEmployee.contactNumber);
    formData.append("department", selectedEmployee.department);
    formData.append("designation", selectedEmployee.designation);
    formData.append("dob", selectedEmployee.dob);

    if (selectedEmployee.profilePicture) {
      formData.append("profilePicture", selectedEmployee.profilePicture);
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/update/${selectedEmployee.id}/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setEmployees(
        employees.map((emp) =>
          emp.id === selectedEmployee.id ? response.data : emp
        )
      );

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating employee", error.response.data);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl mb-4">Employee List</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border px-4 py-2">Employee ID</th>
            <th className="border px-4 py-2">Full Name</th>
            <th className="border px-4 py-2">Email Address</th>
            <th className="border px-4 py-2">Department</th>
            <th className="border px-4 py-2">Designation</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td className="border px-4 py-2">{employee.id}</td>
              <td className="border px-4 py-2">{employee.fullName}</td>
              <td className="border px-4 py-2">{employee.email}</td>
              <td className="border px-4 py-2">{employee.department}</td>
              <td className="border px-4 py-2">{employee.designation}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handlePrintIDCard(employee)}
                  className="bg-blue-500 text-white px-2 py-1 rounded"
                >
                  Print ID Card
                </button>
                <button
                  onClick={() => handleDelete(employee.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                >
                  Delete
                </button>
                <button onClick={() => handleEditClick(employee)}>
                  <Icon
                    name="edit"
                    tooltip="Edit"
                    theme="light"
                    size="medium"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isModalOpen && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl mb-4">Edit Employee</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Full Name:</label>
                <input
                  type="text"
                  value={selectedEmployee?.fullName || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      fullName: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email:</label>
                <input
                  type="email"
                  value={selectedEmployee?.email || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      email: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Contact Number:</label>
                <input
                  type="text"
                  value={selectedEmployee?.contactNumber || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      contactNumber: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Department:</label>
                <input
                  type="text"
                  value={selectedEmployee?.department || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      department: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Designation:</label>
                <input
                  type="text"
                  value={selectedEmployee?.designation || ""}
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      designation: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Profile Picture:</label>
                {selectedEmployee.profilePicture && (
                  <img
                    src={`http://localhost:8000${selectedEmployee.profilePicture}`} 
                    alt="Profile"
                    className="w-24 h-24 object-cover mb-2 rounded"
                  />
                )}
                <input
                  type="file"
                  onChange={(e) =>
                    setSelectedEmployee({
                      ...selectedEmployee,
                      profilePicture: e.target.files[0],
                    })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;

import React from "react";
import EmployeeForm from "./EmployeeForm";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import EmployeeList from "./Employeedetail";

const App = () => {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen flex items-center justify-center">
        <Routes>
          <Route path="/" element={<EmployeeForm />} />

          <Route path="register" element={<EmployeeList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

import React, { useEffect, useState } from "react";
import axios from "../../services/axiosInstance";

const monthsList = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const AddSalary = ({ isOpen, onClose, onSalaryAdded }) => {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    employee: "",
    month: "",
    baseSalary: "",
    bonus: "",
    deductions: "",
    netPay: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      axios.get("/employee/")
        .then(res => setEmployees(res.data.employees))
        .catch(err => console.error("Error fetching employees:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    const base = Number(formData.baseSalary) || 0;
    const bonus = Number(formData.bonus) || 0;
    const deductions = Number(formData.deductions) || 0;
    const netPay = base + bonus - deductions;
    setFormData(prev => ({ ...prev, netPay }));
  }, [formData.baseSalary, formData.bonus, formData.deductions]);

  const getCurrentYear = () => new Date().getFullYear();
  const yearOptions = [getCurrentYear(), getCurrentYear() - 1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { employee, month, baseSalary, bonus, deductions } = formData;

    if (!employee || !month || !baseSalary) {
      setError("Please fill all required fields");
      return;
    }

    try {
      const payload = {
        employee,
        month,
        baseSalary: Number(baseSalary),
        bonus: Number(bonus),
        deductions: Number(deductions)
      };

      await axios.post("/salary/addsalary", payload);
      onSalaryAdded();  // Refresh salary list
      onClose();        // Close modal
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add salary");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-center">Add Salary</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Employee */}
          <div>
            <label className="block text-sm font-medium mb-1">Employee</label>
            <select name="employee" value={formData.employee} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Employee</option>
              {employees.map(emp => (
                <option key={emp._id} value={emp._id}>{emp.name}</option>
              ))}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <select name="month" value={formData.month} onChange={handleChange} className="w-full border rounded p-2">
              <option value="">Select Month</option>
              {yearOptions.map(year =>
                monthsList.map((month, idx) => (
                  <option key={`${month}-${year}`} value={`${year}-${String(idx + 1).padStart(2, "0")}`}>
                    {month} {year}
                  </option>
                ))
              )}
            </select>
          </div>

          {/* Base Salary */}
          <div>
            <label className="block text-sm font-medium mb-1">Base Salary</label>
            <input type="number" name="baseSalary" value={formData.baseSalary} onChange={handleChange} className="w-full border rounded p-2" required />
          </div>

          {/* Bonus */}
          <div>
            <label className="block text-sm font-medium mb-1">Bonus</label>
            <input type="number" name="bonus" value={formData.bonus} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          {/* Deductions */}
          <div>
            <label className="block text-sm font-medium mb-1">Deductions</label>
            <input type="number" name="deductions" value={formData.deductions} onChange={handleChange} className="w-full border rounded p-2" />
          </div>

          {/* Net Pay */}
          <div>
            <label className="block text-sm font-medium mb-1">Net Pay</label>
            <input type="number" value={formData.netPay} disabled className="w-full border rounded p-2 bg-gray-100" />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          {/* Submit */}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add Salary</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSalary;

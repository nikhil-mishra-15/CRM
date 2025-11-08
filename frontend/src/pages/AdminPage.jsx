import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import { getEmployeeStats } from '../lib/admin';
import './AdminPage.css';

export default function AdminPage() {
  const { user } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmployeeStats(true);
    
    // Auto-refresh stats every 10 seconds to show real-time updates
    const interval = setInterval(() => {
      fetchEmployeeStats(false);
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchEmployeeStats = async (showLoading = false) => {
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError(null);
      const stats = await getEmployeeStats();
      setEmployees(stats);
    } catch (err) {
      setError('Failed to fetch employee statistics');
      console.error('Error:', err);
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="admin-page">
      <Header />
      <div className="main-content">
        <div className="content-header">
          <h2 className="content-title">Admin Dashboard</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <p className="admin-welcome">Welcome, {user?.name}!</p>
            <button 
              onClick={() => fetchEmployeeStats(true)}
              className="refresh-button"
              title="Refresh statistics"
            >
              ↻ Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading employee statistics...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        ) : (
          <div className="employees-list-container">
            <div className="employees-table-wrapper">
              <table className="employees-table">
                <thead>
                  <tr>
                    <th>Employee Name</th>
                    <th>No. of calls today</th>
                    <th>Rejected</th>
                    <th>Leads</th>
                    <th>Later List</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="no-employees">
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    employees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="employee-name">{employee.name}</td>
                        <td className="employee-calls">
                          <span className="calls-value">{employee.stats.called}</span>
                        </td>
                        <td className="employee-stat">{employee.stats.rejected}</td>
                        <td className="employee-stat">{employee.stats.leads}</td>
                        <td className="employee-stat">{employee.stats.later}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

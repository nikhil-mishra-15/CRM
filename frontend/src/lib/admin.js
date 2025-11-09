const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'https://backend-al73.onrender.com';

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to get headers with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get employee statistics (Admin only)
export async function getEmployeeStats() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/employees/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch employee statistics');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching employee stats:', error);
    throw error;
  }
}


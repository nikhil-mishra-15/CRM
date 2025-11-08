const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000/api';

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

// Helper function to get headers for file upload (without Content-Type)
const getAuthHeadersForUpload = () => {
  const token = getAuthToken();
  return {
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Get current user profile
export async function getUserProfile() {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      throw new Error('Failed to fetch user profile');
    }
    
    const user = await response.json();
    return {
      ...user,
      id: user._id || user.id
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
}

// Update user profile
export async function updateUserProfile(updates) {
  try {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      // Try to get error message from response
      let errorMessage = 'Failed to update profile';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
        console.error('Backend error:', errorData);
      } catch (e) {
        console.error('Failed to parse error response:', e);
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const updatedUser = await response.json();
    return {
      ...updatedUser,
      id: updatedUser._id || updatedUser.id
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    // Re-throw with more context if it's a network error
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Could not connect to server. Please check if the backend is running.');
    }
    throw error;
  }
}

// Upload profile picture
export async function uploadProfilePicture(file) {
  try {
    const formData = new FormData();
    formData.append('profilePicture', file);
    
    const response = await fetch(`${API_BASE_URL}/users/me/profile-picture`, {
      method: 'POST',
      headers: getAuthHeadersForUpload(),
      body: formData
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        throw new Error('Session expired. Please login again.');
      }
      
      let errorMessage = 'Failed to upload profile picture';
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Server error: ${response.status} ${response.statusText}`;
      }
      
      throw new Error(errorMessage);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
}


import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Edit2, Save, X, Camera, Upload } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile, uploadProfilePicture } from '../lib/user';
import mongodb from '../lib/mongodb';
import Header from '../components/Header';
import './ProfilePage.css';

export default function ProfilePage({ onBack, onProfileClick }) {
  const navigate = useNavigate();
  const { user: authUser, login } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [profileData, setProfileData] = useState({
    phone: '',
    location: '',
    memberSince: ''
  });
  const [contactStats, setContactStats] = useState({
    total: 0,
    activeLeads: 0,
    converted: 0
  });
  const [profilePicture, setProfilePicture] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfileData();
    fetchContactStats();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userData = await getUserProfile();
      setProfileData({
        phone: userData.phone || '',
        location: userData.location || '',
        memberSince: userData.memberSince ? new Date(userData.memberSince).toISOString().split('T')[0] : ''
      });
      if (userData.profilePicture) {
        const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000';
        setProfilePicture(`${API_BASE_URL}${userData.profilePicture}`);
      }
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchContactStats = async () => {
    try {
      const contacts = await mongodb.getContacts();
      const total = contacts.length;
      const activeLeads = contacts.filter(c => c.status === 'lead').length;
      // Converted could be leads that have a follow-up date set, or you can define your own logic
      // For now, let's use contacts with status 'lead' that have a followUpDate
      const converted = contacts.filter(c => c.status === 'lead' && c.followUpDate).length;
      
      setContactStats({
        total,
        activeLeads,
        converted
      });
    } catch (err) {
      console.error('Error fetching contact stats:', err);
      // Don't show error to user, just use defaults
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Redirect admins to admin dashboard, employees to contacts page
      if (authUser?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/contacts');
      }
    }
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    fetchProfileData(); // Reset to original values
    setError('');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare updates - only include fields that have values
      const updates = {};
      if (profileData.phone !== undefined) updates.phone = profileData.phone;
      if (profileData.location !== undefined) updates.location = profileData.location;
      if (profileData.memberSince !== undefined && profileData.memberSince !== '') {
        updates.memberSince = profileData.memberSince;
      }

      console.log('Sending updates:', updates); // Debug log

      const updatedUser = await updateUserProfile(updates);
      
      // Update auth context with new data
      const updatedAuthUser = {
        ...authUser,
        phone: updatedUser.phone,
        location: updatedUser.location,
        memberSince: updatedUser.memberSince
      };
      login(updatedAuthUser, localStorage.getItem('token'));
      
      setIsEditing(false);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      console.error('Error updating profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size must be less than 5MB');
        return;
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPicture = async () => {
    const file = fileInputRef.current?.files[0];
    if (!file) {
      setError('Please select an image file');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const result = await uploadProfilePicture(file);
      
      // Update profile picture URL
      const API_BASE_URL = import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000';
      setProfilePicture(`${API_BASE_URL}${result.profilePicture}`);
      setPreviewImage(null);
      
      // Update auth context
      const updatedAuthUser = {
        ...authUser,
        profilePicture: result.profilePicture
      };
      login(updatedAuthUser, localStorage.getItem('token'));
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (err) {
      setError(err.message || 'Failed to upload profile picture');
      console.error('Error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      // Try camera first, fallback to file picker
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  return (
    <div className="profile-page">
      <Header onProfileClick={handleProfileClick} />
      <button className="back-button" onClick={handleBack}>
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>

      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar-container">
            <div className="profile-avatar">
              {profilePicture || previewImage ? (
                <img 
                  src={previewImage || profilePicture} 
                  alt="Profile" 
                  className="profile-avatar-image"
                />
              ) : (
                <span>{getInitials(authUser?.name)}</span>
              )}
            </div>
            <div className="profile-picture-actions">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                className="upload-picture-button"
                onClick={handleFileInputClick}
                title="Upload photo from device or take with camera"
              >
                <Upload size={18} />
                <span>Upload</span>
              </button>
            </div>
            {previewImage && (
              <button
                className="save-picture-button"
                onClick={handleUploadPicture}
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Save Picture'}
              </button>
            )}
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{authUser?.name || 'User'}</h1>
            <p className="profile-role">{authUser?.role === 'admin' ? 'Administrator' : 'Employee'}</p>
          </div>
        </div>

        <div className="profile-details">
          {error && <div className="profile-error">{error}</div>}

          <div className="profile-section">
            <h3 className="section-title">Contact Information</h3>
            <div className="detail-item">
              <Mail size={18} />
              <div>
                <p className="detail-label">Email</p>
                <p className="detail-value">{authUser?.email || 'N/A'}</p>
              </div>
            </div>
            <div className="detail-item">
              <Phone size={18} />
              <div>
                <p className="detail-label">Phone</p>
                {isEditing ? (
                  <input
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="profile-input"
                    placeholder="Enter phone number"
                  />
                ) : (
                  <p className="detail-value">{profileData.phone || 'Not set'}</p>
                )}
              </div>
            </div>
            <div className="detail-item">
              <MapPin size={18} />
              <div>
                <p className="detail-label">Location</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    className="profile-input"
                    placeholder="Enter location"
                  />
                ) : (
                  <p className="detail-value">{profileData.location || 'Not set'}</p>
                )}
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Account Information</h3>
            <div className="detail-item">
              <Calendar size={18} />
              <div>
                <p className="detail-label">Member Since</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={profileData.memberSince}
                    onChange={(e) => setProfileData({ ...profileData, memberSince: e.target.value })}
                    className="profile-input"
                  />
                ) : (
                  <p className="detail-value">{formatDate(profileData.memberSince)}</p>
                )}
              </div>
            </div>
            <div className="stat-boxes">
              <div className="stat-box">
                <p className="stat-box-value">{contactStats.total}</p>
                <p className="stat-box-label">Total Contacts</p>
              </div>
              <div className="stat-box">
                <p className="stat-box-value">{contactStats.activeLeads}</p>
                <p className="stat-box-label">Active Leads</p>
              </div>
              <div className="stat-box">
                <p className="stat-box-value">{contactStats.converted}</p>
                <p className="stat-box-label">Converted</p>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3 className="section-title">Settings</h3>
            {isEditing ? (
              <div className="edit-actions">
                <button 
                  className="settings-button save" 
                  onClick={handleSave}
                  disabled={loading}
                >
                  <Save size={16} />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
                <button 
                  className="settings-button cancel" 
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <X size={16} />
                  <span>Cancel</span>
                </button>
              </div>
            ) : (
              <button className="settings-button" onClick={handleEdit}>
                <Edit2 size={16} />
                <span>Edit Profile</span>
              </button>
            )}
            <button className="settings-button">Change Password</button>
            <button className="settings-button logout">Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}

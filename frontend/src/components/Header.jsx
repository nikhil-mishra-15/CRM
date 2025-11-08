import { User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header({ onProfileClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          {user && (
            <>
              {user.profilePicture ? (
                <img 
                  src={`${import.meta.env.VITE_MONGODB_API_URL || 'http://localhost:3000'}${user.profilePicture}`}
                  alt={user.name}
                  className="header-profile-picture"
                />
              ) : (
                <span className="header-user-name">{user.name}</span>
              )}
            </>
          )}
        </div>
        <div className="header-right">
          <button className="profile-button" onClick={handleProfileClick}>
            <User size={20} />
            <span>Profile</span>
          </button>
          <button className="logout-button" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}

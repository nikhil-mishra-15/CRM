import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import ContactTable from '../components/ContactTable';
import mongodb from '../lib/mongodb';
import './ContactPage.css';

export default function ContactPage({ onProfileClick }) {
  const navigate = useNavigate();
  
  const handleProfileClick = () => {
    if (onProfileClick) {
      onProfileClick();
    } else {
      navigate('/profile');
    }
  };
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await mongodb.getContacts();
      setContacts(Array.isArray(list) ? list : []);
    } catch (err) {
      setError('Failed to fetch contacts');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const updatedContact = await mongodb.patchContact(id, { status });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, status: updatedContact.status } : contact
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const handleUpdateRemark = async (id, remark) => {
    try {
      const updatedContact = await mongodb.patchContact(id, { remark });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, remark: updatedContact.remark } : contact
      ));
    } catch (err) {
      console.error('Error updating remark:', err);
      setError('Failed to update remark');
    }
  };

  const handleUpdateFollowUpDate = async (id, followUpDate) => {
    try {
      const updatedContact = await mongodb.patchContact(id, { followUpDate });
      setContacts(contacts.map(contact =>
        contact.id === id ? { ...contact, followUpDate: updatedContact.followUpDate } : contact
      ));
    } catch (err) {
      console.error('Error updating follow-up date:', err);
      setError('Failed to update follow-up date');
    }
  };

  const handleUpdateCalled = async (id, called) => {
    try {
      // Optimistically update the UI
      setContacts(prevContacts => prevContacts.map(contact =>
        contact.id === id ? { ...contact, called } : contact
      ));
      
      // Then update in the backend
      const updatedContact = await mongodb.patchContact(id, { called });
      setContacts(prevContacts => prevContacts.map(contact =>
        contact.id === id ? { ...contact, called: updatedContact.called } : contact
      ));
    } catch (err) {
      console.error('Error updating called status:', err);
      setError('Failed to update called status');
      // Revert on error
      setContacts(prevContacts => prevContacts.map(contact =>
        contact.id === id ? { ...contact, called: !called } : contact
      ));
    }
  };

  const getStatusCounts = () => {
    return {
      total: contacts.length,
      future: contacts.filter(c => c.status === 'future').length,
      rejected: contacts.filter(c => c.status === 'rejected').length,
      lead: contacts.filter(c => c.status === 'lead').length,
    };
  };

  const stats = getStatusCounts();

  return (
    <div className="contact-page">
      <Header onProfileClick={handleProfileClick} />
      <div className="main-content">
        <div className="content-header">
          <h2 className="content-title">Contact List</h2>
          <div className="stats-container">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">{stats.total}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Future:</span>
              <span className="stat-value">{stats.future}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Leads:</span>
              <span className="stat-value">{stats.lead}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Rejected:</span>
              <span className="stat-value">{stats.rejected}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p className="loading-text">Loading contacts...</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p className="error-text">{error}</p>
          </div>
        ) : contacts.length === 0 ? (
          <div className="empty-container">
            <p className="empty-text">No contacts found. Add some contacts to get started!</p>
          </div>
        ) : (
          <ContactTable
            contacts={contacts}
            onUpdateStatus={handleUpdateStatus}
            onUpdateRemark={handleUpdateRemark}
            onUpdateFollowUpDate={handleUpdateFollowUpDate}
            onUpdateCalled={handleUpdateCalled}
          />
        )}
      </div>
    </div>
  );
}

import { useState } from 'react';
import { Phone, MessageSquare } from 'lucide-react';
import StatusButton from './StatusButton';
import DatePicker from './DatePicker';
import './ContactTable.css';

export default function ContactTable({ contacts, onUpdateStatus, onUpdateRemark, onUpdateFollowUpDate, onUpdateCalled }) {
  const [editingRemark, setEditingRemark] = useState(null);
  const [remarkValue, setRemarkValue] = useState('');

  const handleRemarkEdit = (contact) => {
    setEditingRemark(contact.id);
    setRemarkValue(contact.remark);
  };

  const handleRemarkSave = (id) => {
    onUpdateRemark(id, remarkValue);
    setEditingRemark(null);
  };

  const handleRemarkCancel = () => {
    setEditingRemark(null);
    setRemarkValue('');
  };

  return (
    <div className="table-container">
      {/* Desktop Table View */}
      <div className="table-wrapper desktop-view">
        <table className="contact-table">
          <thead>
            <tr>
              <th>Called</th>
              <th>Name</th>
              <th>Phone Number</th>
              <th>Remark</th>
              <th>Status</th>
              <th>Follow-up Date</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td>
                  <div className="called-cell" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={contact.called === true}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newValue = e.target.checked;
                        if (onUpdateCalled) {
                          onUpdateCalled(contact.id, newValue);
                        }
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="called-checkbox"
                      title="Mark as called"
                    />
                  </div>
                </td>
                <td>
                  <div className="name-cell">{contact.name}</div>
                </td>
                <td>
                  <div className="phone-cell">
                    <Phone size={14} />
                    <span>{contact.phone}</span>
                  </div>
                </td>
                <td>
                  <div className="remark-cell">
                    {editingRemark === contact.id ? (
                      <div className="remark-edit">
                        <input
                          type="text"
                          value={remarkValue}
                          onChange={(e) => setRemarkValue(e.target.value)}
                          className="remark-input"
                          autoFocus
                        />
                        <div className="remark-actions">
                          <button
                            onClick={() => handleRemarkSave(contact.id)}
                            className="remark-save"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleRemarkCancel}
                            className="remark-cancel"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        className="remark-display"
                        onClick={() => handleRemarkEdit(contact)}
                      >
                        <MessageSquare size={14} />
                        <span>{contact.remark || 'Add remark...'}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td>
                  <StatusButton
                    currentStatus={contact.status}
                    onStatusChange={(status) => onUpdateStatus(contact.id, status)}
                  />
                </td>
                <td>
                  <DatePicker
                    currentDate={contact.followUpDate}
                    onDateChange={(date) => onUpdateFollowUpDate(contact.id, date)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-view">
        {contacts.map((contact) => (
          <div key={contact.id} className="contact-card">
            {/* Row 1: Checkbox, Name, Phone */}
            <div className="contact-card-row-1">
              <div className="contact-card-checkbox">
                <input
                  type="checkbox"
                  checked={contact.called === true}
                  onChange={(e) => {
                    e.stopPropagation();
                    const newValue = e.target.checked;
                    if (onUpdateCalled) {
                      onUpdateCalled(contact.id, newValue);
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="called-checkbox"
                  title="Mark as called"
                />
              </div>
              <div className="contact-card-name">{contact.name}</div>
              <div className="contact-card-phone">
                <Phone size={14} />
                <span>{contact.phone}</span>
              </div>
            </div>
            
            {/* Row 2: Remark, Status, Follow-up Date */}
            <div className="contact-card-row-2">
              <div className="contact-card-remark">
                {editingRemark === contact.id ? (
                  <div className="remark-edit">
                    <input
                      type="text"
                      value={remarkValue}
                      onChange={(e) => setRemarkValue(e.target.value)}
                      className="remark-input"
                      autoFocus
                    />
                    <div className="remark-actions">
                      <button
                        onClick={() => handleRemarkSave(contact.id)}
                        className="remark-save"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleRemarkCancel}
                        className="remark-cancel"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    className="remark-display"
                    onClick={() => handleRemarkEdit(contact)}
                  >
                    <MessageSquare size={14} />
                    <span>{contact.remark || 'Add remark...'}</span>
                  </div>
                )}
              </div>
              <div className="contact-card-status">
                <StatusButton
                  currentStatus={contact.status}
                  onStatusChange={(status) => onUpdateStatus(contact.id, status)}
                />
              </div>
              <div className="contact-card-date">
                <DatePicker
                  currentDate={contact.followUpDate}
                  onDateChange={(date) => onUpdateFollowUpDate(contact.id, date)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

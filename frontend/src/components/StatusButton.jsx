import { useState, useRef, useEffect } from 'react';
import { Circle } from 'lucide-react';
import './StatusButton.css';

export default function StatusButton({ currentStatus, onStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const statusConfig = {
    future: { label: 'Future', color: '#FF8C00', bgColor: '#FFF4E6' },
    rejected: { label: 'Rejected', color: '#DC2626', bgColor: '#FEE2E2' },
    lead: { label: 'Lead', color: '#16A34A', bgColor: '#DCFCE7' }
  };

  const handleStatusSelect = (status) => {
    onStatusChange(status);
    setIsOpen(false);
  };

  return (
    <div className="status-dropdown" ref={dropdownRef}>
      <button
        className="status-button"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          backgroundColor: statusConfig[currentStatus].bgColor,
          borderColor: statusConfig[currentStatus].color
        }}
      >
        <Circle
          size={12}
          fill={statusConfig[currentStatus].color}
          color={statusConfig[currentStatus].color}
        />
        <span style={{ color: statusConfig[currentStatus].color }}>
          {statusConfig[currentStatus].label}
        </span>
      </button>

      {isOpen && (
        <div className="status-dropdown-menu">
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              className="status-dropdown-item"
              onClick={() => handleStatusSelect(key)}
            >
              <Circle size={12} fill={config.color} color={config.color} />
              <span>{config.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import './DatePicker.css';

export default function DatePicker({ currentDate, onDateChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Convert date to YYYY-MM-DD format for input
  const formatDateForInput = (date) => {
    if (!date) return '';
    const dateObj = date instanceof Date ? date : new Date(date);
    if (isNaN(dateObj.getTime())) return '';
    return dateObj.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(formatDateForInput(currentDate));

  useEffect(() => {
    setSelectedDate(formatDateForInput(currentDate));
  }, [currentDate]);

  useEffect(() => {
    function handleClickOutside(event) {
      // Don't close if the date input is still focused (user is navigating calendar)
      if (inputRef.current && document.activeElement === inputRef.current) {
        return;
      }

      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Don't close if clicking on native date picker elements
        // The native calendar popup renders outside our component
        const target = event.target;
        const isNativeDatePicker = 
          target.tagName === 'SELECT' || 
          target.closest('select') ||
          target.type === 'date' ||
          target.closest('input[type="date"]') ||
          // Check for native calendar popup elements (browser-specific)
          target.closest('[role="dialog"]') ||
          target.closest('.ui-datepicker') ||
          target.classList.contains('ui-datepicker');
        
        if (!isNativeDatePicker) {
          // Small delay to allow native calendar interactions
          setTimeout(() => {
            // Double-check that input is not focused before closing
            if (inputRef.current && document.activeElement !== inputRef.current) {
              setIsOpen(false);
            }
          }, 100);
        }
      }
    }

    if (isOpen) {
      // Delay to prevent immediate closing when opening
      const timeoutId = setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside, true);
      }, 200);

      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside, true);
      };
    }
  }, [isOpen]);

  const formatDateForDisplay = (dateString) => {
    if (!dateString) return 'Select date...';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Select date...';
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    // Update the date but don't close - let user navigate months/years
    // The date will be saved when user clicks "Done"
  };

  const handleDateKeyDown = (e) => {
    // Close on Escape key
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    // Save and close on Enter key
    if (e.key === 'Enter') {
      onDateChange(selectedDate || null);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    setSelectedDate('');
    onDateChange(null);
    setIsOpen(false);
  };

  const getTodayDateString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getMaxDateString = () => {
    // Set max date to December 31, 2040
    const maxDate = new Date(2040, 11, 31); // Month is 0-indexed, so 11 = December
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="date-picker" ref={dropdownRef}>
      <button
        type="button"
        className="date-picker-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Calendar size={14} />
        <span>{formatDateForDisplay(selectedDate)}</span>
      </button>

      {isOpen && (
        <div className="date-picker-menu">
          <input
            ref={inputRef}
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            onKeyDown={handleDateKeyDown}
            className="date-picker-input"
            min={getTodayDateString()}
            max={getMaxDateString()}
            autoFocus
            onClick={(e) => {
              e.stopPropagation();
              // Force a small delay to help with rendering
              setTimeout(() => {
                if (inputRef.current) {
                  inputRef.current.focus();
                }
              }, 10);
            }}
          />
          <div className="date-picker-actions">
            {selectedDate && (
              <button
                type="button"
                className="date-picker-clear"
                onClick={handleClear}
              >
                Clear
              </button>
            )}
            <button
              type="button"
              className="date-picker-done"
              onClick={() => {
                onDateChange(selectedDate || null);
                setIsOpen(false);
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


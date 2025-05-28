import React, { useContext, useState } from 'react';
import './Availability.css';
import { StoreContext } from '../../context/StoreContext';

const Availability = () => {
  const { token } = useContext(StoreContext);

  const timeSlots = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM'];

  const generateInitialAvailability = () => {
    const tables = [];
    for (let i = 1; i <= 10; i++) {
      tables.push({
        tableNumber: i,
        slots: timeSlots.map(time => ({ time, isAvailable: true }))
      });
    }
    return tables;
  };

  const [tablesAvailability, setTablesAvailability] = useState(generateInitialAvailability());

  const handleToggleAvailability = (tableIndex, slotIndex) => {
    const updated = [...tablesAvailability];
    updated[tableIndex].slots[slotIndex].isAvailable = !updated[tableIndex].slots[slotIndex].isAvailable;
    setTablesAvailability(updated);
    // TODO: Sync with backend
  };

  const handleReserve = (tableIndex, slotIndex) => {
    alert(`Reserved Table ${tablesAvailability[tableIndex].tableNumber} at ${tablesAvailability[tableIndex].slots[slotIndex].time}`);
    // TODO: Call backend to reserve
  };

  const isAdmin = token && token === "admin-token"; // 🔐 Replace with real role check

  return (
    <div className="availability-page">
      <h2>Table Availability</h2>
      <div className="tables-container">
        {tablesAvailability.map((table, tableIndex) => (
          <div key={tableIndex} className="table-section">
            <h3>Table {table.tableNumber}</h3>
            <div className="slots-container">
              {table.slots.map((slot, slotIndex) => (
                <div key={slotIndex} className={`slot ${slot.isAvailable ? 'available' : 'unavailable'}`}>
                  <span>{slot.time}</span>
                  {isAdmin ? (
                    <button onClick={() => handleToggleAvailability(tableIndex, slotIndex)}>
                      {slot.isAvailable ? 'Disable' : 'Enable'}
                    </button>
                  ) : (
                    <button disabled={!slot.isAvailable} onClick={() => handleReserve(tableIndex, slotIndex)}>
                      {slot.isAvailable ? 'Reserve' : 'Unavailable'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Availability;

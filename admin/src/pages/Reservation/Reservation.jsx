import React, { useEffect, useState } from 'react';
import './Reservation.css';

const Reservation = ({ url }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch(`${url}/api/availability`);
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, [url]);

  return (
    <div className="reservation-container">
      <h2>Table Reservations</h2>
      <div className="reservation-list">
        {reservations.length === 0 ? (
          <p>No reservations found.</p>
        ) : (
          reservations.map((reservation, index) => (
            <div key={index} className="reservation-card">
              <h3>Table #{reservation.tableNumber}</h3>
              <p>Date: {reservation.date}</p>
              <ul>
                {reservation.slots.map((slot, idx) => (
                  <li key={idx}>
                    {slot.time} - {slot.isAvailable ? 'Available' : 'Reserved'}
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Reservation;

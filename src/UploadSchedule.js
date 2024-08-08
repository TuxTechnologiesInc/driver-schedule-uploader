// src/UploadSchedule.js
import React, { useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyBD__09hW4pjR2saUqZAyH9nyNlrPcwYAQ",
  authDomain: "tuxdev-a23d9.firebaseapp.com",
  projectId: "tuxdev-a23d9",
  storageBucket: "tuxdev-a23d9.appspot.com",
  messagingSenderId: "392547723678",
  appId: "1:392547723678:web:b3d0623597975b7c580e8f",
  measurementId: "G-JJG2GED2EK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

function UploadSchedule() {
  const [drivers, setDrivers] = useState([]);

  // Example function to update driver availability
  const updateDriverAvailability = () => {
    const updates = {};
    drivers.forEach((driver) => {
      updates[`drivers/${driver.driver}`] = driver.availability;
    });

    update(ref(db), updates)
      .then(() => {
        console.log('Database updated successfully');
      })
      .catch((error) => {
        console.error('Error updating database:', error);
      });
  };

  // Example useEffect to fetch drivers or set initial state
  useEffect(() => {
    // Fetch drivers or set initial state here
    // setDrivers([...]); // Example: setDrivers([{ driver: 'John', availability: true }, ...]);
  }, []);

  return (
    <div>
      <h1>Upload Schedule</h1>
      {/* Your component UI here */}
      <button onClick={updateDriverAvailability}>Update Availability</button>
    </div>
  );
}

export default UploadSchedule;

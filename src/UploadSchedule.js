// src/UploadSchedule.js
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import firebase from 'firebase/app';
import 'firebase/database'; // or 'firebase/firestore' if you prefer Firestore

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase configuration
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const UploadSchedule = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const drivers = parseData(jsonData);
      uploadToFirebase(drivers);
    };
    reader.readAsArrayBuffer(file);
  };

  const parseData = (data) => {
    const headers = data[0].slice(1); // Skip the first column (Driver names)
    const drivers = [];

    for (let i = 1; i < data.length; i++) {
      const driverName = data[i][0];
      const availability = {};

      headers.forEach((day, index) => {
        availability[day] = data[i][index + 1] === 'x'; // Check if available
      });

      drivers.push({ driver: driverName, availability });
    }

    return drivers;
  };

  const uploadToFirebase = (drivers) => {
    const db = firebase.database();
    const updates = {};

    drivers.forEach((driver) => {
      updates[`drivers/${driver.driver}`] = driver.availability;
    });

    db.ref().update(updates)
      .then(() => {
        alert('Data uploaded successfully!');
      })
      .catch((error) => {
        console.error('Error uploading data:', error);
      });
  };

  return (
    <div>
      <h1>Upload Driver Schedule</h1>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadSchedule; 

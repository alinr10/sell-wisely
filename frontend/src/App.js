import "./styles/reset.scss";
import "./styles/styles.scss";
import "./styles/responsive.scss";


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import Homepage from './pages/homepage/homepage';



function App() {
  const navigate = useNavigate();




  //const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Kullanıcının ID'sini saklamak için

  const [isLoggedIn, setIsLoggedIn] = useState(null);

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const storedUserToken = localStorage.getItem('userToken');
        const expirationTime = localStorage.getItem('tokenExpiration');

        const currentTime = new Date().getTime();

        if (storedUserToken && expirationTime && currentTime < expirationTime) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
          localStorage.removeItem('userToken');
          localStorage.removeItem('tokenExpiration');
        }
      } catch (error) {
        console.error('Oturum kontrol hatası:', error);
        setIsLoggedIn(false);
      }
    };

    checkUserToken();
  }, [navigate]);

  if (isLoggedIn === null) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Homepage />} />

      {/* <Route path="/order" element={isLoggedIn ? <Food /> : <Navigate to="/" />} />
      <Route path="/personalized" element={isLoggedIn ? <Personalized /> : <Navigate to="/" />} />
      <Route path="/my-orders" element={isLoggedIn ? <Myorder /> : <Navigate to="/" />} /> */}


    </Routes>
  );
}

export default App;

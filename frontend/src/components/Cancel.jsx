import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/Cancel.css'; // Importing the CSS file

const Cancel = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/'); // Redirects to the home page
  };

  return (
    <div className="cancel-container">
      <h1 className="cancel-header">Subscription Canceled</h1>
      <p className="cancel-message">
        Your subscription has been canceled. If you have any questions, feel free to contact our support team.
      </p>
      <button className="go-home-button" onClick={handleGoHome}>
        Go Home
      </button>
    </div>
  );
};

export default Cancel;

import React from 'react';
import '../components/Success.css';

const Success = () => {
  const sessionId = localStorage.getItem("sessionid"); // Replace with the actual session ID

  const handleGenerateInvoice = async () => {
    try {
      const response = await fetch('https://wh7qgkozi1.execute-api.ap-south-1.amazonaws.com/prod/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      const data = await response.json(); 
      console.log(data);

      if (response.ok) {
        alert('Invoice generated successfully!');
        window.open(data.hostedUrl, '_blank'); // Open the finalized invoice in a new tab
      } else {
        alert(`Failed to generate invoice: ${data.error}`);
      }
    } catch (error) {
      console.error('Error generating invoice:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="success-container">
      <h1 className="success-header">Payment Successful!</h1>
      <p className="success-message">
        Thank you for your payment! Your transaction has been completed successfully.
      </p>
      <button className="invoice-button" onClick={handleGenerateInvoice}>
        Generate Invoice
      </button>
    </div>
  );
};

export default Success;

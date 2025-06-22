/*global payhere*/ 
import React, { useEffect } from "react";

interface PaymentButtonProps {
  name: string;
  value: string;
  itemname: string;
  onSubmit?: () => void;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({ name, value, itemname, onSubmit }) => {

     useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://www.payhere.lk/lib/payhere.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
  
  const handlePayment = async () => {
    const paymentDetails = {
      order_id: "ItemNo12345",
      amount: value,
      currency: "LKR",
      first_name: "Saman",
      last_name: "Perera",
      email: "samanp@gmail.com",
      phone: "0771234567",
      address: "No.1, Galle Road",
      city: "Colombo",
      country: "Sri Lanka",
    };

    try {
      // Request backend to generate the hash value
      const response = await fetch(
        "http://localhost:8000/auth/start",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (response.ok) {
        const { hash, merchant_id } = await response.json();

        // Payment configuration
        const payment = {
          sandbox: true, // Use sandbox for testing
          merchant_id: merchant_id,
          return_url: "http://localhost:5173/auth/success", // Replace with your return URL
          cancel_url: "http://localhost:5173/auth/cancel", // Replace with your cancel URL
          notify_url:
            "https://sea-lion-app-qfh5d.ondigitalocean.app/notify", // Replace with your notify URL - This should be public IP (No Localhost)
          order_id: paymentDetails.order_id,
          items: itemname,
          amount: paymentDetails.amount,
          currency: paymentDetails.currency,
          first_name: paymentDetails.first_name,
          last_name: paymentDetails.last_name,
          email: paymentDetails.email,
          phone: paymentDetails.phone,
          address: paymentDetails.address,
          city: paymentDetails.city,
          country: paymentDetails.country,
          hash: hash,
        };
        onSubmit && onSubmit();
        // Initialize PayHere payment
        payhere.startPayment(payment);
        
      } else {
        console.error("Failed to generate hash for payment.");
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <button id="payhere-payment" onClick={handlePayment}
                style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#205781",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}>
        {name}
      </button>
    </div>
  );
};

export default PaymentButton;

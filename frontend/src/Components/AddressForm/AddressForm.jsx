// AddressForm.js
import React, { useState } from 'react';
import './AddressForm.css'; // Optional: Add styles for the form

const AddressForm = ({ address, setAddress, onSubmit,closeAddressForm }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

 

  return (
    <div className="Address">

      <button className="close-btn" onClick={closeAddressForm}>X</button>
     

    <form className="address-form" onSubmit={onSubmit}>
      <h3>Shipping Address</h3>
      <div >
        <label htmlFor="address1">Address 1: </label>
        <input
          type="text"
          id="address1"
          name="address1"
          value={address.address1}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="address2">Address 2: </label>
        <input
          type="text"
          id="address2"
          name="address2"
          value={address.address2}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="city">City: </label>
        <input
          type="text"
          id="city"
          name="city"
          value={address.city}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="state">State: </label>
        <input
          type="text"
          id="state"
          name="state"
          value={address.state}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="country">Country: </label>
        <input
          type="text"
          id="country"
          name="country"
          value={address.country}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label htmlFor="postalCode">Postal Code: </label>
        <input
          type="text"
          id="postalCode"
          name="postalCode"
          value={address.postalCode}
          onChange={handleChange}
          required
        />
      </div>
      <button className="address-form-submit" type="submit">Submit Address</button>
    </form>
    </div>
  );
};

export default AddressForm;


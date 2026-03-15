import React from 'react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">
        <h1>LEVEL UP</h1>
        <span>APPAREL</span>
      </div>
      <ul className="nav-links">
        <li className="active">SHOP</li>
        <li>COLLECTIONS</li>
        <li>NEW DROPS</li>
        <li>COMMUNITY</li>
      </ul>
      <div className="nav-actions">
        <button className="account-btn">ACCOUNT</button>
        <button className="cart-btn">🛒 CART (3)</button>
      </div>
    </nav>
  );
}
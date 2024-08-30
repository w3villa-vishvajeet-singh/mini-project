"use client";
import Link from "next/link";
import "../mobile_number_verify/page.css";
import { useState } from "react";
import axios from 'axios';
import { useRouter } from "next/navigation";

const PhoneInput = () => {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const handleCountrySelect = (ext) => {
    setCountryCode(ext);
    setPhoneNumber("");
  };

  const handlePhoneNumberChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make API call to send OTP
      const response = await axios.post("http://localhost:8001/api/mobile_verify", {
        phoneNumber: `91${phoneNumber}`, // Ensure the phone number includes country code
      });

      if (response.status === 200) {
        // Redirect to OTP verification page
        router.push("/otp_verify");
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error during OTP generation:", error);
    }
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container">
          <Link href="/" className="navbar-brand">
            Vishvajeet
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={isOpen ? "true" : "false"}
            aria-label="Toggle navigation"
            onClick={toggleNavbar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}
            id="navbarNav"
          >
            <ul className="navbar-nav ms-auto">
              <li
                className={`nav-item ${
                  router.pathname == "/" ? "active" : ""
                }`}
              >
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li
                className={`nav-item ${
                  router.pathname == "/about" ? "active" : ""
                }`}
              >
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
              <li
                className={`nav-item ${
                  router.pathname == "/services" ? "active" : ""
                }`}
              >
                <Link href="/services" className="nav-link">
                  Services
                </Link>
              </li>
              <li
                className={`nav-item ${
                  router.pathname == "/contact" ? "active" : ""
                }`}
              >
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="country_box">
        <div className="">
          <div className="text">
            <h1>Verify Your Mobile Number</h1>
          </div>

          <form className="input-group mb-3 border box" onSubmit={handleSubmit}>
            <div className="items">
              <button
                className="countryNumber"
                type="button"
                onClick={() => handleCountrySelect("+91")}
              >
                🇮🇳 India
              </button>

              <span className="input-group-text">{countryCode}</span>
              <input
                type="text" // Use text instead of number to accommodate country code and mobile number
                required
                placeholder="Enter a valid mobile number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
              />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PhoneInput;

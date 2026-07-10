// import React, { useState } from "react";
// import Navbar from "../components/Navbar";

// export default function ForgotPassword() {
//   const [email, setEmail] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert("Password reset link sent to email (dummy function).");
//   };

//   return (
//     <>
//       <Navbar />

//       <div className="container mt-5" style={{ maxWidth: "450px" }}>
//         <h2 className="text-center fw-bold mb-4">Reset Password</h2>

//         <form className="shadow p-4 rounded" onSubmit={handleSubmit}>
//           <div className="mb-3">
//             <label>Enter your Email</label>
//             <input
//               type="email"
//               className="form-control"
//               required
//               onChange={(e) => setEmail(e.target.value)}
//             />
//           </div>

//           <button className="btn btn-warning w-100">Send Reset Link</button>
//         </form>
//       </div>
//     </>
//   );
// }


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isEmailOpen, setIsEmailOpen] = useState(true);
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "otp") setOtp(value);
    if (name === "password") setPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  }

  const VerifySendOTP = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email ID is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "This Email ID is invalid"
    }
  }

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const name = e.target.name;
      if (name === "send-otp") {
        await axios.post("http://localhost:5000/api/send-otp", {
          email: email
        }).then(res => {
          const message = res.data?.message;
          if (message === "SENT") {
            alert("OPT sent successfully!");
            setIsEmailOpen(false);
            setIsOtpOpen(true);
            setOtp("");
            setIsPasswordOpen(false);
            setPassword("");
            setConfirmPassword("");
          }
          if (message === "NOUSER") {
            alert("No account is registered with this Email ID.");
          }
          if (message === "ERROR") {
            alert("Server error.");
          }
        }).catch(err => {
          console.error(err);
        });
      }
      if (name === "verify-otp") {
        await axios.post("http://localhost:5000/api/verify-otp", {
          email: email,
          otp: otp
        }).then(res => {
          const message = res.data?.message;
          if (message === "ENF") {
            alert("No Email ID given.");
          }
          if (message === "VERIFIED") {
            alert("OTP Verified successfully!");
            setIsEmailOpen(false);
            setIsOtpOpen(false);
            setOtp("");
            setIsPasswordOpen(true);
            setPassword("");
            setConfirmPassword("");
          }
          if (message === "INVALID") {
            alert("Invalid OTP, try again");
            setOtp("");
          }
          if (message === "NOUSER") {
            alert("No account is registered with this Email ID.");
          }
          if (message === "ERROR") {
            alert("Server error.");
          }
        }).catch(err => {
          console.error(err);
        });
      }
      if (name === "change-password") {
        if (confirmPassword.trim() !== password.trim()) {
          alert("Password does not match");
        }
        if (password.trim().length < 6) {
          alert("Password must be minimum 6 characters");
        }
        if (confirmPassword.trim() === password.trim() && password.trim().length >= 6) {
          await axios.put("http://localhost:5000/api/change-password", {
            email: email,
            new_password: password
          }).then(res => {
            const message = res.data?.message;
            if (message === "SUCCESS") {
              alert("Password updated successfully!");
              setIsEmailOpen(true);
              setEmail("");
              setIsOtpOpen(false);
              setOtp("");
              setIsPasswordOpen(false);
              setPassword("");
              setConfirmPassword("");
            }
            if (message === "NOUSER") {
              alert("No account is registered with this Email ID.");
            }
            if (message === "SAME") {
              alert("New password must not be old password");
            }
            if (message === "ERROR") {
              alert("Server error.");
            }
          }).catch(err => {
            console.error(err);
          });
        }
      }
    }
    catch (err) {
      console.error(err);
      alert(err);
    }
  };

  return (
    <div className="page forms-page">
      <h2>📊 Geo Tagging Pothole on Roads Within City</h2>
      <form
        name={`${isEmailOpen ? "send-otp" : ""}${isOtpOpen ? "verify-otp" : ""}${isPasswordOpen ? "change-password" : ""}`}
        className="custom-form"
        onSubmit={handleSubmit}
      >
        <div className="heading">
          <h3>
            {isEmailOpen ? "Forgot Password" : ""}
            {isOtpOpen ? "Verify OTP" : ""}
            {isPasswordOpen ? "Set new Password" : ""}
          </h3>
        </div>
        {isEmailOpen && <div className="input-field">
          <p>Enter your Email ID</p>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleChange}
            placeholder="name@company.com"
            required
          />
        </div>}
        {isOtpOpen && <div className="input-field">
          <p>Type the recieved OTP</p>
          <input
            type="number"
            name="otp"
            value={otp}
            onChange={handleChange}
            placeholder="Ex. 1234"
            required
          />
        </div>}
        {isPasswordOpen && <div className="input-field">
          <p>Enter new password</p>
          <input
            type="password"
            name="password"
            value={password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>}
        {isPasswordOpen && <div className="input-field">
          <p>Confirm new password</p>
          <input
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />
        </div>}
        <button
          type="submit"
          className={`submit-btn ${(isEmailOpen || isOtpOpen) ? "width-fit" : ""}`}
          style={{
            textWrap: (isEmailOpen || isOtpOpen) && "nowrap"
          }}
        >
          {isEmailOpen ? "Send OTP" : ""}
          {isOtpOpen ? "Verify OTP" : ""}
          {isPasswordOpen ? "Switch to new password" : ""}
        </button>
      </form>
    </div>
  );
}

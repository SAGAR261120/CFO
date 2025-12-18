import React, { useState } from "react";
import logo from "../../assets/images/CFO.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [step, setStep] = useState("login"); // login, signup, forgot
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  // DEMO CREDENTIALS
  const DEMO_EMAIL = "demo@cfo.com";
  const DEMO_PASSWORD = "123456";

  // ------------------ DEMO LOGIN (NO API) ------------------
  const handleLogin = (e) => {
    e.preventDefault();

    if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
      alert("Demo Login Successful!");

      if (rememberMe) {
        localStorage.setItem("demo_token", "123_demo_token");
      }

      navigate("/dashboard");
    } else {
      alert("Incorrect Email or Password (Use demo@cfo.com / 123456)");
    }
  };

  // ------------------ DEMO SIGNUP ------------------
  const handleSignup = (e) => {
    e.preventDefault();

    alert("Demo Account Created Successfully!");
    setStep("login");
  };

  // ------------------ DEMO FORGOT PASSWORD ------------------
  const handleForgotPassword = (e) => {
    e.preventDefault();

    alert("Demo password reset link sent!");
    setStep("login");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#f4f6fb",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "450px",
          background: "#fff",
          borderRadius: "16px",
          padding: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        {/* LOGO AND TITLE */}
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <img
            src={logo}
            alt="Logo"
            style={{
              width: "120px",
              height: "120px",
              objectFit: "contain",
              marginBottom: "0px",
            }}
          />
          <h2
            style={{
              fontSize: "24px",
              fontFamily: "'Playfair Display', serif",
              fontWeight: "bold",
              marginTop: "5px",
            }}
          >
            CFO Dashboard (Demo)
          </h2>
        </div>

        {/* ------------------ LOGIN FORM ------------------ */}
        {step === "login" && (
          <form onSubmit={handleLogin}>
            <p
              style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}
            >
              Login to continue (Demo)
            </p>

            <label>Email</label>
            <input
              type="email"
              placeholder="demo@cfo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label>Password</label>
            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            {/* Remember Me */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "15px",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ marginRight: "8px" }}
                />
                <label>Remember Me</label>
              </div>

              <p
                style={{ cursor: "pointer" }}
                onClick={() => setStep("forgot")}
              >
                Forgot Password?
              </p>
            </div>

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#000315",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                marginBottom: "10px",
              }}
            >
              Login
            </button>

            <p
              style={{
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setStep("signup")}
            >
              Create a New Demo Account
            </p>
          </form>
        )}

        {/* ------------------ SIGNUP FORM ------------------ */}
        {step === "signup" && (
          <form onSubmit={handleSignup}>
            <p
              style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}
            >
              Create Demo Account
            </p>

            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label>Mobile No</label>
            <input
              type="text"
              placeholder="Enter Mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <label>Gender</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              required
              style={{
                width: "99.5%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            >
              <option value="">Select</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>

            <label>Password</label>
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#000315",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Create Demo Account
            </button>

            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setStep("login")}
            >
              Back to Login
            </p>
          </form>
        )}

        {/* ------------------ FORGOT PASSWORD FORM ------------------ */}
        {step === "forgot" && (
          <form onSubmit={handleForgotPassword}>
            <p
              style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}
            >
              Reset Demo Password
            </p>

            <label>Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: "95%",
                padding: "10px",
                marginBottom: "15px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                background: "#000315",
                color: "white",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Send Reset Link
            </button>

            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                cursor: "pointer",
              }}
              onClick={() => setStep("login")}
            >
              Back to Login
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;

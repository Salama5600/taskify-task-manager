// Signup component for user registration
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

// Main signup component function
function Signup() {
  // State variables for form inputs and validation
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  // State variable to store all users
  const [users, setUsers] = useState([]);

  // Navigation hook
  const navigate = useNavigate();

  // Fetch all users from the database when the component mounts
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((data) => data.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  // Handle form submission
  function handleSubmit(e) {
    e.preventDefault();

    // Initialize validation errors
    const newErrors = {};

    // Validate name
    if (name.length <= 3) {
      newErrors.name = "please enter your full name";
    }

    // Validate email
    if (!emailValidation(email)) {
      newErrors.email = "please enter a valid email";
    }

    // Validate password
    if (password.length < 6) {
      newErrors.password = "password length must be at least 6 chars";
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "password dose not match";
    }

    // Check if email already exists
    if (users.find((user) => user.email === email)) {
      newErrors.email = "email already exists";
    }

    // Update errors state
    setErrors(newErrors);

    // If no validation errors, proceed with registration
    if (Object.keys(newErrors).length === 0) {
      // Create new user object
      const user = {
        name,
        email,
        password,
        tasks: [],
      };

      // Send POST request to create new user
      axios.post("http://localhost:8000/users", user).then(() => {
        // Redirect to login page
        navigate("/LogIn");
      });
    }
  }

  // Email validation function
  function emailValidation(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  return (
    <div>
      <div className="Sign-up-header container">
        <h3>Taskify</h3>
        <div className="header-links">
          <Link to="/LogIn">Sign In</Link>
        </div>
      </div>
      <div className="Sign-up-form">
        <h2>create your account</h2>
        <form onSubmit={handleSubmit}>
          {/* Name input */}
          <input
            type="text"
            placeholder="Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

          {/* Email input */}
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

          {/* Password input */}
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

          {/* Password confirmation */}
          <input
            type="password"
            placeholder="Confirm Password"
            onChange={(e) => {
              setConfirmPassword(e.target.value);
            }}
          />
          {errors.confirmPassword && (
            <p style={{ color: "red" }}>{errors.confirmPassword}</p>
          )}

          {/* Submit button and login link */}
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <Link to="/LogIn">Sign In</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Signup;

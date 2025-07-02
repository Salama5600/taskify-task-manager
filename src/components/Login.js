// Login component for user authentication
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../context/userContext";

// Main login component function
function LogIn(params) {
  // State variables for form inputs and validation
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});

  // Navigation and context hooks
  const navigate = useNavigate();
  const { setCurrentUser } = useContext(UserContext);

  // Effect to fetch users from backend
  useEffect(() => {
    fetch("http://localhost:8000/users")
      .then((data) => data.json())
      .then((data) => {
        console.log(data);
        setUsers(data);
      });
  }, []);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Initialize validation errors
    let newErrors = {};

    // Validate email
    if (email.trim() === "") {
      newErrors.email = "Email is required";
    }

    // Validate password
    if (password.trim() === "") {
      newErrors.password = "Password is required";
    }

    // Update errors state
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Find matching user
    const user = users.find((u) => {
      return u.email === email;
    });

    // Handle successful login
    if (user && user.password === password) {
      setCurrentUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      navigate("/Home/Overview");
    } else if (user && user.password !== password) {
      newErrors.password = "Password is incorrect";
    } else if (!user) {
      newErrors.email = "User not found";
    }

    setErrors(newErrors);
    console.log(errors);
  }

  return (
    <div className="logIn container">
      <div className="header">
        <h3>Taskify</h3>
      </div>
      <h2>Welcome back</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        <div className="remember">
          <p>remember me</p> <input type="checkbox" className="remember-input"/>
        </div>
        <button type="submit">Log In</button>
        <p>Don't have an account? <Link to="/">Sign up</Link></p>
      </form>
    </div>
  );
}

export default LogIn;

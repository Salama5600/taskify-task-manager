// Import necessary components and libraries
import { BrowserRouter } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Home from "./components/Home";
import Overview from "./components/Overview";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/userContext";

// Main application component that sets up routing and context
function App() {
  return (
    // UserProvider wraps the entire app to provide user data
    <UserProvider>
      {/* BrowserRouter sets up client-side routing */}
      <BrowserRouter>
        <div className="App">
          {/* Routes configuration */}
          <Routes>
            {/* Signup page route */}
            <Route path="/" element={<Signup />} />
            {/* Login page route */}
            <Route path="/LogIn" element={<Login />} />
            {/* Home page route with nested Overview route */}
            <Route path="/Home" element={<Home />}>
              {/* Overview page route */}
              <Route path="Overview" element={<Overview />} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

// User context for managing user authentication and data
import { createContext, useState, useEffect } from "react";

// Create UserContext
export const UserContext = createContext();

// UserContextProvider component
export function UserProvider({ children }) {
  // State to store current user data
  const [currentUser, setCurrentUser] = useState(null);

  // Effect to load and sync user data
  useEffect(() => {
    // Get stored user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    
    // If user exists in localStorage, fetch fresh data from API
    if (storedUser) {
      // Fetch fresh user data by ID
      fetch(`http://localhost:8000/users/${storedUser.id}`)
        .then((res) => res.json())
        .then((data) => {
          // Update current user state
          setCurrentUser(data);
          // Sync new data back to localStorage
          localStorage.setItem("user", JSON.stringify(data));
        });
    }
  }, []); // Empty dependency array means this effect runs once on mount

  // Return UserContext.Provider with current user state and setter
  return (
    <UserContext.Provider value={{ 
      currentUser, 
      setCurrentUser 
    }}>
      {children}
    </UserContext.Provider>
  );
}

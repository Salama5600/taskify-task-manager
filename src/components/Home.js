// Home component that serves as the main landing page
import { Outlet } from "react-router-dom";
import Header from "./Header";

// Main home component function
function Home() {
  // Render the main home page with a header and an outlet for routing
  return (
    <div className="Home ">
      <div className="container">
        {/* Header component */}
        <Header />

        {/* Container for the outlet */}
        {/* Outlet for routing */}
        <Outlet />
      </div>
    </div>
  );
}

// Export the Home component as the default export
export default Home;

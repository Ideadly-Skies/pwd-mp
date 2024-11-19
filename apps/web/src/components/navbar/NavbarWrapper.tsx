"use client"; // Marks this component as a client-side component
import { AdminSidebar } from "../sidebar/page";
import Navbar from "@/components/navbar/page";
import authStore from "@/zustand/authStore";
import { useState, useEffect } from "react";

const NavbarWrapper = ({ children }: any) => {
  const role = authStore((state) => state.role);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Toggle menu function
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Effect to reset state when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false); // Reset the menu state for larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (role === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // Ensure consistent rendering for 'organizer' role
  const isOrganizer = role === "organizer";

  return (
    <div className={`min-h-screen ${isOrganizer ? "flex flex-col md:flex-row" : ""}`}>
      {isOrganizer ? (
        <>
          {/* Sidebar */}
          <div className="w-full md:w-64 bg-gray-800 text-white md:h-screen h-auto">
            {/* Only show the hamburger button on mobile sizes */}
            <button
              className="md:hidden p-4 text-white bg-gray-700 hover:bg-gray-600"
              onClick={toggleMenu}
            >
              ☰ {/* Hamburger Icon */}
            </button>
  
            {/* Sidebar should always be visible on larger screens */}
            {isMenuOpen || window.innerWidth >= 768 ? (
              <div className="flex items-center py-4 px-2">
                <AdminSidebar />
              </div>
            ) : null}
          </div>
  
          {/* Main content area */}
          <div className="flex-grow p-4 overflow-auto">{children}</div>
        </>
      ) : (
        <>
          <Navbar />
          <main className="p-4">{children}</main>
        </>
      )}
    </div>
  );
};

export default NavbarWrapper;
"use client"; // Marks this component as a client-side component
import { AdminSidebar } from "../sidebar/page";
import Navbar from "@/components/navbar/page";
import authStore from "@/zustand/authStore";

const NavbarWrapper = ({ children }:any) => {
  // Get the user's role from the Zustand store
  const role = authStore((state) => state.role);

  // Display a loading state while the role is being determined
  if (role === undefined) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${role === "organizer" ? "flex" : ""}`}>
      {role === "organizer" ? (
        <>
          {/* Sidebar on the side */}
          <div className="w-64 bg-gray-800 text-white h-screen">
            <AdminSidebar />
          </div>
          {/* Main content area */}
          <div className="flex-grow p-4 overflow-auto">
            {children}
          </div>
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
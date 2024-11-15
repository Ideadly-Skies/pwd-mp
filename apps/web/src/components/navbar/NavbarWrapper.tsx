// components/NavbarWrapper.tsx
"use client"; // Marks this component as a client-side component
import { AdminSidebar } from "../sidebar/page";
import Navbar from "@/components/navbar/page";
import authStore from "@/zustand/authStore";

const NavbarWrapper = () => {
    // Get the user's role from the Zustand store
    const role = authStore((state) => state.role);
  
    // Conditionally render the Navbar or AdminSidebar based on the user's role
    if (role === 'organizer') {
      return <AdminSidebar />;
    }
    return <Navbar />;
  };
  
  export default NavbarWrapper;
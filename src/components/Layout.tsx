
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Overlay para fechar o sidebar em telas menores */}
      <div 
        className={cn(
          "fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <main className="flex-1 transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-4 py-6">
          <button
            onClick={toggleSidebar}
            className="lg:hidden fixed top-4 left-4 z-20 rounded-md bg-white p-2 shadow-md hover:bg-gray-100"
            aria-label="Menu"
          >
            <Menu size={24} />
          </button>
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

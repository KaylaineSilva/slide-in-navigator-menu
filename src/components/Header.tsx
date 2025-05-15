
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Search, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white border-b sticky top-0 z-30 w-full">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <h1 className="text-xl font-bold text-green-600">Cadê meu ORCID?</h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            <Link 
              to="/" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>
            <Link 
              to="/busca" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
            >
              <Search size={20} />
              <span>Busca</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={cn(
            "md:hidden absolute left-0 right-0 bg-white z-20 border-b transition-all duration-300",
            mobileMenuOpen ? "max-h-40 py-2" : "max-h-0 overflow-hidden"
          )}
        >
          <nav className="flex flex-col space-y-2 px-4 pb-2">
            <Link 
              to="/" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <User size={20} />
              <span>Perfil</span>
            </Link>
            <Link 
              to="/busca" 
              className="flex items-center gap-2 rounded-md px-3 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Search size={20} />
              <span>Busca</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

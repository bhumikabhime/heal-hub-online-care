
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Hospital, User, Search, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Hospital className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold text-gray-900">HealHub</span>
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/doctors" className="nav-link">Doctors</Link>
                <Link to="/appointments" className="nav-link">Appointments</Link>
                <Link to="/services" className="nav-link">Services</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Search className="h-5 w-5" />
            </Button>
            <Link to="/login">
              <Button variant="outline" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90">Register</Button>
            </Link>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 px-4">
            <Link to="/" className="nav-link block">Home</Link>
            <Link to="/doctors" className="nav-link block">Doctors</Link>
            <Link to="/appointments" className="nav-link block">Appointments</Link>
            <Link to="/services" className="nav-link block">Services</Link>
            <Link to="/contact" className="nav-link block">Contact</Link>
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200 flex flex-col space-y-2 px-4">
            <Link to="/login">
              <Button variant="outline" className="w-full flex items-center justify-center">
                <User className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-primary hover:bg-primary/90 w-full">Register</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

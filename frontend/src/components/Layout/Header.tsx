import React from "react";
import { Link, useLocation } from "react-router-dom";

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-xl font-bold text-gray-900">
                ABC Ignite
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Classes
            </Link>
            <Link
              to="/bookings"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/bookings")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Bookings
            </Link>
            <Link
              to="/create-class"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/create-class")
                  ? "text-primary-600 bg-primary-50"
                  : "text-gray-700 hover:text-primary-600 hover:bg-gray-50"
              }`}
            >
              Create Class
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;

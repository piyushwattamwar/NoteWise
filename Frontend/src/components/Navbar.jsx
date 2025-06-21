import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAllPastes } from "../redux/pasteSlice";
import { FaStickyNote, FaBars, FaTimes } from "react-icons/fa";
import API from "../api/axios";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(resetAllPastes());
    navigate("/");
    setDropdownOpen(false);
  };

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUser = async () => {
        try {
          const res = await API.get("/users/profile");
          setUsername(res.data.name);
        } catch (err) {
          console.error("Failed to load profile", err);
        }
      };
      fetchUser();
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isLoggedIn]);

  const links = [
    { label: "Home", path: "/" },
    { label: "Notes", path: "/pastes" },
    { label: "Profile", path: "/profile" },
    { label: "Help", path: "/help" },
    { label: "About", path: "/about" },
    { label: "Test", path: "/test" }, 
  ];

  return (
    <nav className="bg-gray-800 text-white shadow-md">
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <FaStickyNote className="text-yellow-300 text-2xl" />
          <span className="text-xl font-bold text-yellow-200">NoteWise</span>
        </div>

        {/* Mobile Toggle Button */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
          </button>
        </div>

        {/* Center Links for Desktop */}
        <div className="hidden md:flex gap-6 text-lg items-center mx-auto">
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                isActive
                  ? "text-yellow-300 font-semibold underline"
                  : "hover:text-yellow-200"
              }
            >
              {label}
            </NavLink>
          ))}
        </div>

        {/* User Dropdown (Desktop) */}
        <div className="relative hidden md:block" ref={dropdownRef}>
          {isLoggedIn && (
            <div className="inline-block">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="px-4 py-2 font-semibold text-sm bg-yellow-400 text-black rounded hover:bg-yellow-300 transition"
              >
                Hi, {username} ⌄
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-red-600 text-white dark:bg-gray-800 rounded shadow-lg z-50">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 w-full text-left hover:bg-red-700 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4 space-y-2">
          {links.map(({ label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                isActive
                  ? "block text-yellow-300 font-semibold underline"
                  : "block hover:text-yellow-200"
              }
            >
              {label}
            </NavLink>
          ))}

          {isLoggedIn && (
            <div className="pt-2">
              <div className="text-sm text-yellow-400 mb-2">Hi, {username}</div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 rounded text-white hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

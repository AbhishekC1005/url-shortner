import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoIosMenu } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useStoreContext } from "../contextApi/ContextApi";

const Navbar = () => {
  const navigate = useNavigate();
  const { token, setToken } = useStoreContext();
  const path = useLocation().pathname;
  const [navbarOpen, setNavbarOpen] = useState(false);

  const onLogOutHandler = () => {
    setToken(null);
    localStorage.removeItem("JWT_TOKEN");
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#dadce0]">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between px-4 sm:px-6">

        {/* Logo — Google Sans style */}
        <Link to="/" className="flex items-center gap-2 select-none">
          <div className="g-color-bar w-6 h-6 rounded-md flex-shrink-0" style={{
            background: "linear-gradient(135deg, #4285f4 0%, #4285f4 25%, #ea4335 25%, #ea4335 50%, #fbbc05 50%, #fbbc05 75%, #34a853 75%)",
            borderRadius: "6px"
          }} />
          <span style={{
            fontFamily: "var(--g-font-display)",
            fontWeight: 700,
            fontSize: "1.125rem",
            color: "#202124",
            letterSpacing: "-0.01em"
          }}>
            Linklytics
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <ul className={`flex sm:gap-1 gap-4 sm:items-center text-sm sm:static absolute left-0 right-0 top-[64px] sm:shadow-none shadow-md ${
          navbarOpen ? "h-fit pb-4 pt-2 px-6 bg-white border-b border-[#dadce0]" : "h-0 overflow-hidden sm:h-fit"
        } transition-all duration-150 sm:bg-transparent sm:flex-row flex-col`}>

          {[
            { to: "/", label: "Home" },
            { to: "/about", label: "About" },
            ...(token ? [{ to: "/dashboard", label: "Dashboard" }] : []),
          ].map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                style={{ fontFamily: "var(--g-font)" }}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-150 ${
                  path === to
                    ? "text-[#1a73e8] bg-[#e8f0fe]"
                    : "text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4]"
                }`}
              >
                {label}
              </Link>
            </li>
          ))}

          {!token && (
            <li className="sm:ml-3">
              <Link
                to="/register"
                className="g-btn-primary text-sm"
                style={{ fontFamily: "var(--g-font)", borderRadius: "6px", height: "36px", padding: "0 20px" }}
              >
                Get started
              </Link>
            </li>
          )}

          {token && (
            <li className="sm:ml-2">
              <button
                onClick={onLogOutHandler}
                style={{ fontFamily: "var(--g-font)", borderRadius: "6px", height: "36px", padding: "0 20px" }}
                className="inline-flex items-center justify-center text-sm font-medium text-[#5f6368] hover:text-[#202124] hover:bg-[#f1f3f4] rounded-full px-3 py-1.5 transition-all duration-150 border border-[#dadce0]"
              >
                Sign out
              </button>
            </li>
          )}
        </ul>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setNavbarOpen(!navbarOpen)}
          className="sm:hidden flex items-center text-[#5f6368] hover:text-[#202124] p-2 rounded-full hover:bg-[#f1f3f4] transition-colors"
        >
          {navbarOpen ? <RxCross2 className="text-xl" /> : <IoIosMenu className="text-xl" />}
        </button>
      </div>
    </header>
  );
};

export default Navbar;
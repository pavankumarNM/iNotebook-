import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  let location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar-dark navbar-expand-lg bg-dark ">
      <div className="container-fluid">
        <Link className="navbar-brand my-3 mx-3" to="/Home">
          <h2>
            <b>iNotebook</b>{" "}
          </h2>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 mx-3 my-3">
            <li className="nav-item my-3 mx-2">
              <Link
                className={`nav-link ${
                  location.pathname === "/Home" ? "active" : ""
                }`}
                to="/Home"
              >
                Home
              </Link>
            </li>
            <li className="nav-item my-3 mx-2 ">
              <Link
                className={`nav-link ${
                  location.pathname === "/About" ? "active" : ""
                }`}
                to="/About"
              >
                About
              </Link>
            </li>
            <li className="nav-item my-3 mx-2">
              <Link
                className={`nav-link ${
                  location.pathname === "/Contactme" ? "active" : ""
                }`}
                to="/Contactme"
              >
                Contact Us
              </Link>
            </li>
          </ul>
          {!localStorage.getItem("token") ? (
            <form className="d-flex" role="search">
              <Link className="btn btn-primary mx-1" to="/login" role="button">
                Login
              </Link>
              <Link className="btn btn-primary mx-1" to="/signup" role="button">
                SignUp
              </Link>
            </form>
          ) : (
            <button className="btn btn-primary" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

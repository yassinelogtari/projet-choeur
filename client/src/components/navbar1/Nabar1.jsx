import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Table from "../table/Table";
import Notification from "../../img/notification.svg";
import adminIcon from "../../assets/img/avatars/admin-icon.png"
import { io } from "socket.io-client";

function Navbar1() {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [couter, setCouter] = useState(false);
  const [storedToken, setStoredToken] = useState();
  const [user, setUser] = useState();
  const [candidates, setCandidates] = useState([]);

  const socket = io.connect("http://localhost:5000/");
  
  useEffect(() => {
    if (socket && user) {
     
      // Set the user's socketId when they connect
      socket.emit("setSocketId", user._id);
      console.log(socket)
      // Listen for notifications only if socket is defined
      socket.on("getNotification", (allCandidates) => {
        console.log("Received updated candidates:", allCandidates);
        setCandidates(allCandidates);
      });
      
      return () => {
        // Clean up the socket connection on component unmount
        socket.removeAllListeners(); // Remove all event listeners
        socket.disconnect();
      };
    }
  }, [user, socket]); 

  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue&& storedTokenValue!="null") {
      setStoredToken(storedTokenValue);
      if (storedToken) {
        console.log( storedToken)
        fetchUser();
      }
    }
  }, [storedToken]);
  const fetchUser = async () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);

      socket.emit("setSocketId", decodedToken.membreId);

      const res = await axios.get(
        `http://localhost:8000/api/profile/getUser/${decodedToken.membreId}`
      );

      if (res) {
        setUser(res.data);
        console.log(res.data.notifications);
        setNotifications(res.data.notifications);
        let count = 0;
        for (let i = 0; i < res.data.notifications.length; i++) {
          if (res.data.notifications[i].read == false) {
            setCouter((prevCounter) => prevCounter + 1);
          }
        }
      }
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        let dataPlusRead = {
          notification: data,
          read: false,
        };
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          dataPlusRead,
        ]);
        console.log(notifications);
        setCouter((prevCounter) => prevCounter + 1);
      });
    }
  }, [socket]);

  const handleRead = () => {
    setCouter(0);
    setOpen(false);
  };

  const handleLogout = () => {
    setStoredToken(null);
    localStorage.removeItem("token");
    setNotifications([]);
  };

  return (
    <div className="layout-page position-relative">
      {/* Navbar */}
      <nav
        className="layout-navbar container-xxl navbar navbar-expand-xl navbar-detached align-items-center bg-navbar-theme"
        id="layout-navbar"
      >
        <div className="layout-menu-toggle navbar-nav align-items-xl-center me-3 me-xl-0 d-xl-none">
          <a
            className="nav-item nav-link px-0 me-xl-4"
            href="javascript:void(0)"
          >
            <i className="bx bx-menu bx-sm" />
          </a>
        </div>
        <div
          className="navbar-nav-right d-flex align-items-center"
          id="navbar-collapse"
        >
          {/* Search */}
          <div className="navbar-nav align-items-center">
            <div className="nav-item d-flex align-items-center">
              <i className="bx bx-search fs-4 lh-0" />
              <input
                type="text"
                className="form-control border-0 shadow-none"
                placeholder="Search..."
                aria-label="Search..."
              />
            </div>
          </div>
          {/* /Search */}
          <ul className="navbar-nav flex-row align-items-center ms-auto">
            {/* Place this tag where you want the button to render. */}
            <li className="nav-item lh-1 me-3">
              <div className="icon" onClick={() => setOpen(!open)}>
                <img src={Notification} className="iconImg" alt="" />
                {couter > 0 && <div className="counter">{couter}</div>}
              </div>
              {open && (
                <div className="notifications">
                  {notifications
                    .slice()
                    .reverse()
                    .map((notification) => (
                      <span key={notification.id}>
                        <span className="notificationItem">
                          {notification.notification}
                        </span>
                        <br />
                      </span>
                    ))}
                  <button className="nButton" onClick={handleRead}>
                    Mark as read
                  </button>
                </div>
              )}
            </li>
            {/* User */}
            <li className="nav-item navbar-dropdown dropdown-user dropdown">
              <a
                className="nav-link dropdown-toggle hide-arrow"
                href="javascript:void(0);"
                data-bs-toggle="dropdown"
              >
                <div className="avatar avatar-online">
                  <img
                    src={adminIcon}
                    alt
                    className="w-px-40 h-auto rounded-circle"
                  />
                </div>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar avatar-online">
                          <img
                            src="../assets/img/avatars/1.png"
                            alt
                            className="w-px-40 h-auto rounded-circle"
                          />
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <span className="fw-semibold d-block">John Doe</span>
                        <small className="text-muted">Admin</small>
                      </div>
                    </div>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-user me-2" />
                    <span className="align-middle">My Profile</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bx bx-cog me-2" />
                    <span className="align-middle">Settings</span>
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <span className="d-flex align-items-center align-middle">
                      <i className="flex-shrink-0 bx bx-credit-card me-2" />
                      <span className="flex-grow-1 align-middle">Billing</span>
                      <span className="flex-shrink-0 badge badge-center rounded-pill bg-danger w-px-20 h-px-20">
                        4
                      </span>
                    </span>
                  </a>
                </li>
                <li>
                  <div className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="auth-login-basic.html">
                    <i className="bx bx-power-off me-2" />
                    <span className="align-middle">Log Out</span>
                  </a>
                </li>
              </ul>
            </li>
            {/*/ User */}
          </ul>
        </div>
      </nav>
      {/* / Navbar */}
      {/* Content wrapper */}
      <div className="content-wrapper" />
      {/* Content wrapper */}
    </div>
  );
}

export default Navbar1;

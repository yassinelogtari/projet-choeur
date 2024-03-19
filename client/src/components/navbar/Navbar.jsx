import "./navbar.css";
import Notification from "../../img/notification.svg";
import Message from "../../img/message.svg";
import Logout from "../../img/logout2.png";
import Settings from "../../img/settings.svg";
import { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Navbar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [couter, setCouter] = useState(false);
  const [storedToken, setStoredToken] = useState();
  const [user, setUser] = useState();

  useEffect(() => {
    const storedTokenValue = String(localStorage.getItem("token"));

    if (storedTokenValue) {
      console.log();
      setStoredToken(storedTokenValue);
      if (storedToken) {
        fetchUser();
      }
    }
  }, [storedToken]);

  const fetchUser = async () => {
    if (storedToken) {
      const decodedToken = jwtDecode(storedToken);
      socket.emit("setSocketId", decodedToken.membreId);
      const res = await axios.get(
        `https://projet-choeur-api.vercel.app/api/profile/getUser/${decodedToken.membreId}`
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

  return user ? (
    <div className="navbar">
      <span className="logo">Test Notification</span>
      <div className="icons">
        <div className="icon" onClick={() => setOpen(!open)}>
          <img src={Notification} className="iconImg" alt="" />
          {couter > 0 && <div className="counter">{couter}</div>}
        </div>
        <div className="icon" onClick={() => setOpen(!open)}>
          <img src={Message} className="iconImg" alt="" />
        </div>
        <div className="icon" onClick={() => setOpen(!open)}>
          <img src={Settings} className="iconImg" alt="" />
        </div>
        <div className="icon" onClick={handleLogout}>
          <img src={Logout} className="iconImg" alt="" />
        </div>
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
    </div>
  ) : (
    <div>loading</div>
  );
};

export default Navbar;

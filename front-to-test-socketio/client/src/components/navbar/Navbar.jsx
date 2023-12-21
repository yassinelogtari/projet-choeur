import "./navbar.css";
import Notification from "../../img/notification.svg";
import Message from "../../img/message.svg";
import Settings from "../../img/settings.svg";
import { useEffect, useState } from "react";

const Navbar = ({ socket }) => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const [couter, setCouter] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (data) => {
        setNotifications(data);
        setCouter((prevCounter) => prevCounter + 1);
      });
    }
  }, [socket]);

  const handleRead = () => {
    setCouter(0);
    setOpen(false);
  };

  return (
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
      </div>
      {open && (
        <div className="notifications">
          {notifications}
          <button className="nButton" onClick={handleRead}>
            Mark as read
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
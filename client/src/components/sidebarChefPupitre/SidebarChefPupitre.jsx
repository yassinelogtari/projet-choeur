import { Link } from "@mui/material";
import { NavLink } from "react-router-dom";

function SidebarChefPupitre() {
  return (
    <ul className="menu-inner py-1">
      {/* Dashboard */}
      <li className="menu-item active">
        <a href="index.html" className="menu-link">
          <i className="menu-icon tf-icons bx bx-home-circle" />
          <div data-i18n="Analytics">Dashboard</div>
        </a>
      </li>

      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Pages</span>
      </li>
      <NavLink to="/dashboard/chef-de-pupitre/home">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Home</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/chef-de-pupitre/presence-main-concert">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">presence Concert</div>
          </a>
        </li>
      </NavLink>
<<<<<<< HEAD
      <NavLink to="/dashboard/chef-de-pupitre/repetition/ListePresenceRepetition">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">precences repetitions</div>
=======
      <NavLink to="/dashboard/chef-de-pupitre/presence-main-repetition">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">presence Repetition</div>
>>>>>>> 7d3f83907e6ef48990507389b378e9518b279b11
          </a>
        </li>
      </NavLink>
    </ul>
  );
}

export default SidebarChefPupitre;

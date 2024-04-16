import { Link } from "@mui/material";
import { NavLink } from "react-router-dom";

function SidebarChoriste({memberId }) {
  const idDuChoriste = "valeur_de_l_id";
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
      <NavLink to="/dashboard/choriste/home">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Home</div>
          </a>
        </li>
      </NavLink>
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Présence</span>
      </li>
      <NavLink to="/dashboard/choriste/presence/allRepetitions">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Marquer présence pour une Répétition</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/choriste/presence/allConcerts">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Marquer présence pour un Concert</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/choriste/demandeConge">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Demande congé</div>
          </a>
        </li>
      </NavLink>
      <NavLink  to={`/dashboard/choriste/historique`}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings"> Historique </div>
          </a>
        </li>
      </NavLink>
    </ul>
  );
}

export default SidebarChoriste;

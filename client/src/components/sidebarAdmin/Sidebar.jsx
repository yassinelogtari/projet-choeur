import { Link } from "@mui/material";
import { NavLink } from "react-router-dom";

function Sidebar() {
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
      <NavLink to="/dashboard/admin/home">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Home</div>
          </a>
        </li>
      </NavLink>

      <NavLink to="/dashboard/admin/audition">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Audition</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/concert">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Concert</div>
          </a>
        </li>
      </NavLink>

      {/* Saisons */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Saisons</span>
      </li>

      <NavLink to="/dashboard/admin/nouvelleSaison">
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-box" />
            <div data-i18n="User interface">Nouvelle Saison</div>
          </a>
        </li>
      </NavLink>

      <NavLink to="/dashboard/admin/saisonActuelle">
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-box" />
            <div data-i18n="User interface">Saison Actuelle</div>
          </a>
        </li>
      </NavLink>

      <NavLink to="/dashboard/admin/archive">
        <li className="menu-item">
          <a href="javascript:void(0)" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-copy" />
            <div data-i18n="Extended UI">Archives</div>
          </a>
        </li>
      </NavLink>
      {/* Candidature */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Audition</span>
      </li>
      <NavLink to="/dashboard/admin/Audition/list">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des auditions</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/Audition/genererPlanning">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">
              Générer un planning d'auditions
            </div>
          </a>
        </li>
      </NavLink>
      {/* auditions */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Candidatures</span>
      </li>
      <NavLink to="/dashboard/admin/Candidature/list">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des candidatures</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/Candidature/listParpupitre">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">
              Liste des candidatures par pupitre
            </div>
          </a>
        </li>
      </NavLink>
      {/* Ouevres */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Œuvres</span>
      </li>
      <NavLink to="/dashboard/admin/oeuvres/liste">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des œuvres</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/oeuvres/addoeuvre">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Ajouter œuvre</div>
          </a>
        </li>
      </NavLink>
      {/* repeptions */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Repetitions</span>
      </li>
      <NavLink to="/dashboard/admin/repetition/liste-absence">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">absences repetions</div>
          </a>
        </li>
      </NavLink>
    </ul>
  );
}

export default Sidebar;

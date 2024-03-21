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
            <div data-i18n="Account Settings">Liste des candidatures par pupitre</div>
          </a>
        </li>
      </NavLink>
      
      {/* Forms & Tables */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Forms &amp; Tables</span>
      </li>
      {/* Forms */}
      <li className="menu-item">
        <a href="javascript:void(0);" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-detail" />
          <div data-i18n="Form Elements">Form Elements</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <a href="forms-basic-inputs.html" className="menu-link">
              <div data-i18n="Basic Inputs">Basic Inputs</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="forms-input-groups.html" className="menu-link">
              <div data-i18n="Input groups">Input groups</div>
            </a>
          </li>
        </ul>
      </li>
      <li className="menu-item">
        <a href="javascript:void(0);" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-detail" />
          <div data-i18n="Form Layouts">Form Layouts</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <a href="form-layouts-vertical.html" className="menu-link">
              <div data-i18n="Vertical Form">Vertical Form</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="form-layouts-horizontal.html" className="menu-link">
              <div data-i18n="Horizontal Form">Horizontal Form</div>
            </a>
          </li>
        </ul>
      </li>
      {/* Tables */}
      <li className="menu-item">
        <a href="tables-basic.html" className="menu-link">
          <i className="menu-icon tf-icons bx bx-table" />
          <div data-i18n="Tables">Tables</div>
        </a>
      </li>
      {/* Misc */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Misc</span>
      </li>
      <li className="menu-item">
        <a
          href="https://github.com/themeselection/sneat-html-admin-template-free/issues"
          target="_blank"
          className="menu-link"
        >
          <i className="menu-icon tf-icons bx bx-support" />
          <div data-i18n="Support">Support</div>
        </a>
      </li>
      <li className="menu-item">
        <a
          href="https://themeselection.com/demo/sneat-bootstrap-html-admin-template/documentation/"
          target="_blank"
          className="menu-link"
        >
          <i className="menu-icon tf-icons bx bx-file" />
          <div data-i18n="Documentation">Documentation</div>
        </a>
      </li>
    </ul>
  );
}

export default Sidebar;

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
  

  
      {/* Components */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Components</span>
      </li>
      {/* Cards */}
      <li className="menu-item">
        <a href="cards-basic.html" className="menu-link">
          <i className="menu-icon tf-icons bx bx-collection" />
          <div data-i18n="Basic">Cards</div>
        </a>
      </li>
      {/* User interface */}
      <li className="menu-item">
        <a href="javascript:void(0)" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-box" />
          <div data-i18n="User interface">User interface</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <a href="ui-accordion.html" className="menu-link">
              <div data-i18n="Accordion">Accordion</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-alerts.html" className="menu-link">
              <div data-i18n="Alerts">Alerts</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-badges.html" className="menu-link">
              <div data-i18n="Badges">Badges</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-buttons.html" className="menu-link">
              <div data-i18n="Buttons">Buttons</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-carousel.html" className="menu-link">
              <div data-i18n="Carousel">Carousel</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-collapse.html" className="menu-link">
              <div data-i18n="Collapse">Collapse</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-dropdowns.html" className="menu-link">
              <div data-i18n="Dropdowns">Dropdowns</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-footer.html" className="menu-link">
              <div data-i18n="Footer">Footer</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-list-groups.html" className="menu-link">
              <div data-i18n="List Groups">List groups</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-modals.html" className="menu-link">
              <div data-i18n="Modals">Modals</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-navbar.html" className="menu-link">
              <div data-i18n="Navbar">Navbar</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-offcanvas.html" className="menu-link">
              <div data-i18n="Offcanvas">Offcanvas</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-pagination-breadcrumbs.html" className="menu-link">
              <div data-i18n="Pagination & Breadcrumbs">
                Pagination &amp; Breadcrumbs
              </div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-progress.html" className="menu-link">
              <div data-i18n="Progress">Progress</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-spinners.html" className="menu-link">
              <div data-i18n="Spinners">Spinners</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-tabs-pills.html" className="menu-link">
              <div data-i18n="Tabs & Pills">Tabs &amp; Pills</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-toasts.html" className="menu-link">
              <div data-i18n="Toasts">Toasts</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-tooltips-popovers.html" className="menu-link">
              <div data-i18n="Tooltips & Popovers">Tooltips &amp; popovers</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="ui-typography.html" className="menu-link">
              <div data-i18n="Typography">Typography</div>
            </a>
          </li>
        </ul>
      </li>
      {/* Extended components */}
      <li className="menu-item">
        <a href="javascript:void(0)" className="menu-link menu-toggle">
          <i className="menu-icon tf-icons bx bx-copy" />
          <div data-i18n="Extended UI">Extended UI</div>
        </a>
        <ul className="menu-sub">
          <li className="menu-item">
            <a href="extended-ui-perfect-scrollbar.html" className="menu-link">
              <div data-i18n="Perfect Scrollbar">Perfect scrollbar</div>
            </a>
          </li>
          <li className="menu-item">
            <a href="extended-ui-text-divider.html" className="menu-link">
              <div data-i18n="Text Divider">Text Divider</div>
            </a>
          </li>
        </ul>
      </li>
      <li className="menu-item">
        <a href="icons-boxicons.html" className="menu-link">
          <i className="menu-icon tf-icons bx bx-crown" />
          <div data-i18n="Boxicons">Boxicons</div>
        </a>
      </li>
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

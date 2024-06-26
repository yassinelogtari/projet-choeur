import { NavLink } from "react-router-dom";

function Sidebar() {
  function goup() {
    var scrollStep = -window.scrollY / (400 / 15),
      scrollInterval = setInterval(function () {
        if (window.scrollY != 0) {
          window.scrollBy(0, scrollStep);
        } else clearInterval(scrollInterval);
      }, 15);
  }
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
      {/* Concerts */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Concerts</span>
      </li>
      <NavLink to="/dashboard/admin/concert">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Concert</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/AbsenceConcerts">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Absence Concerts</div>
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
      <NavLink to="/dashboard/admin/Audition/list" onClick={goup}>
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

      {/*placement */}

      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Placement</span>
      </li>
      <NavLink to="/dashboard/admin/placement" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Gérer placement</div>
          </a>
        </li>
      </NavLink>
      {/* auditions */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Candidatures</span>
      </li>
      <NavLink to="/dashboard/admin/Candidature/list" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des candidatures</div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/Candidature/listV2" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des candidatures V2</div>
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
            <div data-i18n="Account Settings">Absences répétitions</div>
          </a>
        </li>
        
      </NavLink>
      <NavLink to="/dashboard/admin/repetition/liste-repetition">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Gérer les répétitions</div>
          </a>
        </li>
        
      </NavLink>
      {/* <NavLink to="/dashboard/admin/repetition/ListePresenceRepetition">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">precences repetitions</div>
          </a>
        </li>
      </NavLink> */}

      {/* Conges */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Congés</span>
      </li>
      <NavLink to="/dashboard/admin/conges">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Validation des Congés</div>
          </a>
        </li>
      </NavLink>

      {/* Statistiques */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Statistiques</span>
      </li>
      <NavLink to="/dashboard/admin/statistiques">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Générer des Statistiques</div>
          </a>
        </li>
      </NavLink>
      {/* Absences */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Absences</span>
      </li>
      <NavLink to="/dashboard/admin/absences">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des absences</div>
          </a>
        </li>
      </NavLink>
            {/* Nomination */}
            <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Nomination</span>
      </li>
      <NavLink to="/dashboard/admin/nomination/list">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des nominés</div>
          </a>
        </li>
      </NavLink>
                  {/* Elimination*/}
                  <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Elimination</span>
      </li>
      <NavLink to="/dashboard/admin/elimination/list">
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des éliminés</div>
          </a>
        </li>
      </NavLink>
      {/* Les eliminations */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">
          Les éliminations disciplinaires
        </span>
      </li>
      <NavLink to="/dashboard/admin/eliminerdiscipline" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">
              Eliminer un choriste pour une raison disciplinaire
            </div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/exlurechoriste" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">
              Exlure définitivement un choriste éliminé
            </div>
          </a>
        </li>
      </NavLink>
      <NavLink to="/dashboard/admin/modifiertauxelimination" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">
              Modifier le taux d'élimination
            </div>
          </a>
        </li>
      </NavLink>

      {/* gestion des compte */}
      <li className="menu-header small text-uppercase">
        <span className="menu-header-text">Comptes</span>
      </li>
      <NavLink to="/dashboard/admin/accounts/register" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Création des comptes</div>
          </a>
        </li>
      </NavLink>

      <NavLink to="/dashboard/admin/accounts/list" onClick={goup}>
        <li className="menu-item">
          <a href="javascript:void(0);" className="menu-link menu-toggle">
            <i className="menu-icon tf-icons bx bx-dock-top" />
            <div data-i18n="Account Settings">Liste des comptes</div>
          </a>
        </li>
      </NavLink>
    </ul>
  );
}

export default Sidebar;

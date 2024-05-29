import React from "react";
import Navbar1 from "../../components/navbar1/Nabar1";
import Sidebar from "../../components/sidebarAdmin/Sidebar";

import "../admin/adminDashboard.css";
import HomePage from "./pages/HomePage";
import AdminAudition from "./pages/auditions/AdminAudition";
import NouvelleSaison from "./pages/saison/NouvelleSaison";
import SaisonActuelle from "./pages/saison/SaisonActuelle";

import AffichePlacement from "../../components/placement/AffichePlacement";
import AdminAuditionInfo from "../admin/pages/auditions/AdminAddAuditionInfo";
import AuditionUpdate from "../admin/pages/auditions/AuditionUpdate";
import AbsenceConcerts from "../concert/AbsenceConcerts";
import Concert from "../concert/Concert";
import Placement from "../placement/Placement";
import AbsenceRepetition from "./pages/absenceRepetition/AbsenceRepetitions";
import Absence from "./pages/absences/Absence";
import PlanningAudition from "./pages/auditions/GenererPlanning";
import CandidatesList from "./pages/candidates/CandidatesList";
import CandidatesListV2 from "./pages/candidates/CandidatesListV2";
import ListeCandidatesParPupitre from "./pages/candidates/ListeCandidatesParPupitre";
import AccountList from "./pages/comptes/AccountList";
import AccountInfo from "./pages/comptes/AcountInfos";
import AccountInfoEdit from "./pages/comptes/AcountInfosEdit";
import AcountRegister from "./pages/comptes/AcountRegister";
import ConcertDisponibleMembers from "./pages/concerts/ConcertDisponibleMembers";
import Elimination from "./pages/elimination/Elimination";
import Nomination from "./pages/nomination/Nomination";
import AddOeuvre from "./pages/oeuvres/AddOeuvre";
import ListeOeuvres from "./pages/oeuvres/ListeOeuvres";
import Archive from "./pages/saison/archive/Archive";
import GenererStatistique from "./pages/statistiques/genererStatistique";
import ValidateConges from "./pages/validateConge/ValidateConges";
//import ListePresenceRepetition from "./pages/repetition/ListePresenceRepetition";
import EliminerDes from "./pages/eliminerraisondis/eliminerdis";
import ExclureChoristeElimine from "./pages/eliminerraisondis/exlurechoristeelimine";
import ModifierTauxElimination from "./pages/eliminerraisondis/modifiertauxelimination";
import ElimineProfil from "./pages/profiladmin/elimineProfil";
import NomineProfil from "./pages/profiladmin/nomineProfil";
import ProfileAdmin from "./pages/profiladmin/profiladmin";
import UpdateProfileAdmin from "./pages/profiladmin/updateProdileAdmin";

import AddRepetition from "./pages/repetition/AddRepetition";
import ListeRepetition from "./pages/repetition/ListeRepetition";
const AdminDashboard = (props) => {
  return (
    <div>
      <div>
        <div className="layout-wrapper layout-content-navbar">
          <div className="layout-container">
            <aside
              id="layout-menu"
              className="layout-menu menu-vertical menu bg-menu-theme"
            >
              <Sidebar />
            </aside>

            <Navbar1 />

            {props.load === "home" && <HomePage />}
            {props.load === "adminAudition" && <AdminAudition />}
            {props.load === "Concert" && <Concert />}
            {props.load === "placement" && <Placement />}
            {props.load === "placement affiche" && <AffichePlacement />}
            {props.load === "nouvelleSaison" && <NouvelleSaison />}
            {props.load === "saisonActuelle" && <SaisonActuelle />}
            {props.load === "auditionAddInfo" && <AdminAuditionInfo />}
            {props.load === "archives" && <Archive />}
            {props.load === "candidatesList" && <CandidatesList />}
            {props.load === "updateAudition" && <AuditionUpdate />}
            {props.load === "ListeOeuvres" && <ListeOeuvres />}
            {props.load === "AddOeuvre" && <AddOeuvre />}
            {props.load === "ListeCandidatesParPupitre" && (
              <ListeCandidatesParPupitre />
            )}
            {props.load === "genererPlanning" && <PlanningAudition />}
            {props.load === "genererStatistique" && <GenererStatistique />}
            
            {props.load === "listeRepetition" && <ListeRepetition />}
            
            {props.load === "addRepetition" && <AddRepetition />}
            {props.load === "absenceRep" && <AbsenceRepetition />}
            {props.load === "candidatesListV2" && <CandidatesListV2 />}
            {props.load === "AcountRegister" && <AcountRegister />}
            {props.load === "AcountList" && <AccountList />}
            {props.load === "AcountInfos" && <AccountInfo />}
            {props.load === "AcountInfosEdit" && <AccountInfoEdit />}
            {props.load === "ConcertDisponibleMembers" && (
              <ConcertDisponibleMembers />
            )}
            {props.load === "conges" && <ValidateConges />}
          </div>
          {props.load === "absences" && <Absence />}
          {props.load === "AbsenceConcerts" && <AbsenceConcerts />}
          {props.load === "Nomination" && <Nomination />}
          {props.load === "Elimination" && <Elimination />}
         {/* {props.load === "ListePresenceRepetition" && < ListePresenceRepetition/>} */}
          
          {props.load === "exlurechoriste" && <ExclureChoristeElimine />}
          {props.load === "modifiertauxelimination" && (
            <ModifierTauxElimination />
          )}
          {props.load === "eliminerdiscipline" && <EliminerDes />}
          {props.load === "profileadmin" && <ProfileAdmin />}
          {props.load === "updateprofileadmin" && <UpdateProfileAdmin />}
          {props.load === "elimineprofil" && <ElimineProfil />}
          {props.load === "nomineprofil" && <NomineProfil />}

          <div className="layout-overlay layout-menu-toggle" />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

import React, { useEffect } from "react";
import Sidebar from "../../components/sidebarAdmin/Sidebar";
import Navbar1 from "../../components/navbar1/Nabar1";

import "../admin/adminDashboard.css";
import HomePage from "./pages/HomePage";
import AdminAudition from "./pages/auditions/AdminAudition";
import NouvelleSaison from "./pages/saison/NouvelleSaison";
import SaisonActuelle from "./pages/saison/SaisonActuelle";

import CandidatesList from "./pages/candidates/CandidatesList";
import ListeCandidatesParPupitre from "./pages/candidates/ListeCandidatesParPupitre";
import AdminAuditionInfo from "../admin/pages/auditions/AdminAddAuditionInfo";
import AuditionUpdate from "../admin/pages/auditions/AuditionUpdate";
import Concert from "../concert/Concert";
import Archive from "./pages/saison/archive/Archive";
import ListeOeuvres from "./pages/oeuvres/ListeOeuvres";
import PlanningAudition from "./pages/auditions/GenererPlanning";
import GenererStatistique from "./pages/statistiques/genererStatistique";
import AddOeuvre from "./pages/oeuvres/AddOeuvre";
import AbsenceRepetition from "./pages/absenceRepetition/AbsenceRepetitions";
import CandidatesListV2 from "./pages/candidates/CandidatesListV2";
import AbsenceConcerts from "../concert/AbsenceConcerts";
import AcountRegister from "./pages/comptes/AcountRegister";
import Placement from "../placement/Placement";
import AffichePlacement from "../../components/placement/AffichePlacement";
import Absence from "./pages/absences/Absence";
import AccountList from "./pages/comptes/AccountList";
import AccountInfo from "./pages/comptes/AcountInfos";
import AccountInfoEdit from "./pages/comptes/AcountInfosEdit";
import ConcertDisponibleMembers from "./pages/concerts/ConcertDisponibleMembers";
import ValidateConges from "./pages/validateConge/ValidateConges";
<<<<<<< HEAD
import Nomination from "./pages/nomination/Nomination";
import Elimination from "./pages/elimination/Elimination";
//import ListePresenceRepetition from "./pages/repetition/ListePresenceRepetition";
import ModifierTauxElimination from "./pages/eliminerraisondis/modifiertauxelimination";
import EliminerDes from "./pages/eliminerraisondis/eliminerdis";
import ExclureChoristeElimine from "./pages/eliminerraisondis/exlurechoristeelimine";
import UpdateProfileAdmin from "./pages/profiladmin/updateProdileAdmin";
import ProfileAdmin from "./pages/profiladmin/profiladmin";
import ElimineProfil from "./pages/profiladmin/elimineProfil";
import NomineProfil from "./pages/profiladmin/nomineProfil";

=======
import ListeRepetition from "./pages/repetition/ListeRepetition";
import AddRepetition from "./pages/repetition/AddRepetition";
>>>>>>> 918ad54e9dcd4ba05cb08aee76e891ca87416c56
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

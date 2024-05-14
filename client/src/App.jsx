import Login from "./pages/login/Login";
import PresenceConcert from "./routes/PresenceConcert";
import PresenceRepetition from "./routes/PresenceRepetititon";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import "./assets/css/demo.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChefPupitreDashboard from "./pages/chefPupitre/ChefPupitreDashboard";
import ManagerDashboard from "./pages/managerChoeur/ManagerDashboard";
import FormCandidature from "./pages/FormCandidature";
import SaisonArchiveeDetails from "./pages/admin/pages/saison/archive/saisonArchiveeDetails/SaisonArchiveeDetails";
import MembresTable from "./pages/admin/pages/saison/archive/saisonArchiveeDetails/tablesData/MembresTable";
import "./app.css";
import Concert from "./pages/concert/Concert";
import AddConcert from "./components/concert/AddConcert";
import EmailVerification from "./components/verify/EmailVerification";
import ChoristeDashboard from "./pages/choriste/ChoristeDashboard";
import NotFoundPage from "./pages/404page/NotFoundPage";
import { useState } from "react";
import { jwtDecode } from "jwt-decode";

const App = () => {
  let decodedToken;
  let storedTokenValue = localStorage.getItem("token");
  if (storedTokenValue) {
    decodedToken = jwtDecode(storedTokenValue);
  }

  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<Login />} />
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/presence/allRepetitions"
              element={<ChoristeDashboard load="allRepetitions" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/presence/allRepetitions"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/presence/allConcerts"
              element={<ChoristeDashboard load="allConcerts" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/presence/allConcerts"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/home"
              element={<ChoristeDashboard load="home" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/home"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/historique"
              element={<ChoristeDashboard load="historique" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/historique"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/demandeConge"
              element={<ChoristeDashboard load="demandeConge" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/demandeConge"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/disponibilité"
              element={<ChoristeDashboard load="disponibilté concert" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/disponibilité"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              path="/dashboard/choriste/conge"
              element={<ChoristeDashboard load="conge Choriste" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/conge"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "manager" ? (
            <Route
              exact
              path="/dashboard/manager"
              element={<ManagerDashboard />}
            />
          ) : (
            <Route path="/dashboard/manager" element={<Navigate to="/404" />} />
          )}
          {decodedToken && decodedToken.role == "manager" ? (
            <Route
              path="/dashboard/manager/home"
              element={<ManagerDashboard load="home" />}
            />
          ) : (
            <Route
              path="/dashboard/manager/home"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "manager" ? (
            <Route
              path="/dashboard/manager/désigniation-chefs-pupitres"
              element={<ManagerDashboard load="désigniation-chefs-pupitres" />}
            />
          ) : (
            <Route
              path="/dashboard/manager/désigniation-chefs-pupitres"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              exact
              path="/dashboard/choriste"
              element={<ChoristeDashboard />}
            />
          ) : (
            <Route
              path="/dashboard/choriste"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "chef du pupitre" ? (
            <Route
              exact
              path="/dashboard/chef-de-pupitre/home"
              element={<ChefPupitreDashboard load="home" />}
            />
          ) : (
            <Route
              path="/dashboard/chef-de-pupitre/home"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "chef du pupitre" ? (
            <Route
              path="/dashboard/chef-de-pupitre/presence-main-concert"
              element={<ChefPupitreDashboard load="presenceConcert" />}
            />
          ) : (
            <Route
              path="/dashboard/chef-de-pupitre/presence-main-concert"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin"
              element={<Navigate to="/dashboard/admin/home" />}
            />
          ) : (
            <Route path="/dashboard/admin" element={<Navigate to="/404" />} />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/home"
              element={<AdminDashboard load="home" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/home"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/Audition/list"
              element={<AdminDashboard load="adminAudition" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/Audition/list"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/archive"
              element={<AdminDashboard load="archives" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/archive"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/nouvelleSaison"
              element={<AdminDashboard load="nouvelleSaison" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/nouvelleSaison"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/saisonActuelle"
              element={<AdminDashboard load="saisonActuelle" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/saisonActuelle"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/archive"
              element={<AdminDashboard load="archives" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/archive"
              element={<Navigate to="/404" />}
            />
          )}
          <Route
            exact
            path="/saison/archive/details-saisonArchivee/:idSA"
            element={<SaisonArchiveeDetails />}
          />
          <Route
            exact
            path="/saison/archive/details-saisonArchivee/table"
            element={<MembresTable />}
          />
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/addAudition"
              element={<AdminDashboard load="auditionAddInfo" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/addAudition"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/Candidature/list"
              element={<AdminDashboard load="candidatesList" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/Candidature/list"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/Candidature/listParpupitre"
              element={<AdminDashboard load="ListeCandidatesParPupitre" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/Candidature/listParpupitre"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/updateAudition"
              element={<AdminDashboard load="updateAudition" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/updateAudition"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/oeuvres/liste"
              element={<AdminDashboard load="ListeOeuvres" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/oeuvres/liste"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/oeuvres/addoeuvre"
              element={<AdminDashboard load="AddOeuvre" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/oeuvres/addoeuvre"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/Audition/genererPlanning"
              element={<AdminDashboard load="genererPlanning" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/Audition/genererPlanning"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/statistiques"
              element={<AdminDashboard load="genererStatistique" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/statistiques"
              element={<Navigate to="/404" />}
            />
          )}
          <Route
            exact
            path="/presence/cancert/:idC"
            element={<PresenceConcert />}
          />
          <Route
            exact
            path="/presence/repetition/:idR"
            element={<PresenceRepetition />}
          />
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/concert"
              element={<AdminDashboard load="Concert" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/concert"
              element={<Navigate to="/404" />}
            />
          )}
          <Route exact path="  " element={<AddConcert />} />
          <Route exact path="/concert" element={<Concert />} />
          <Route exact path="addConcert" element={<AddConcert />} />
          <Route exact path="/candidatureForm" element={<FormCandidature />} />
          <Route
            exact
            path="/candidats/:id/verify/:token"
            element={<FormCandidature />}
          />
          <Route exact path="/candidatsForm  " element={<FormCandidature />} />
          <Route
            exact
            path="/emailVerification"
            element={<EmailVerification />}
          />
          <Route exact path="/concert" element={<Concert />} />
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/concert/addConcert"
              element={<AddConcert />}
            />
          ) : (
            <Route
              path="/dashboard/admin/concert/addConcert"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/repetition/liste-absence"
              element={<AdminDashboard load="absenceRep" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/repetition/liste-absence"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/absences"
              element={<AdminDashboard load="absences" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/absences"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/Candidature/listV2"
              element={<AdminDashboard load="candidatesListV2" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/Candidature/listV2"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/AbsenceConcerts"
              element={<AdminDashboard load="AbsenceConcerts" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/AbsenceConcerts"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/conges"
              element={<AdminDashboard load="conges" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/conges"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/accounts/register"
              element={<AdminDashboard load="AcountRegister" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/accounts/register"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/placement"
              element={<AdminDashboard load="placement" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/placement"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/accounts/list"
              element={<AdminDashboard load="AcountList" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/accounts/list"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              path="/dashboard/admin/placement/affiche"
              element={<AdminDashboard load="placement affiche" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/placement/affiche"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/accounts/infos/:id/"
              element={<AdminDashboard load="AcountInfos" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/accounts/infos/:id/"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/accounts/infos/edit/:id/"
              element={<AdminDashboard load="AcountInfosEdit" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/accounts/infos/edit/:id/"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/concerts/disponible-members/:idC/"
              element={<AdminDashboard load="ConcertDisponibleMembers" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/concerts/disponible-members/:idC/"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/exlurechoriste"
              element={<AdminDashboard load="exlurechoriste" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/exlurechoriste"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/modifiertauxelimination"
              element={<AdminDashboard load="modifiertauxelimination" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/modifiertauxelimination"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/eliminerdiscipline"
              element={<AdminDashboard load="eliminerdiscipline" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/eliminerdiscipline"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/profileadmin"
              element={<AdminDashboard load="profileadmin" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/profileadmin"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/updateprofileadmin"
              element={<AdminDashboard load="updateprofileadmin" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/updateprofileadmin"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/elimineprofil"
              element={<AdminDashboard load="elimineprofil" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/elimineprofil"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "admin" ? (
            <Route
              exact
              path="/dashboard/admin/nomineprofil"
              element={<AdminDashboard load="nomineprofil" />}
            />
          ) : (
            <Route
              path="/dashboard/admin/nomineprofil"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              exact
              path="/dashboard/choriste/profile"
              element={<ChoristeDashboard load="Profil" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/profile"
              element={<Navigate to="/404" />}
            />
          )}
          {decodedToken && decodedToken.role == "choriste" ? (
            <Route
              exact
              path="/dashboard/choriste/updateprofil"
              element={<ChoristeDashboard load="updateprofil" />}
            />
          ) : (
            <Route
              path="/dashboard/choriste/updateprofil"
              element={<Navigate to="/404" />}
            />
          )}

          <Route exact path="/404" element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to="/404" />} />
        </Routes>
      </>
    </Router>
  );
};

export default App;

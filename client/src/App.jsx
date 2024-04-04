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
import ChoristeDashboard from "./pages/ChoristeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import FormCandidature from "./pages/FormCandidature";
import FormSaison from "./components/formSaison/FormSaison";
import SaisonArchiveeDetails from "./pages/admin/pages/saison/archive/saisonArchiveeDetails/SaisonArchiveeDetails";
import MembresTable from "./pages/admin/pages/saison/archive/saisonArchiveeDetails/tablesData/MembresTable";
import PresenceMainConcert from "../src/pages/chefPupitre/pages/presenceMain/PresenceMainConcert";

import Concert from "./pages/concert/Concert";
import AddConcert from "./components/concert/AddConcert";
import EmailVerification from "./components/verify/EmailVerification";
import Home from "./pages/chefPupitre/pages/Home";
import AbsenceRepetition from "./pages/admin/pages/absenceRepetition/AbsenceRepetitions";

const App = () => {
  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<Login />} />
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

          <Route
            exact
            path="/dashboard/manager"
            element={<ManagerDashboard />}
          />
          <Route
            exact
            path="/dashboard/choriste"
            element={<ChoristeDashboard />}
          />
          <Route
            exact
            path="/dashboard/chef-de-pupitre/home"
            element={<ChefPupitreDashboard load="home" />}
          />
          <Route
            path="/dashboard/chef-de-pupitre/presence-main-concert"
            element={<ChefPupitreDashboard load="presenceConcert" />}
          />

          <Route
            path="/dashboard/admin"
            element={<Navigate to="/dashboard/admin/home" />}
          />
          <Route
            exact
            path="/dashboard/admin/home"
            element={<AdminDashboard load="home" />}
          />

          <Route
            path="/dashboard/admin/Audition/list"
            element={<AdminDashboard load="adminAudition" />}
          />
          <Route
            path="/dashboard/admin/archive"
            element={<AdminDashboard load="archives" />}
          />
          <Route
            path="/dashboard/admin/nouvelleSaison"
            element={<AdminDashboard load="nouvelleSaison" />}
          />
          <Route
            path="/dashboard/admin/saisonActuelle"
            element={<AdminDashboard load="saisonActuelle" />}
          />
          <Route
            path="/dashboard/admin/archive"
            element={<AdminDashboard load="archives" />}
          />
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

          <Route
            path="/dashboard/admin/addAudition"
            element={<AdminDashboard load="auditionAddInfo" />}
          />
          <Route
            path="/dashboard/admin/Candidature/list"
            element={<AdminDashboard load="candidatesList" />}
          />
          <Route
            path="/dashboard/admin/Candidature/listParpupitre"
            element={<AdminDashboard load="ListeCandidatesParPupitre" />}
          />

          <Route
            path="/dashboard/admin/updateAudition"
            element={<AdminDashboard load="updateAudition" />}
          />
          <Route
            path="/dashboard/admin/oeuvres/liste"
            element={<AdminDashboard load="ListeOeuvres" />}
          />
          <Route
            path="/dashboard/admin/oeuvres/addoeuvre"
            element={<AdminDashboard load="AddOeuvre" />}
          />
          <Route
            path="/dashboard/admin/Audition/genererPlanning"
            element={<AdminDashboard load="genererPlanning" />}
          />

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
          <Route
            path="/dashboard/admin/concert"
            element={<AdminDashboard load="Concert" />}
          />
          <Route
            exact
            path="/dashboard/admin/concert/addConcert"
            element={<AddConcert />}
          />
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
          <Route exact path="addConcert" element={<AddConcert />} />

          <Route
            path="/dashboard/admin/repetition/liste-absence"
            element={<AdminDashboard load="absenceRep" />}
          />
          <Route
            path="/dashboard/admin/AbsenceConcerts"
            element={<AdminDashboard load="AbsenceConcerts" />}
          />
        </Routes>
      </>
    </Router>
  );
};

export default App;

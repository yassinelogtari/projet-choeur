import Login from "./routes/Login";
import PresenceConcert from "./routes/PresenceConcert";
import PresenceRepetition from "./routes/PresenceRepetititon";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./assets/css/demo.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ChefPupitreDashboard from "./pages/ChefPupitreDashboard";
import ChoristeDashboard from "./pages/ChoristeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";
import AdminAudition from "./pages/admin/AdminAudition";
import NouvelleSaison from "./pages/admin/saison/NouvelleSaison";
import SaisonActuelle from "./pages/admin/saison/SaisonActuelle";
import Archive from "./pages/admin/saison/Archive";

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
            path="/dashboard/chef-de-pupitre"
            element={<ChefPupitreDashboard />}
          />
          <Route exact path="/dashboard/admin/home" element={<AdminDashboard />} />
          <Route  path="/dashboard/admin/audition" element={<AdminAudition />} />
          <Route  path="/dashboard/admin/nouvelleSaison" element={<NouvelleSaison />} />
          <Route  path="/dashboard/admin/saisonActuelle" element={<SaisonActuelle />} />
          <Route  path="/dashboard/admin/archive" element={<Archive />} />
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
        </Routes>
      </>
    </Router>
  );
};

export default App;

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
import AdminAudition from "./pages/admin/pages/AdminAudition";
import NouvelleSaison from "./pages/admin/pages/saison/NouvelleSaison";
import SaisonActuelle from "./pages/admin/pages/saison/SaisonActuelle";
import Archive from "./pages/admin/pages/saison/Archive";

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
          <Route exact path="/dashboard/admin/home" element={<AdminDashboard load="home" />} />
          <Route  path="/dashboard/admin/audition" element={<AdminDashboard load="adminAudition"  />} />
          <Route  path="/dashboard/admin/nouvelleSaison" element={<AdminDashboard load="nouvelleSaison"  />} />
          <Route  path="/dashboard/admin/saisonActuelle" element={<AdminDashboard load="saisonActuelle"  />} />
          <Route  path="/dashboard/admin/archive" element={<AdminDashboard load="archives"  />} />
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

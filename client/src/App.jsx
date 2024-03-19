import "./app.css";
import Login from "./routes/Login";
import PresenceConcert from "./routes/PresenceConcert";
import PresenceRepetition from "./routes/PresenceRepetititon";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
<<<<<<< HEAD

const App = () => {
  
=======
import "./assets/css/demo.css";
import "./assets/vendor/css/core.css";
import "./assets/vendor/css/theme-default.css";
import AdminDashboard from "./pages/AdminDashboard";
import ChefPupitreDashboard from "./pages/ChefPupitreDashboard";
import ChoristeDashboard from "./pages/ChoristeDashboard";
import ManagerDashboard from "./pages/ManagerDashboard";

const App = () => {
>>>>>>> b857dbd4cce43430b3b097398c7cf9a274db7fb3
  return (
    <Router>
      <>
        <Routes>
<<<<<<< HEAD
          <Route exact path="/" element={<Login />} />
          <Route exact path="/presence/cancert/:idC" element={<PresenceConcert />} />
          <Route exact path="/presence/repetition/:idR" element={<PresenceRepetition />} />
          
=======
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
          <Route exact path="/dashboard/admin" element={<AdminDashboard />} />
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
>>>>>>> b857dbd4cce43430b3b097398c7cf9a274db7fb3
        </Routes>
      </>
    </Router>
  );
};

export default App;

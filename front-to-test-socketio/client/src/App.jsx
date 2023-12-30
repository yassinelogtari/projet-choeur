import "./app.css";
import Login from "./routes/Login";
import PresenceConcert from "./routes/PresenceConcert";
import PresenceRepetition from "./routes/PresenceRepetititon";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App = () => {
  
  return (
    <Router>
      <>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/presence/cancert/:idC" element={<PresenceConcert />} />
          <Route exact path="/presence/repetition/:idR" element={<PresenceRepetition />} />
          
        </Routes>
      </>
    </Router>
  );
};

export default App;

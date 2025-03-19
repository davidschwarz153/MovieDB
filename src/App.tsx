import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

import Layout from "./layout/Layout";
import Intro from "./pages/intro/Intro";
import Splash from "./pages/splash/Splash";
import Home from "./pages/home/Home";
import Profil from "./pages/profil/Profil";
import MovieDetail from "./components/movieDetail/MovieDetail";
import MainProvider from "./context/MainProvider";
import Login from "./components/auth/Login";
import Favorites from "./pages/favorites/Favorites";

function App() {
  return (
    <AuthProvider>
      <Router>
        <MainProvider>
          <Routes>
            <Route path="/" element={<Splash />} />
            <Route path="/intro" element={<Intro />} />
            <Route element={<Layout />}>
              <Route path="/Home" element={<Home />} />
              <Route path="/Profil" element={<Profil />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/favorites" element={<Favorites />} />
            </Route>
            <Route path="/login" element={<Login />} />
          </Routes>
        </MainProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;

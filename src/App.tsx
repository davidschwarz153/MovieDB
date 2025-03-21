import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import { BackgroundProvider } from "./context/BackgroundContext";

import Layout from "./layout/Layout";
import Intro from "./pages/intro/Intro";
import Splash from "./pages/splash/Splash";
import Home from "./pages/home/Home";
import Profil from "./pages/profil/Profil";
import MovieDetail from "./components/movieDetail/MovieDetail";
import MainProvider from "./context/MainProvider";
import Login from "./components/auth/Login";
import Favorites from "./pages/favorites/Favorites";
import UserDashboard from "./components/dashboard/UserDashboard";
import Settings from "./pages/settings/Settings";
import UserManagement from "./components/admin/UserManagement";
import Nav from "./components/nav/Nav";

function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <BackgroundProvider>
          <Router>
            <MainProvider>
              <Nav />
              <Routes>
                <Route path="/" element={<Splash />} />
                <Route path="/intro" element={<Intro />} />
                <Route element={<Layout />}>
                  <Route path="/Home" element={<Home />} />
                  <Route path="/Profil" element={<Profil />} />
                  <Route path="/movie/:id" element={<MovieDetail />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/dashboard" element={<UserDashboard />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/admin/users" element={<UserManagement />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </MainProvider>
          </Router>
        </BackgroundProvider>
      </UserProvider>
    </AuthProvider>
  );
}

export default App;

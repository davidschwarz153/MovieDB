import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './index.css';

import Layout from './layout/Layout';
import Intro from './pages/intro/Intro';
import Splash from './pages/splash/Splash';
import Home from './pages/home/Home';
import Profil from './pages/profil/Profil';
import MovieDetail from "./components/movieDetail/MovieDetail";
import MainProvider from "./context/MainProvider";

function App() {
  return (
    <Router>
      <MainProvider>
        <Routes>
          <Route path="/" element={<Splash />} />
          <Route path="/intro" element={<Intro/>}/>
          <Route element={<Layout />}>
            <Route path="/Home" element={<Home/>}/>
            <Route path="/Profil" element={<Profil/>}/>
            <Route path="/movie/:id" element={<MovieDetail />} />
          </Route>
        </Routes>
      </MainProvider>
    </Router>
  );
}

export default App;

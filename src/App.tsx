import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import './index.css';

import Layout from './layout/Layout';
import Intro from './pages/intro/Intro';
import Splash from './pages/splash/Splash';
import Home from './pages/home/Home';
import Profil from './pages/profil/Profil';


export default function App() {
  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route path="/" element={<Splash />} />
        <Route path="/intro" element={<Intro/>}/>
        <Route element={<Layout />}>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/Profil" element={<Profil/>}/>
        </Route>
      </>
    )
  );

  return <RouterProvider router={router} />;
}

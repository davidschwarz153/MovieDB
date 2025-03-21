import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      <Outlet />
      <Nav />
    </div>
  );
}

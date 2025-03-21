import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";

export default function Layout() {
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      {/* Content */}
      <div className="relative z-10 pb-32 ">
        <Outlet />
      </div>
      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <Nav />
      </div>
    </div>
  );
}

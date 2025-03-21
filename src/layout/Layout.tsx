import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";

export default function Layout() {
  return (
    <div className="min-h-screen relative bg-[#0F172A]">
      {/* Content */}
      <div className="relative z-10 pb-24">
        <Outlet />
      </div>
      <Nav />
    </div>
  );
}

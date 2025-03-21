import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";
import { AlertCircle } from "lucide-react";

export default function Layout() {
  return (
<<<<<<< Updated upstream
    <>
      <div className="pb-24">
        <Outlet/>
      </div>
      <Nav/>
    </>
  )
=======
    <div className="min-h-screen relative bg-[#0F172A]">
      {/* Content */}
      <div className="relative z-10">
        <Outlet />
        <Nav />
      </div>
    </div>
  );
>>>>>>> Stashed changes
}

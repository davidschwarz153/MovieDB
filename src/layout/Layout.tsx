import { Outlet } from "react-router-dom";
import Nav from "../components/nav/Nav";

export default function Layout() {
  return (
    <>
      <div className="pb-24">
        <Outlet/>
      </div>
      <Nav/>
    </>
  )
}

import { Link } from "react-router-dom";

export default function Nav() {
  return (
    <nav className="fixed bottom-0 w-full bg-white shadow-md flex justify-between px-20 items-center py-8">
      <Link to="/Home" className="cursor-pointer">
        <img src="/Home.png" alt="Home" />
      </Link>

      <Link to="" className="cursor-pointer">
        <img src="/Vector.png" alt="Search" />
      </Link>

      <Link to="" className="cursor-pointer">
        <img src="/Vector (1).png" alt="Favorites" />
      </Link>

      <Link to="/Profil" className="cursor-pointer">
        <img src="/Profile.png" alt="Profile" />
      </Link>
    </nav>
  );
}

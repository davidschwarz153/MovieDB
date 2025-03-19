import { Link } from "react-router-dom";

export default function Intro() {
    return (
      <section className="h-screen flex flex-col">
        <article className="bg-gradient-to-r from-red-200 to-red-500 h-2/3 flex justify-center items-center overflow-hidden">
          <img className="w-full mt-[300px]" src="/Intro.png" alt="Movie App Preview" />
        </article>
  
        <article className="h-1/3 flex flex-col justify-center items-center px-6 text-center bg-white">
          <h2 className="text-xl font-bold text-gray-900">Enjoy Your Movie </h2>
          <h2 className="text-xl font-bold text-gray-900">Watch Everywhere</h2>
          <p className="text-gray-500 mt-2">
            Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
          </p>
          <Link to="/Home">
            <button className="mt-4 bg-red-500 text-white px-6 py-3 rounded-full font-semibold shadow-md hover:bg-red-600 transition">
                Get Started
            </button>
          </Link>
        </article>
      </section>
    );
  }
  
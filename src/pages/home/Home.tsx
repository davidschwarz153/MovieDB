import SearchCategories from "../../components/searchCategories/SearchCategories";
import Trending from "../../components/trending/Trending";


export default function Home() {
  return (
    <>
    
    <section className="m-10">
        <p className="text-4xl font-bold">Welcome!</p>

    </section>
    <SearchCategories/>
    <Trending/>
    </>
  )
}

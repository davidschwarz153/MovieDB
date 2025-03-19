import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import SearchCategories from "../../components/searchCategories/SearchCategories";
import Trending from "../../components/trending/Trending";

export default function Home() {
    const { isSearching } = useContext(mainContext);

    return (
        <>
            <section className="m-10">
                <p className="text-4xl font-bold">Welcome!</p>
            </section>
            <SearchCategories />
            {!isSearching && <Trending />}
        </>
    );
}

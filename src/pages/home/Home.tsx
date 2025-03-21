import { useContext } from "react";
import { mainContext } from "../../context/MainProvider";
import SearchCategories from "../../components/searchCategories/SearchCategories";
import Trending from "../../components/trending/Trending";
import Header from "../../components/header/Header";

export default function Home() {
  const { isSearching } = useContext(mainContext);

  return (
    <>
      <Header />
      <div className="m-8">
        <SearchCategories />
        {!isSearching && <Trending />}
      </div>
    </>
  );
}

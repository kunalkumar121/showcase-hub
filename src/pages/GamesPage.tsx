import CategoryPage from "./CategoryPage";

const GENRES = ["Action", "Adventure", "Comedy", "Drama", "Sci-Fi", "Fantasy", "Horror"];

export default function GamesPage() {
  return <CategoryPage titleType="videoGame" pageTitle="Video Games" genres={GENRES} />;
}

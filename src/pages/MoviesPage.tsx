import CategoryPage from "./CategoryPage";

const GENRES = ["Action", "Comedy", "Drama", "Horror", "Thriller", "Sci-Fi", "Romance", "Adventure", "Animation", "Crime"];

export default function MoviesPage() {
  return <CategoryPage titleType="MOVIE" pageTitle="Movies" genres={GENRES} />;
}

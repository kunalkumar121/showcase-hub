import CategoryPage from "./CategoryPage";

const GENRES = ["Drama", "Comedy", "Crime", "Action", "Sci-Fi", "Mystery", "Thriller", "Romance", "Fantasy", "Horror"];

export default function TVShowsPage() {
  return <CategoryPage titleType="tvSeries" pageTitle="TV Shows" genres={GENRES} />;
}

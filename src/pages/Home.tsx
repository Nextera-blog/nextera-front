import { ArticleCard } from "../components/ArticleCard";
import { PaginatedArticles } from "../types/api";
import { getArticles } from "../services/articles";
import useFetch from "../hooks/useFetch";
import DataFetchingState from "../components/DataFetchingState";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { SearchBar } from "../components/SearchBar";

export const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTags, setSearchTags] = useState<string[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const {
    loading,
    error,
    data: paginatedData,
    refetch,
  } = useFetch<PaginatedArticles>(
    getArticles,
    currentPage,
    searchQuery,
    searchTags
  );

  const articles = paginatedData?.results || [];
  const pageCount = paginatedData ? Math.ceil(paginatedData.count / 10) : 0;

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(event.selected + 1); // react-paginate uses a base index of 0, the API a base index of 1
  };

  const handleSearch = (newSearchQuery: string, newSearchTags: string[]) => {
    setSearchQuery(newSearchQuery);
    setSearchTags(newSearchTags);
    setCurrentPage(1);
    setHasSearched(true);
    setShowSearchBar(false);
  };

  useEffect(() => {
    if (!searchQuery && searchTags.length === 0) {
      setHasSearched(false);
    }
  }, [searchQuery, searchTags]);

  // LEAVE THAT HERE FOR DEVELOP (reminder) :
  // useEffect(() => {
  //   // refetch is automatically called by useFetch when currentPage changes (so no need to call it explicitly here) ; the [currentPage] dependency in useFetch handles this
  // }, [currentPage]);

  // console.log("Articles in Home : ", articles);
  // console.log("Number of articles in Home : ", articles.length);
  // console.log("Number of pages : ", pageCount);

  return (
    <DataFetchingState loading={loading} error={error}>
      <main className="p-4 flex flex-col items-center grow h-5/6 overflow-hidden">
        <h1 className="mb-10">Bienvenue sur Nextera Blog !</h1>

        {!showSearchBar ? (
          <button
            onClick={() => setShowSearchBar(true)}
            className="mb-8"
          >
            Lancer une recherche
          </button>
        ) : (
          <SearchBar onSearch={handleSearch} />
        )}

        {articles && articles.length > 0 ? (
          <>
            <section className="w-full grid grid-cols-1 gap-y-5 overflow-y-auto md:max-h-full  md:w-7xl md:grid-cols-2 md:gap-x-10">
              {articles.map((article) => (
                <ArticleCard
                  articleId={article.article_id}
                  title={article.title}
                  content={article.content}
                  creationDate={article.creation_date}
                  author={article.author}
                  tags={article.tags}
                  article_reactions={article.article_reactions}
                  key={article.article_id}
                />
              ))}
            </section>
            {pageCount > 1 && ( // Shwo pagination only if there is more than 1 page
              <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
                containerClassName="pagination"
                pageClassName="page-item"
                pageLinkClassName="page-link"
                previousClassName="page-item"
                previousLinkClassName="page-link"
                nextClassName="page-item"
                nextLinkClassName="page-link"
                breakClassName="page-item"
                breakLinkClassName="page-link"
                activeClassName="active"
                forcePage={currentPage - 1}
              />
            )}
          </>
        ) :
        !loading && hasSearched ? (
          <p className="text-center">Aucun résultat pour cette recherche.</p>
        ) : (
          !loading && <p className="text-center">Aucun post pour le moment</p>
        )}
      </main>
    </DataFetchingState>
  );
};

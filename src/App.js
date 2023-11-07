import React, { useState, useEffect, useCallback } from "react";

import MoviesList from "./components/MoviesList";
import AddMovie from "./components/AddMovie";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "https://crudcrud.com/api/cafa51acd80746309a31f6dd762f04b8/movies"
      );
      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();
     
      const MoviesArr = [];
         for (const key in data) {
         
          MoviesArr.push({
            id:data[key]._id,
            title:data[key].title,
            openingText:data[key].openingText,
            releaseDate:data[key].releaseDate,
            
          },);
         }
      setMovies(MoviesArr);
    } catch (error) {
      setError(error.message);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
  }, [fetchMoviesHandler]);

   async function addMovieHandler(movie) {
    
     const response =  await fetch('https://crudcrud.com/api/cafa51acd80746309a31f6dd762f04b8/movies',{
      method:'POST',
      body:JSON.stringify(movie),
      headers: {
        'Content-Type': 'application/json',
      },
     });
     const data = await response.json();
    
  }

  let content = <p>Found no movies.</p>;

  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }

  if (error) {
    content = <p>{error}</p>;
  }

  if (isLoading) {
    content = <p>Loading...</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;

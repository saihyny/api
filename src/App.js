import React, { useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isCanceling, setIsCanceling] = useState(false);
  async function FetchMoviesHan() {
    if (isCanceling) {
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/album"
      );
      if (response.status === 404) {
        throw new Error("Something went wrong ....Retrying");
      }
      const data = await response.json();
      setLoading(false);
      const MoviesList = data.map((moviesdata) => {
        return {
          id: moviesdata.id,
          title: moviesdata.title,
        };
      });
      setMovies(MoviesList);
    } catch (error) {
      setError(error.message);
    }
  }
  const handleCancel=()=> {
    setIsCanceling(true);
    
  }

  return (
    <React.Fragment>
      <section>
        <button onClick={FetchMoviesHan}>Fetch Movies</button>
      </section>
      <section>
        {loading && !error && (
          <h2>Movies are loading please wait for some time</h2>
        )}
        {loading && error && (
          <>
            <p>{error}</p>
            <button onClick={handleCancel}>cancel</button>
          </>
        )}
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;

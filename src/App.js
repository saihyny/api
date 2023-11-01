import React,{useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setMovies] = useState([])
  const FetchMoviesHan =()=>{
    fetch('https://swapi.dve/api/films/')
    .then((response)=>{
      return response.json();
    })
    .then((data)=>{
      const MoviesList = data.results.map(moviesdata=>{
        return {
          id:moviesdata.episode_id,
          title:moviesdata.title,
          openingText:moviesdata.opening_crawl,
          releaseDate:moviesdata.release_date
        };
      })
      setMovies(MoviesList)
    })
    
  }


  return (
    <React.Fragment>
      <section>
        <button onClick={FetchMoviesHan}>Fetch Movies</button>
      </section>
      <section>
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;

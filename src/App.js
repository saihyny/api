import React,{useState} from 'react';

import MoviesList from './components/MoviesList';
import './App.css';

function App() {
  const [movies,setMovies] = useState([])
  const [loading, setLoading] = useState(false);
 
  async function FetchMoviesHan () {
    setLoading(true)
  const response =  await fetch('https://jsonplaceholder.typicode.com/albums');
  const data =  await response.json();
     setLoading(false)
      const MoviesList = data.map((moviesdata)=>{
        return {
          id:moviesdata.id,
          title:moviesdata.title,
        };
      })
      setMovies(MoviesList)
  }


  return (
    <React.Fragment>
      <section>
        <button onClick={FetchMoviesHan}>Fetch Movies</button>
      </section>
      <section>
        {loading && <h2>Movies are loading please wait for some time</h2>}
        <MoviesList movies={movies} />
      </section>
    </React.Fragment>
  );
}

export default App;

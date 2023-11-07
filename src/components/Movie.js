import React,{useState} from 'react';

import classes from './Movie.module.css';


const Movie = (props) => {
  
  const DeleteMovie = (id)=>{
    // here i need id but i cant getting the id
    // const url = `https://crudcrud.com/api/cf76091dba364702acac3f116396379d/movies/${id}`
    //  fetch(url,{ method:'DELETE'})
    console.log(id)
  }
  return (
    <li className={classes.movie}>
      <h2>{props.title}</h2>
      <h3>{props.releaseDate}</h3>
      <p>{props.openingText}</p>
      <button onClick={()=>{DeleteMovie(props.id)}}>delete</button>
    </li>
  );
};

export default Movie;

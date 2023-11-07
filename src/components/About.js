import React,{useRef,useState} from 'react'
import classes from './AddMovie.module.css';
const About=(props)=> {
    const [text,setText] = useState('please add feilds')
    const nameRef = useRef('');
    const emailRef = useRef('');
    const numberRef = useRef('');
    
    const submitHandler = (e)=>{
        e.preventDefault();
        const UserDetails = {
            name:nameRef.current.value,
            email:emailRef.current.value,
            number:numberRef.current.value,
        }
       fetch('https://crudcrud.com/api/cafa51acd80746309a31f6dd762f04b8/users',{
        method:'POST',
        body:JSON.stringify(UserDetails),
        headers:{
         'Content-Type': 'application/json',
        }
       }).then((response)=>{

        if(response.status===201)
        {
            nameRef.current.value=''
            emailRef.current.value=''
            numberRef.current.value=''
            setText('thanks for submitting')
        }
          console.log(response)
       }).catch((error)=>{
         console.log(error)
       })

    }
  return (
    <div style={{backgroundColor:'pink'}} >
    <form onSubmit={submitHandler}>
    <div className={classes.control}>
      <label htmlFor='title'>Name</label>
      <input type='text' id='title' ref={nameRef} />
    </div>
    <div className={classes.control}>
      <label htmlFor='title'>Email</label>
      <input type='email' id='title' ref={emailRef} />
    </div>
    <div className={classes.control}>
      <label htmlFor='title'>PhoneNumber</label>
      <input type='number' id='title' ref={numberRef} />
    </div>
    {text}
    <button>Submit</button>
    
  </form>
  </div>
  )
}

export default About
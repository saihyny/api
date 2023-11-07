import React from 'react';
import ReactDOM from 'react-dom/client';
import {BrowserRouter,Link,Route, Routes} from 'react-router-dom'
import './index.css';
import App from './App';
import About from './components/About';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
<BrowserRouter>
<nav style={{textAlign:'center'}}>
    <Link to='/' style={{ marginRight: '10px' }}>Home</Link>
    
    <Link to='/About' style={{ marginRight: '10px' }}>About</Link>
</nav>
    <Routes>
      <Route path='/' element={<App />}/>
      <Route path='/About' element={<About />}/>
    </Routes>
  </BrowserRouter>

);


import './App.css'
import './responsive.css'
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';  

import Home from './Home.jsx';  
import SearchPage from './Search.jsx';
import ExplorePage from './Explore.jsx';

import About from './About.jsx';
import Destinations from './Destinations.jsx';
import Login from './Login.jsx';
import SignUp from './Signup.jsx';
import { Routes, Route } from 'react-router-dom';



function App() {

  return (
    <>
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />     
        <Route path='/Search' element={<SearchPage/>} />
        <Route path='/Explore' element={<ExplorePage/>} />
       <Route path='/about' element={<About/>} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} /> 
        <Route path='/destinations' element={<Destinations />} />
        
      </Routes>
      
      <Footer />
    </>
  )
}

export default App

import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import AdminPanel from './components/AdminPanel';
import GamePage from './components/GamePage';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import SearchResults from './components/SearchResults';
import CategoryPage from './components/CategoryPage';
import NotFound from './components/NotFound';
import AboutUs from './components/AboutUs';
import SubmitAGame from './components/SubmitAGame';
import TermsOfUse from './components/TermsOfUse';
import './css/app.css';

function App() {
  const location = useLocation();

  // Define paths where you don't want to show the NavBar and Footer
  const hideNavAndFooter = location.pathname === '/admin';

  return (
    <div className="App">
      {!hideNavAndFooter && <Navbar />} {/* Conditionally render NavBar */}

      <Routes>
        {/* Route for AdminPanel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Default route */}
        <Route path="/" element={<HomePage/>}/>

        {/* Route for Game Page */}
        <Route path="/game/:gameName" element={<GamePage />} />

        <Route path="/search" element={<SearchResults />} />

        <Route path="/category/:category" element={<CategoryPage />} />

        <Route path="/submit-a-game" element={<SubmitAGame/>}/>

        <Route path="/about-us" element={<AboutUs/>}/>

        <Route path="/terms" element={<TermsOfUse/>}/>


        <Route path="*" element={<NotFound/>}/>

      </Routes>

      {!hideNavAndFooter && <Footer />} {/* Conditionally render Footer */}
    </div>
  );
}

export default App;

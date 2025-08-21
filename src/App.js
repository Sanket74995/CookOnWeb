import React, { useState } from 'react';
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  const [currentPage, setCurrentPage] = useState('home');

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <Register />;
      case 'login':
        return <Login />;
      case 'home':
      default:
        return <Hero />;
    }
  };

  return (
    <div className="App">
      <Navbar onNavigate={handleNavigate} />
      {renderPage()}
    </div>
  );
}

export default App;

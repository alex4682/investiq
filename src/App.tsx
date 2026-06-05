import React from 'react';
import LoginPage from './components/LoginPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {lazy} from 'react';

const LogIn = lazy(() => import('./components/LoginPage'));
const Home = lazy(()=> import('./components/Home'));

function App() {

  return (
    <>
      <Router >
        <Routes>
          <Route path="" element={<LogIn />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      </Router>
    </>
  )
}

export default App

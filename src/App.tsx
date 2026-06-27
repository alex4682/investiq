import  { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const LoginPage = lazy(() => import('./components/LoginPage'));
const Home = lazy(() => import('./components/Home'));
const Charts = lazy(()=> import('./components/Charts'));

function App() {
  return (
    <Router>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/charts" element={<Charts/>}/>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App

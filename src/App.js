import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Login';
import Quiz from './Components/Quiz';
import Result from './Components/Result';
import Layout from './Components/Layout';
import Authenticate from './Components/Authenticate';
import Topics from './Components/Topics'; // Import the Topics component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route element={<Authenticate />}>
          <Route path="/" element={<Layout />}>
            <Route path='/topics' element={<Topics />} /> {/* New route for Topics */}
            <Route path='/quiz/:category' element={<Quiz />} /> {/* Updated route for Quiz */}
            <Route path='/result' element={<Result />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

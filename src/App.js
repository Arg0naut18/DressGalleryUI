import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import Gallery from './components/Gallery';


function App() {
  return (
    <div className="App">
      <Routes>
          <Route exact path="/login" element={<Login/>}/>
          <Route exact path="/register" element={<Register/>}/>
          <Route exact path="/home" element={<Gallery/>}/>
          <Route exact path="/" element={<Login/>}/>
      </Routes>
    </div>
  );
}

export default App;

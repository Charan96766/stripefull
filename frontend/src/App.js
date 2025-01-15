import './App.css';
import Products from "./components/Products";
import { BrowserRouter,Route,Routes } from 'react-router-dom';
import Success from './components/Success';
import Cancel from './components/Cancel';


function App() {
  return (
    <div className="App">  
      
      {/* <Products/> */} 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Products/>}></Route>
          <Route path="/success" element={<Success/>}></Route> 
          <Route path="/cancel" element={<Cancel/>}></Route>
       </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App; 




import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter,Routes,Route } from 'react-router-dom';
import ShopCategory from './Pages/ShopCategory';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Shop from './Pages/Shop';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Assets/menbanner.jpg'
import women_banner from './Components/Assets/womenonsale.jpg'
import kid_banner from './Components/Assets/kidonsale.jpg'
function App() {
  return (
    <div>
     <BrowserRouter>
       <Navbar />
       <Routes>
          <Route path="/" element={<Shop category="men"/>}></Route>
          <Route path="/mens" element={<ShopCategory  banner ={ men_banner} category="men"/>}></Route>
          <Route path="/women" element={<ShopCategory   banner ={ women_banner} category="women"/>}></Route>
          <Route path="/kids" element={<ShopCategory   banner ={kid_banner} category="kid"/>}></Route>

          <Route path="/product" element={<Product/>}>
            <Route path=':productId' element={<Product/>} />
          </Route>
          
          <Route path='/cart' element={<Cart/>}/>
          <Route path='/signup' element={<Signup/>}/>
         <Route path='/login' element={<Login/>}/>
        
       </Routes>

       <Footer />
     </BrowserRouter>
    

    </div>
  );
}

export default App;

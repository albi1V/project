import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserEntry from './components/userentry/userentry';
import LoginPage from './components/login/login';
import Registration from './components/registration/registration';
import Farmerlanding from './components/farmer/farmerlanding';
import Sellerlanding from './components/seller/sellerlanding';
import AddProduct from './components/seller/addproduct';
import Sellerprofile from './components/seller/slrprofile';

import Footer from './components/footer/footer';
import Header from './components/header/header';
import ForgotPasswordPage from './components/forgotpasssword/forgotpwrd';
import ResetPasswordPage from './components/forgotpasssword/resetpass';
import './App.css';
import FarmerProfile from './components/farmer/profile';
import EditProfile from './components/farmer/editprofile';
import AddBlog from './components/farmer/addblog';
import ViewBlogs from './components/farmer/viewblog';
import EditBlog from './components/farmer/editBlog';
import EditProduct from './components/seller/editproduct';
import ViewAllProducts from './components/products/viewallproducts';
import ProductDetails from './components/products/productdetails';
import Cart from './components/farmer/cart';
import ReqWaste from './components/farmer/requestforwaste';
import ReqHeMade from './components/farmer/requestHemade';
import ViewTrend from './components/farmer/trendview';
import ReqSell from './components/farmer/trendReqForsell';



import AdminLan from './components/admin/adminlan';
import AddScheme from './components/admin/scheme';
import ViewScheme from './components/admin/adviewscheme';
import EditScheme from './components/admin/editschme';
import FarmerViewSchemes from './components/admin/fmrviewscheme';
import WasteRequest from './components/admin/wasterequest';
import TrendAdd from './components/admin/trendadd';
import TendPurch from './components/admin/tendPurchReq';
import AdminUserControle from './components/admin/userControle';


const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<UserEntry />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Registration />}/>
          <Route path="/profile" element={<FarmerProfile />}/>
          <Route path="/farmer-landing" element={<Farmerlanding />}/>
          <Route path="/seller-landing" element={<Sellerlanding />}/>
          <Route path="/footer" element={<Footer />}/>
          <Route path="/header" element={<Header />}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />}/>
          <Route path="/edit-profile" element={<EditProfile />}/>
          <Route path="/add-blog" element={<AddBlog />} />
          <Route path="/view-all-blogs" element={<ViewBlogs />} />
          <Route path="/edit-blog/:blogId" element={<EditBlog />} />
          <Route path="/request-for-waste" element={<ReqWaste />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/requestHemade" element={<ReqHeMade />} />
          <Route path="/FarmerViewSchemes" element={<FarmerViewSchemes />} />
          <Route path="/trendview" element={<ViewTrend />} />  
          <Route path="/trendReqForsell" element={<ReqSell />} />
          

          <Route path="/add-products" element={<AddProduct />}/>
          <Route path="/seller-profile" element={<Sellerprofile />}/>
          <Route path="/edit-product/:productId" element={<EditProduct/>} />
          <Route path="/view-all-products" element={<ViewAllProducts/>} />
          <Route path="/productDetails/:id" element={<ProductDetails />} />
          
          <Route path="/adminlan" element={<AdminLan />} />
          <Route path="/addscheme" element={<AddScheme />} />
          <Route path="/adviewscheme" element={<ViewScheme />} />
          <Route path="/editscheme/:schemeId" element={<EditScheme />} />         
          <Route path="/WasteRequest" element={<WasteRequest />} />
          <Route path="/trendadd" element={<TrendAdd/>} /> 
          <Route path="/tendpurch" element={<TendPurch/>} /> 
          <Route path="/user-controle" element={<AdminUserControle />} />


        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

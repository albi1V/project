import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UserEntry from './components/userentry/userentry';
import LoginPage from './components/login/login';
import Registration from './components/registration/registration';
import Farmerlanding from './components/farmer/farmerlanding';
import Sellerlanding from './components/seller/sellerlanding';
import Footer from './components/footer/footer';
import Header from './components/header/header';
import ForgotPasswordPage from './components/forgotpasssword/forgotpwrd';
import ResetPasswordPage from './components/forgotpasssword/resetpass';
import './App.css';
import FarmerProfile from './components/farmer/farmer_profile';


const App = () => {
  return (
    <div className="app">
      <BrowserRouter>
        <Routes>
          {/* Home or User Entry Route */}
          <Route path="/" element={<UserEntry />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Registration />}/>
          <Route path="/farmer-profile" element={<FarmerProfile />}/>
          <Route path="/farmer-landing" element={<Farmerlanding />}/>
          <Route path="/seller-landing" element={<Sellerlanding />}/>
          <Route path="/footer" element={<Footer />}/>
          <Route path="/header" element={<Header />}/>
          <Route path="/forgot-password" element={<ForgotPasswordPage />}/>
          <Route path="/reset-password/:token" element={<ResetPasswordPage />}/>
          

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;

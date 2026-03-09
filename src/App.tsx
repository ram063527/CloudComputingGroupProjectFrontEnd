import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KeycloakProvider } from './auth/KeycloakContext';
import { CartProvider } from './auth/CartContext';
import { HomePage } from './pages/HomePage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { Navbar } from './components/Navbar';
import { CartDrawer } from './components/CartDrawer';

export default function App() {
  return (
    <KeycloakProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <CartDrawer />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book/:code" element={<BookDetailsPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </KeycloakProvider>
  );
}

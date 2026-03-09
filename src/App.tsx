import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { KeycloakProvider } from './auth/KeycloakContext';
import { CartProvider } from './auth/CartContext';
import { HomePage } from './pages/HomePage';
import { BookDetailsPage } from './pages/BookDetailsPage';
import { CartPage } from './pages/CartPage';
import { Navbar } from './components/Navbar';

export default function App() {
  return (
    <KeycloakProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/book/:code" element={<BookDetailsPage />} />
              <Route path="/cart" element={<CartPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </CartProvider>
    </KeycloakProvider>
  );
}

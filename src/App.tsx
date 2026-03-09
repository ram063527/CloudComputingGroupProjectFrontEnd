/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KeycloakProvider } from './auth/KeycloakContext';
import { CartProvider } from './auth/CartContext';
import { HomePage } from './pages/HomePage';

export default function App() {
  return (
    <KeycloakProvider>
      <CartProvider>
        <HomePage />
      </CartProvider>
    </KeycloakProvider>
  );
}


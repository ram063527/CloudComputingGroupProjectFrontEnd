import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Keycloak from 'keycloak-js';
import { setAuthToken } from '../api/axios';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  initialized: boolean;
  login: () => void;
  logout: () => void;
  token: string | undefined;
  profile: any | null;
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
  initialized: false,
  login: () => {},
  logout: () => {},
  token: undefined,
  profile: null,
});

export const useKeycloak = () => useContext(KeycloakContext);

interface KeycloakProviderProps {
  children: ReactNode;
}

let keycloakInstance: Keycloak | null = null;

export const KeycloakProvider: React.FC<KeycloakProviderProps> = ({ children }) => {
  const [keycloak, setKeycloak] = useState<Keycloak | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    if (keycloakInstance) return;

    const kc = new Keycloak({
      url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:9191',
      realm: import.meta.env.VITE_KEYCLOAK_REALM || 'mylabs',
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'bookstore-frontend',
    });
    
    // Set instance immediately to prevent double-initialization in React Strict Mode
    // which causes the Keycloak infinite refresh loop
    keycloakInstance = kc;

    const initKeycloak = async () => {
      try {
        const auth = await kc.init({
          pkceMethod: 'S256',
          checkLoginIframe: false, // Important for environments where iframe checking fails
        });
        
        setAuthenticated(auth);
        setKeycloak(kc);

        if (auth) {
          setAuthToken(kc.token);
          const userProfile = await kc.loadUserProfile();
          setProfile(userProfile);
        }

        kc.onTokenExpired = () => {
          kc.updateToken(30).then(() => {
            setAuthToken(kc.token);
          }).catch(() => {
            console.error('Failed to refresh token');
            setAuthenticated(false);
            setAuthToken(undefined);
          });
        };
      } catch (error) {
        console.error('Keycloak init failed', error);
        // Even if init fails (e.g. due to network), set the instance so login can be attempted
        setKeycloak(kc);
      } finally {
        setInitialized(true);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) {
      keycloak.login().catch(err => console.error("Login failed", err));
    } else {
      alert("Authentication service is initializing or unavailable. Please try again.");
    }
  };

  const logout = () => {
    if (keycloak) {
      keycloak.logout().catch(err => console.error("Logout failed", err));
    }
  };

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, initialized, login, logout, token: keycloak?.token, profile }}>
      {children}
    </KeycloakContext.Provider>
  );
};

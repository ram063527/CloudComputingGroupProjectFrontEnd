import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import Keycloak from 'keycloak-js';

interface KeycloakContextType {
  keycloak: Keycloak | null;
  authenticated: boolean;
  login: () => void;
  logout: () => void;
  token: string | undefined;
  profile: any | null;
}

const KeycloakContext = createContext<KeycloakContextType>({
  keycloak: null,
  authenticated: false,
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
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    if (keycloakInstance) return;

    const initKeycloak = async () => {
      const kc = new Keycloak({
        url: import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:9191',
        realm: import.meta.env.VITE_KEYCLOAK_REALM || 'master',
        clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'frontend-client',
      });

      try {
        const auth = await kc.init({
          onLoad: 'check-sso',
          silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
          pkceMethod: 'S256',
        });
        
        setAuthenticated(auth);
        setKeycloak(kc);
        keycloakInstance = kc;

        if (auth) {
          const userProfile = await kc.loadUserProfile();
          setProfile(userProfile);
        }

        kc.onTokenExpired = () => {
          kc.updateToken(30).catch(() => {
            console.error('Failed to refresh token');
            setAuthenticated(false);
          });
        };
      } catch (error) {
        console.error('Keycloak init failed', error);
      }
    };

    initKeycloak();
  }, []);

  const login = () => {
    if (keycloak) keycloak.login();
  };

  const logout = () => {
    if (keycloak) keycloak.logout();
  };

  return (
    <KeycloakContext.Provider value={{ keycloak, authenticated, login, logout, token: keycloak?.token, profile }}>
      {children}
    </KeycloakContext.Provider>
  );
};

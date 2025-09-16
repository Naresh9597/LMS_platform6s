import React, { createContext, useContext, useEffect, useState } from 'react';
import { users } from '../data/mock.js';

const RoleContext = createContext();

/**
 * RoleProvider wraps the app and manages session state.
 * Stores session in sessionStorage so it persists across page reloads.
 */
export const RoleProvider = ({ children }) => {
  const [session, setSession] = useState(() => {
    const raw = sessionStorage.getItem('session');
    return raw ? JSON.parse(raw) : null;
  });

  // Persist session to sessionStorage whenever it changes
  useEffect(() => {
    if (session) {
      sessionStorage.setItem('session', JSON.stringify(session));
    } else {
      sessionStorage.removeItem('session');
    }
  }, [session]);

  // Login: validate credentials and set session
  const login = (username, password, role) => {
    const user = users.find(
      u => u.username === username && u.password === password && u.role === role
    );
    if (!user) return false;

    setSession({ username: user.username, role: user.role, name: user.name });
    return true;
  };

  // Logout: clear session
  const logout = () => setSession(null);

  // Switch role: re-authenticate with different role
  const switchRole = (username, password, newRole) => {
    return login(username, password, newRole);
  };

  return (
    <RoleContext.Provider value={{ session, login, logout, switchRole }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to access RoleContext
export const useAuth = () => useContext(RoleContext);

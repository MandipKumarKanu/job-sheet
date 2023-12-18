import { createContext, useContext, useState, useEffect } from "react";
import { useFirebase } from "./firebaseContext";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { signInWithEmailAndPassword } = useFirebase();
  const [user, setUser] = useState(null);
  const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || null);
  const [authenticated, setAuthenticated] = useState(false); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedAuthToken = localStorage.getItem("authToken");

        if (storedAuthToken) {
          setAuthToken(storedAuthToken);
          setAuthenticated(true); // Set authenticated to true when token is present
          setLoading(false);
        } else {
          setAuthenticated(false); // Set authenticated to false when token is not present
          setLoading(false);
        }
      } catch (error) {
        console.error("Error checking authentication:", error.message);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const userData = await signInWithEmailAndPassword(email, password);
      const newAuthToken = await userData.user.getIdToken();
      setAuthToken(newAuthToken);
      localStorage.setItem("authToken", newAuthToken);
      setUser(userData.user);
      setAuthenticated(true);
    } catch (error) {
      console.error("Error during login:", error.message);
      setAuthenticated(false);
      throw error;
    }
  };

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("authToken");
    setUser(null);
    setAuthenticated(false);
  };

  const value = {
    user,
    authToken,
    authenticated,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export {  AuthContext }; 
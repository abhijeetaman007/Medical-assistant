import React, {
    useContext,
    createContext,
    useState,
    useEffect,
} from 'react';
import { post } from '../utils/requests';
import { useHistory } from 'react-router-dom';
import jwt from 'jwt-decode';
import { TOKEN_ID } from "../utils/constants"
  
const AuthContext = createContext(null);
  
export const useAuth = () => {
    return useContext(AuthContext);
};
  
export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
    
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_ID);
    if (token) setUser(jwt(token))
    setLoading(false);
  }, []);
  
  const login = async (email, password) => {
    try {
      const res = await post('/auth/login', {
        email: email.trim(),
        password,
      });
      setUser(jwt(res.token));
      localStorage.setItem(TOKEN_ID, res.token);
      history.replace('/');
    } catch (err) {
        throw err;
    }
  };
  
  const register = async (name, username, email, password) => {
    try {
      await post('/auth/register', {
        name,
        username,
        email: email.trim().toLowerCase(),
        password,
      });
      history.replace('/login');
    } catch (err) {
      throw err;
    }
  };
  
  const logout = async () => {
    try {
      setUser(null);
      history.replace('/');
      localStorage.removeItem(TOKEN_ID);
    } catch (err) {
      throw err;
    }
  };

  const value = {
    user,
    login,
    logout,
    register,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
  
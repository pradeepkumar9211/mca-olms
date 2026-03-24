import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    // on app load check if token exists in localStorage
    // keeps user logged in on page refresh
    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");
        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setRole(JSON.parse(savedUser).role);
        }
        setLoading(false);
    }, []);

    const login = (userData, userToken) => {
        setUser(userData);
        setToken(userToken);
        setRole(userData.role);
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setRole(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider value={{ user, token, role, loading, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

// custom hook -- use this in every component that needs auth
export function useAuth() {
    return useContext(AuthContext);
}
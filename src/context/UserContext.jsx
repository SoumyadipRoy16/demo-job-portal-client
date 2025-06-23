import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

const userContext = React.createContext();

const UserContext = ({ children }) => {
    const [userLoading, setUserLoading] = useState(true);
    const [userError, setUserError] = useState({ status: false, message: "" });
    const [user, setUser] = useState(null); // ✅ null means unauthenticated

    const handleFetchMe = async () => {
        setUserLoading(true);
        try {
            const response = await axios.get(
                `https://demo-job-portal-server.vercel.app/api/v1/auth/me`,
                {
                    withCredentials: true,
                }
            );
            setUserError({ status: false, message: "" });
            setUser(response?.data?.result); // ✅ user object from backend
        } catch (error) {
            setUserError({
                status: true,
                message: error?.response?.data?.message || "Unauthorized",
            });
            setUser(null); // ✅ Ensure user is null if auth fails
        }
        setUserLoading(false);
    };

    useEffect(() => {
        handleFetchMe();
    }, []);

    const contextValue = {
        userLoading,
        userError,
        user,
        setUser,
        handleFetchMe,
    };

    return (
        <userContext.Provider value={contextValue}>
            {children}
        </userContext.Provider>
    );
};

const useUserContext = () => useContext(userContext);

export { useUserContext, UserContext };

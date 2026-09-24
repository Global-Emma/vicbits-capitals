"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import api from "./axios"; // Adjust path if needed
import { AppContext } from "./AppContext";

const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [services, setServices] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true); // Default to true while initial data fetches
  const [error, setError] = useState(null);

  const router = useRouter();

  // ==========================================
  // INITIAL APP DATA LOAD (ON MOUNT)
  // ==========================================
  const fetchInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("accessToken");

    try {
      // 1. Prepare parallel API requests
      const requests = [
        api.get("/api/services").catch((err) => ({ error: err, type: "services" })),
        api.get("/api/projects").catch((err) => ({ error: err, type: "projects" })),
      ];

      // Only fetch user profile if an access token exists in storage
      if (token) {
        requests.push(
          api.get("/api/auth/profile").catch((err) => ({ error: err, type: "profile" }))
        );
      }

      const results = await Promise.all(requests);

      // Process Services Response
      if (results[0] && !results[0].error) {
        setServices(results[0].data?.data || []);
      }

      // Process Projects Response
      if (results[1] && !results[1].error) {
        setProjects(results[1].data?.data || []);
      }

      // Process User Profile Response
      if (results[2]) {
        if (!results[2].error) {
          setUser(results[2].data?.data || null);
        } else {
          // If token was invalid or expired during initial check
          localStorage.removeItem("accessToken");
          localStorage.removeItem("login");
          setUser(null);
        }
      }
    } catch (err) {
      console.error("❌ Error initializing app context:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      if (!isMounted) return;
      await fetchInitialData();
    };

    void initialize();

    return () => {
      isMounted = false;
    };
  }, [fetchInitialData]);

  // ==========================================
  // LOGIN HANDLER
  // ==========================================
  const login = async (credentials) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post("/api/auth/login", credentials);

      if (response.data.success) {
        const { accessToken, user: userData } = response.data;

        // Save Auth Session
        localStorage.setItem("accessToken", JSON.stringify(accessToken));
        localStorage.setItem("login", "true");

        // Update Context State
        setUser(userData);

        // Client-side Navigation
        router.push("/");
        return { success: true };
      }
    } catch (err) {
      let errorMessage = "An error occurred during login.";

      if (isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      }

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOGOUT HANDLER
  // ==========================================
  const logout = async () => {
    setLoading(true);
    try {
      await api.post("/api/auth/logout");
    } catch (err) {
      console.error("Logout endpoint error:", err);
    } finally {
      // Clear client state regardless of server response
      localStorage.removeItem("accessToken");
      localStorage.removeItem("login");
      setUser(null);
      setError(null);
      setLoading(false);

      // Navigate to login page
      router.push("/sign-in");
    }
  };

  // Helper function to update profile state after edits
  const updateUserState = (updatedUser) => {
    setUser((prev) => ({ ...prev, ...updatedUser }));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        projects,
        services,
        loading,
        error,
        login,
        logout,
        setError,
        updateUserState,
        refetchData: fetchInitialData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { BASE_URL } from "../config/BaseURL";

const ProtectedRoutes = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null); // ✅ Use `null` initially

  const handleAuthUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/auth/user`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Not authenticated");
      }

      const data = await res.json();
      console.log("response : ", data);

      setIsAuth(data.message === "Authenticated");
    } catch (error) {
      console.error("Authentication Error:", error);
      setIsAuth(false);
    }
  };

  useEffect(() => {
    handleAuthUser();
  }, []);

  // ✅ Show a loading state before deciding where to navigate
  if (isAuth === null) {
    return <h1>Loading...</h1>;
  }

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;

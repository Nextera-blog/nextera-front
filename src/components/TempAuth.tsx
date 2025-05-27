// TO DELETE - temporary file for debugging

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const TempAuth = () => {
  const { isLoggedIn, user } = useAuth();
  const location = useLocation();

  const userId = user?.id;
  const userRole = user?.role?.role_name;

  // useEffect(() => {
  //     console.log('Données d\'authentification : ', { isLoggedIn, userId });
  // }, [isLoggedIn, userId]);

  useEffect(() => {
    console.log(`État d'authentification pour [${location.pathname}] :`, {
      isLoggedIn,
      userId,
      userRole,
    });
  }, [isLoggedIn, userId, userRole, location.pathname]);

  return null;
};

export default TempAuth;

// TO DELETE - temporary file for debugging

import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const TempAuth = () => {
  const { isLoggedIn, userId } = useAuth();
  const location = useLocation();

  // useEffect(() => {
  //     console.log('Données d\'authentification : ', { isLoggedIn, userId });
  // }, [isLoggedIn, userId]);

  useEffect(() => {
    console.log(`État d'authentification pour [${location.pathname}] :`, {
      isLoggedIn,
      userId,
    });
  }, [isLoggedIn, userId, location.pathname]);

  return null;
};

export default TempAuth;

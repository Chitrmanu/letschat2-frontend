import React, { FC, useState } from "react";
import AuthSignIn from "./AuthSignIn";
import AuthSignUp from "./AuthSignUp";
import styles from "../../styles/auth.module.scss";

type AuthOverviewProps = {
  authMode: string;
  setAuthMode: (mode: string) => void;
  showAuth: boolean;
  setShowAuth: (show: boolean) => void;
};

const AuthOverview: FC<AuthOverviewProps> = ({
  authMode,
  setAuthMode,
  showAuth,
  setShowAuth,
}) => {
  return (
  <div className={styles.authContainer}>
    {authMode === "signin" && showAuth === true ? 
    ( <AuthSignIn setShowAuth={setShowAuth} setAuthMode={setAuthMode} /> ) :
    null}
    {authMode === "signup" && showAuth === true ? 
    ( <AuthSignUp setShowAuth={setShowAuth} setAuthMode={setAuthMode} /> ) : 
    null}
  </div>);
};

export default AuthOverview;

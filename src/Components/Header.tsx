import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "../styles/header.module.scss";
import AuthOverview from "./authentication/AuthOverview";
import Cookies from "js-cookie";
import { fetchAPI } from "../utils/Api";
import Router from "next/router";
function Header() {
  const useRouter = Router;
  const [userdata, setUserData] = useState(null);
  const [authMode, setAuthMode] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("userData");
    console.log(data);
    if (data && data !== null && data !== undefined) {
      setUserData(JSON.parse(data));
    }
  }, []);
  const logout = async () => {
    try {
      const response: any = await fetchAPI("/users/logout", "POST", {});
      const data = await response.data;
      console.log(data);
      useRouter.reload();
    } catch (error) {
      console.log(error);
    }
    localStorage.removeItem("userData");
    setUserData(null);
    Cookies.remove("token");
  };
  return (
    <div className={styles.header}>
      <Image
        style={{
          borderRadius: "9999%",
          marginTop: "2px",
        }}
        width={65}
        height={65}
        src="/letschatLOGO.jpg"
        alt=""
      />
      <div className={styles.heading}>
        <h3>Let&apos;s Chat</h3>
        <p>A place where everyone can open up</p>
      </div>
      <div
        className={`${userdata ? styles.displayNone : styles.signInLogout}`}
        onClick={() => {
          setAuthMode("signin");
          setShowAuth(true);
        }}
      >
        Sign In
      </div>
      <div
        className={`${userdata ? styles.signInLogout : styles.displayNone}`}
        onClick={() => {
          logout();
        }}
      >
        Logout
      </div>
      {showAuth ? (
        <AuthOverview
          authMode={authMode}
          setAuthMode={setAuthMode}
          showAuth={showAuth}
          setShowAuth={setShowAuth}
        />
      ) : null}
    </div>
  );
}

export default Header;

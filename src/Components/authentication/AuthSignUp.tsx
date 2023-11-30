import React, {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import {useRouter} from 'next/router';
import styles from "../../styles/auth.module.scss";
import { fetchAPI } from "../../utils/Api";
import { UserContextType, UserContext } from "@/context/Context";
import Cookies from "js-cookie";
type Props = {
  setShowAuth: (show: boolean) => void;
  setAuthMode: (show: string) => void;
};
interface MyData {
  data: string[];
}

export default function AuthSignUp({ setAuthMode, setShowAuth }: Props) {
  const router = useRouter();
  const { setUser, setToken } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [username, setUserName] = useState("");

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const handleUserNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value);
  };
  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (password != e.target.value) {
      setError("Passwords do not match");
    } else if (password == e.target.value) {
      setError(null);
    }
  };

  const signUp = async (
    username: string,
    email: string,
    password: string,
    confirmPassword: string
  ) => {
    console.log("process Started", username, email, password, confirmPassword);
      if (
        password == confirmPassword &&
        username != "" &&
        email != "" &&
        password != "" &&
        confirmPassword != "" &&
        username.length >= 4 &&
        password.length >= 6
      ) {
        console.log("Passed through all the checks");
        const response: any = await fetchAPI(
          "/users/signup",
          "POST",
          JSON.stringify({
            username: username,
            email: email,
            password: password,
          })
        );
        if (response.success == false) {
          setError(response.message);
          return;
        }
        else{
          const data = await response.data;
          setError(null);
          setUser(data.user);
          setToken(data.token);
          localStorage.setItem("userData", JSON.stringify(data.user));
          Cookies.set("token", data.token, { expires: 1 });
          Cookies.set("userId", data.user.id, { expires: 1 });
          setShowAuth(false);
          setAuthMode("signin");
          router.reload();
        }
      } 
      else if (username.length < 4) {
        setError("Username too small must be at least 4 characters");
      } else if (password.length < 6) {
        setError("Password too small must be at least 6 characters");
      } else if (password != confirmPassword) {
        setError("Passwords do not match");
      }
      else if (username == "" || email == "" || password == "") {
        setError("Please fill all the fields");
      }
  };
  return (
    <div>
      <div
        className={styles.background}
        onClick={() => {
          setShowAuth(false);
          setAuthMode("signin");
        }}
      ></div>
      <div className={styles.block}>
        <h2>Sign Up</h2>
        <div
          className={styles.form}
        >
          <div className={styles.formChild}>
            <label htmlFor="email">Email*: </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className={styles.formChild}>
            <label htmlFor="email">UserName*: </label>
            <input
              id="username"
              value={username}
              onChange={handleUserNameChange}
            />
          </div>
          <div className={styles.formChild}>
            <label htmlFor="password">Password*:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className={styles.formChild}>
            <label htmlFor="password">Confirm Password*:</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <button className={styles.button}
          onClick={() => {
            signUp(username, email, password, confirmPassword);
          }}>
            Sign Up
          </button>
        </div>
        <div
          onClick={() => setAuthMode("signin")}
          className={styles.formFooter}
        >
          Already have an account? Sign In
        </div>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
}

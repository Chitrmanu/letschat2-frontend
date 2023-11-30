import React, {
  useState,
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useContext,
} from "react";
import styles from "../../styles/auth.module.scss";
import { fetchAPI } from "../../utils/Api";
import { UserContextType, UserContext } from "@/context/Context";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
type Props = {
  setShowAuth: (show: boolean) => void;
  setAuthMode: (show: string) => void;
};

const AuthSignIn: FC<Props> = ({ setShowAuth, setAuthMode }) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { setUser, setToken } = useContext(UserContext);
  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const signin = async (email: string, password: string) => {
    try {
      const response: any = await fetchAPI(
        "/users/signin",
        "POST",
        JSON.stringify({ email: email, password: password })
      );
      if (response.success == false) {
        setError(response.message);
        return;
      } else {
        const data = await response.data;
        setError(null);
        setUser(data.userdata);
        setToken(data.token);
        localStorage.setItem("userData", JSON.stringify(data.userdata));
        Cookies.set("token", data.token, { expires: 1 });
        Cookies.set("userId", data.userdata.id, { expires: 1 });
        setShowAuth(false);
        setAuthMode("signin");
        router.reload();
      }
    } catch (error) {
      console.error("Error fetching data:", error);
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
        <h2>Sign In</h2>
        <div className={styles.form}>
          <div className={styles.formChild}>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className={styles.formChild}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <button
            className={styles.button}
            onClick={() => {
              signin(email, password);
            }}
          >
            Sign In
          </button>
        </div>
        <div
          onClick={() => setAuthMode("signup")}
          className={styles.formFooter}
        >
          Don&apos;t have an account? Sign Up
        </div>
      </div>
      {error ? <div className={styles.error}>{error}</div> : null}
    </div>
  );
};

export default AuthSignIn;

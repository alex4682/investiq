import { useState, useEffect } from "react";
import Header from "./Header";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import styles from "../scss/LoginPage.module.scss";
import img from "../img/bg.png";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useAppSelector } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { fetchCurrentUser, verifyToken } from "../redux/users-slice";

const LoginPage = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { isLoggedIn, verifying, authError } = useAppSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());

    const params = new URLSearchParams(window.location.search);
    const token_hash = params.get("token_hash");
    const type = params.get("type") ?? undefined;

    if (token_hash) {
      dispatch(verifyToken(token_hash, type));
    }
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [isLoggedIn, navigate]);

  return (
    <section>
      <Header isLogged={isLoggedIn} />
      <div className={styles.loginPage}>
        <img src={img} className={styles.loginBackgroundMain} />
        <div className={styles.loginBackground}></div>
        <h2 className={styles.loginTitle}>InvestIQ</h2>
        <p className={styles.loginSubtitle}>Smart Finance</p>
      </div>
      <div className={styles.loginForm}>
        <LogIn
          isActive={isLoginActive}
          setIsActive={setIsLoginActive}
          setIsSignUpActive={setIsSignUpActive}
        />
        <SignUp
          isActive={isSignUpActive}
          setIsActive={setIsSignUpActive}
          setIsLoginActive={setIsLoginActive}
        />
      </div>
      {verifying ? <p style={{ textAlign: "center" }}>Підтверджуємо ваш логін...</p> : null}
      {authError ? <p style={{ textAlign: "center", color: "red" }}>{authError}</p> : null}
    </section>
  );
};

export default LoginPage;

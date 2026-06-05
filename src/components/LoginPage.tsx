import { useState, useEffect } from "react";
import Header from "./Header";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import styles from "../scss/LoginPage.module.scss";
import img from "../img/bg.png";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {useNavigate} from "react-router-dom";

const LoginPage = () => {
  const [isLoginActive, setIsLoginActive] = useState(true);
  const [isSignUpActive, setIsSignUpActive] = useState(false);
  const isLogged = useSelector((state: RootState) => state.user.isLoggedIn);
  const navigate = useNavigate();
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      
      navigate("/home");

    }
  }, []);
  return (
    <section>
      <Header isLogged={isLogged} />
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
    </section>
  );
};

export default LoginPage;

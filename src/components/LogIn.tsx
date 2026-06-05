import React from "react";
import styles from "../scss/LogIn.module.scss";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { fetchUserByEmail, type User } from "../redux/users-api";
import {login} from "../redux/users-slice";
import {useNavigate} from "react-router-dom";

const LogIn = ({
  isActive,
  setIsActive,
  setIsSignUpActive,
}: {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  setIsSignUpActive: (active: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = e.currentTarget.email.value;
    const password = e.currentTarget.password.value;
    const result = await dispatch(fetchUserByEmail(email));
    if (result.payload && result.payload.password === password) {
      dispatch(login(result.payload));
      navigate("/home");
    } else {
      alert("Невірна електронна пошта або пароль");
    }
  };
  return (
    <section className={`${styles.logIn} ${isActive ? styles.active : ""}`}>
      <p className={styles.logInSubtitle}>
        Ви можете авторизуватися за допомогою акаунта Google
      </p>
      <button
        className={styles.logInGoogleButton}
        aria-label="Sign in with Google"
        onClick={() => {}}
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="google"
        />
        Google
      </button>
      <p className={styles.logInSubtitle}>
        Або увійти за допомогою ел. пошти та паролю після реєстрації
      </p>
      <form action="" className={styles.logInForm} onSubmit ={handleLogIn}>
        <label htmlFor="email" className={styles.logInLabel}>
          Електронна пошта:
        </label>
        <input name="email" type="email" id="email" placeholder="your@email.com" required />
        <label htmlFor="password" className={styles.logInLabel}>
          Пароль:
        </label>
        <input name="password" type="password" id="password" placeholder="Пароль" required />
        <ul className={styles.logInButtonWrap}>
          <li>
            <button className={styles.logInButton} type="submit">
              Увійти
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.signUpButton}
              onClick={() => {
                setIsActive(false);
                setIsSignUpActive(true);
              }}
            >
              Реєстрація
            </button>
          </li>
        </ul>
      </form>
    </section>
  );
};

export default LogIn;

import React, { useState } from "react";
import styles from "../scss/LogIn.module.scss";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useAppSelector } from "../redux/store";
import { loginUser } from "../redux/users-slice";

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
  const { loading, authError } = useAppSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(loginUser(email, password));
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
        type="button"
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

      <form className={styles.logInForm} onSubmit={handleLogIn}>
        <label htmlFor="email" className={styles.logInLabel}>
          Електронна пошта:
        </label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className={styles.logInLabel}>
          Пароль:
        </label>
        <input
          name="password"
          type="password"
          id="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {authError ? <p style={{ color: "red" }}>{authError}</p> : null}

        <ul className={styles.logInButtonWrap}>
          <li>
            <button className={styles.logInButton} type="submit" disabled={loading}>
              {loading ? "Завантаження..." : "Увійти"}
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
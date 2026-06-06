import React, { useState } from "react";
import styles from "../scss/SignUp.module.scss";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../redux/store";
import { useAppSelector } from "../redux/store";
import { registerUser } from "../redux/users-slice";

const SignUp = ({
  isActive,
  setIsActive,
  setIsLoginActive,
}: {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  setIsLoginActive: (active: boolean) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, authError } = useAppSelector((state) => state.user);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Паролі не співпадають");
      return;
    }

    dispatch(registerUser(name, email, password));
  };

  return (
    <section className={`${styles.signUp} ${isActive ? styles.active : ""}`}>
      <p className={styles.signUpSubtitle}>
        Ви можете зареєструватися за допомогою акаунта Google
      </p>

      <button
        className={styles.signUpGoogleButton}
        aria-label="Sign in with Google"
        type="button"
      >
        <img
          src="https://developers.google.com/identity/images/g-logo.png"
          alt="Google"
          className="google"
        />
        Google
      </button>

      <p className={styles.signUpSubtitle}>
        Або зареєструватися за допомогою ел. пошти та паролю
      </p>

      <form className={styles.signUpForm} onSubmit={handleSignUp}>
        <label htmlFor="name">Ім'я:</label>
        <input
          name="name"
          type="text"
          id="name"
          placeholder="Введіть ваше ім'я"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="email" className={styles.signUpLabel}>
          Електронна пошта:
        </label>
        <input
          name="email"
          type="email"
          id="email"
          placeholder="Введіть вашу електронну пошту"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password" className={styles.signUpLabel}>
          Пароль:
        </label>
        <input
          name="password"
          type="password"
          id="password"
          placeholder="Введіть ваш пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <label htmlFor="confirmPassword" className={styles.signUpLabel}>
          Підтвердження паролю:
        </label>
        <input
          name="confirmPassword"
          type="password"
          id="confirmPassword"
          placeholder="Підтвердіть ваш пароль"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />

        {authError ? <p style={{ color: "red" }}>{authError}</p> : null}

        <ul className={styles.signUpButtonWrap}>
          <li>
            <button type="submit" className={styles.signUpButton} disabled={loading}>
              {loading ? "Завантаження..." : "Зареєструватися"}
            </button>
          </li>
          <li>
            <button
              type="button"
              className={styles.logInButton}
              onClick={() => {
                setIsActive(false);
                setIsLoginActive(true);
              }}
            >
              Увійти
            </button>
          </li>
        </ul>
      </form>
    </section>
  );
};

export default SignUp;
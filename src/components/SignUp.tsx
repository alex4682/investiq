import React from "react";
import styles from "../scss/SignUp.module.scss";
import { useDispatch } from "react-redux";
import { addUser, fetchUserByEmail } from "../redux/users-api";
import { store } from "../redux/store";
import { useNavigate } from "react-router-dom";

const SignUp = ({
  isActive,
  setIsActive,
  setIsLoginActive,
}: {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
  setIsLoginActive: (active: boolean) => void;
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<typeof store.dispatch>();
  const handleSignUp = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name")?.toString() ?? "";
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const confirm = formData.get("confirmPassword")?.toString() ?? "";
    dispatch(fetchUserByEmail(email)).then((response) => {
      if (response.payload) {
        alert("Користувач з такою електронною поштою вже існує");
        return;
      }
    });

    if (password !== confirm) {
      alert("Паролі не співпадають");
      return;
    }
    e.currentTarget.reset();

    dispatch(addUser({ name, email, password })).then(() => {
      navigate("/home");
    });
  };
  return (
    <section className={`${styles.signUp} ${isActive ? styles.active : ""}`}>
      <p className={styles.signUpSubtitle}>
        Ви можете зареєструватися за допомогою акаунта Google
      </p>
      <button
        className={styles.signUpGoogleButton}
        aria-label="Sign in with Google"
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
      <form action="" className={styles.signUpForm} onSubmit={handleSignUp}>
        <label htmlFor="name">Ім'я:</label>
        <input
          name="name"
          type="text"
          id="name"
          placeholder="Введіть ваше ім'я"
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
          required
        />
        <ul className={styles.signUpButtonWrap}>
          <li>
            <button type="submit" className={styles.signUpButton}>
              Зареєструватися
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

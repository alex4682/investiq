import React from "react";
import styles from "../scss/Header.module.scss";

const Header = ({ isLogged = false }: { isLogged: boolean }) => {
  return (
    <header className={styles.header}>
        <div className={styles.logo}>
          <div className={`${styles.logoRect} ${styles.light}`}></div>
          <div className={`${styles.logoRect}`}></div>
          <h1 className={styles.logoTitle}>INVESTIQ</h1>
        </div>
      {isLogged ? (
        <div className={styles.userInfo}>
          <div className={styles.userWrap}>
            <div className={styles.userIcon}>J</div>
            <span className={styles.userName}>John Doe</span>
          </div>
          <a href="#" className={styles.logoutLink}>
            Вийти
          </a>
        </div>
      ) : null}
    </header>
  );
};

export default Header;

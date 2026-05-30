import React from "react";
import Header from "./Header";
import styles from "../scss/LoginPage.module.scss";
import img from "../img/bg.png";

const LoginPage = () => {
  return (
    <section>
      <Header isLogged={false} />
      <div className={styles.loginPage}>
        <img src={img} className={styles.loginBackgroundMain} />
        <div className={styles.loginBackground}></div>
        <h2 className={styles.loginTitle}>InvestIQ</h2>
        <p className={styles.loginSubtitle}>Smart Finance</p>
      </div>
      <div></div>
    </section>
  );
};

export default LoginPage;

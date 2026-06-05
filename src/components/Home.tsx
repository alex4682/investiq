import React from "react";
import styles from "../scss/Home.module.scss";
import Header from "./Header.tsx";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store.ts";
import img from "../img/bg.png";

const Home = () => {
  const isLogged = useSelector((state: RootState) => state.user.isLoggedIn);
  const UserName = useSelector((state: RootState) => state.user.userData?.name);
  return (
    <>
      <Header isLogged={isLogged} userName={UserName} />
      <section className={styles.home}>
        <img src={img} className={styles.homeBackground} />
      </section>
    </>
  );
};

export default Home;

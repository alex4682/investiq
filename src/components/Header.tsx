import React from "react";
import styles from "../scss/Header.module.scss";
import { useDispatch } from "react-redux";
import { logout } from "../redux/users-slice";
import { useNavigate } from "react-router-dom";
import {useState} from "react";
import type { asyncThunkCreator } from "@reduxjs/toolkit";

const Header = ({
  isLogged = false,
  userName,
}: {
  isLogged: boolean;
  userName?: string;
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [backdropClass, setBackdropClass] = useState(false);
  return (
    <>
      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={`${styles.logoRect} ${styles.light}`}></div>
          <div className={`${styles.logoRect}`}></div>
          <h1 className={styles.logoTitle}>INVESTIQ</h1>
        </div>
        {isLogged ? (
          <div className={styles.userInfo}>
            <div className={styles.userWrap}>
              <div className={styles.userIcon}>{userName?.charAt(0)}</div>
              <span className={styles.userName}>{userName}</span>
            </div>
            <p
              className={styles.logoutLink}
              onClick={() => {
                setBackdropClass(true);
              }}
            >
              Вийти
            </p>
          </div>
        ) : null}
      </header>
      <div className={`${styles.backdrop} ${backdropClass ? styles.active : styles.hidden}`}>
        <div className={styles.logoutModal}>
          <p className={styles.logoutText}>Ви впевнені, що хочете вийти?</p>
          <ul className={styles.logoutButtons}>
            <li>
              <button
                className={styles.confirmButton}
                onClick={() => {
                  dispatch(logout());
                  setBackdropClass(false);
                  navigate("/");
                }}
              >
                Так
              </button>
            </li>
            <li>
              <button
                className={styles.cancelButton}
                onClick={() => {
                  setBackdropClass(false);
                }}
              >
                Ні
              </button>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Header;

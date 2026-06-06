import { useEffect } from "react";
import styles from "../scss/Home.module.scss";
import Header from "./Header.tsx";
import { useAppSelector } from "../redux/store.ts";
import img from "../img/bg.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Spends from "./Spends.tsx";

const Home = () => {
  const { isLoggedIn, loading, userData } = useAppSelector((state) => state.user);
  const UserName = userData?.name ?? undefined;
  const navigate = useNavigate();
  const spendsData = [
    {
      date: "05.09.2019",
      title: "Метро",
      category: "Транспорт",
      cost: 30,
    },
    {
      date: "05.09.2019",
      title: "Банани",
      category: "Продукти",
      cost: 50,
    },
  ];

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/");
    }
  }, [loading, isLoggedIn, navigate]);

  return (
    <>
      <Header isLogged={isLoggedIn} userName={UserName} />
      <section className={styles.home}>
        <img src={img} className={styles.homeBackground} />
        <div className={styles.homeContent}>
          <div className={styles.balanceContainer}>
            <p className={styles.balance}>Баланс</p>
            <form action="">
              <input
                type="text"
                placeholder="00.00 UAH"
                className={styles.balanceInput}
              />
              <button type="submit" className={styles.balanceButton}>
                Підтвердити
              </button>
            </form>
          </div>
          <Link to="/home" className={styles.investmentsLink}>
            Перейти до розрахунків
          </Link>
        </div>
        <div className={styles.homeMain}>
          <ul className={styles.homeMenu}>
            <li>
              <button className={styles.menuButton + " " + styles.active}>
                Витрати
              </button>
            </li>
            <li>
              <button className={styles.menuButton}>Дохід</button>
            </li>
          </ul>
          <div className={styles.homeGoods}>
            <p className={styles.homeDate}>{new Date().toLocaleDateString()}</p>
            <form action="" className={styles.homeGoodsForm}>
              <div>
                <input type="text" placeholder="Опис товару" className={styles.homeGoodNameInput} />
                <select name="category" id="category" className={styles.homeGoodCategoryInput}>
                  <option value="">Категорія товару</option>
                  <option value="tr">Транспорт</option>
                  <option value="pr">Продукти</option>
                  <option value="hl">Здоров'я</option>
                  <option value="al">Алкоголь</option>
                  <option value="fun">Розваги</option>
                  <option value="home">Все для дому</option>
                  <option value="t">Техніка</option>
                  <option value="comm">Комуналка, зв’язок</option>
                  <option value="sp">Спорт</option>
                  <option value="ed">Нвчання</option>
                  <option value="oth">Інше</option>
                </select>
                <input
                  type="number"
                  placeholder="0.00"
                  className={styles.homeGoodCostInput}
                />
              </div>
              <button className={styles.menuButtonSubmit}>Ввести</button>
              <button className={styles.menuButtonClear}>Очистити</button>
            </form>
          </div>
          <div>
            <Spends spendsData={spendsData} />
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;

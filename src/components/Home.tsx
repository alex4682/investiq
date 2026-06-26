import { useEffect, useState } from "react";
import type React from "react";
import styles from "../scss/Home.module.scss";
import Header from "./Header.tsx";
import { useAppDispatch, useAppSelector } from "../redux/store.ts";
import { fetchInvestIQByUser } from "../redux/goods-slice";
import img from "../img/bg.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Spends from "./Spends.tsx";
import Income from "./Income.tsx";
import Reduction from "./Reduction.tsx";
import svg from "../img/symbol-defs.svg";
import { updateSpendsInvestIQ } from "../redux/goods-api";
import { updateIncomeInvestIQ } from "../redux/goods-api";
import { updateBalanceInvestIQ } from "../redux/goods-api";


const Home = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, loading, userData } = useAppSelector(
    (state) => state.user,
  );
  const { records } = useAppSelector((state) => state.goods);
  const UserName = userData?.name ?? undefined;
  const navigate = useNavigate();
  const [balanceInput, setBalanceInput] = useState("");
  const [moneyChange, setMoneyChange] = useState<0 | 1>(0);
  const [balance, setBalance] = useState(0);
  const [localSpends, setLocalSpends] = useState<
    Array<{ date: string; title: string; category: string; cost: number }>
  >([]);

  const mergedRecord = records.length
    ? records.reduce(
        (acc, item) => ({
          balance: item.balance + acc.balance,
          costs: [...acc.costs, ...(item.costs ?? [])],
          income: [...acc.income, ...(item.income ?? [])],
          id: item.id,
          userId: item.userId,
        }),
        {
          id: records[0]?.id ?? "",
          userId: records[0]?.userId ?? "",
          balance: 0,
          costs: [] as (typeof records)[0]["costs"],
          income: [] as (typeof records)[0]["income"],
        },
      )
    : null;

  const spendsData =
    mergedRecord?.costs && mergedRecord.costs.length > 0
      ? [...mergedRecord.costs, ...localSpends]
      : localSpends;
  const incomeData =
    mergedRecord?.income && mergedRecord.income.length > 0
      ? [...mergedRecord.income, ...localSpends]
      : localSpends;

  const displayedBalance = mergedRecord?.balance ?? balance;
  const goodsError = useAppSelector((state) => state.goods.error);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/");
    }
  }, [loading, isLoggedIn, navigate]);

  useEffect(() => {
    console.log("Home useEffect userData", { userData, records });
    if (!userData?.id) return;
    if (records.length > 0) return;

    dispatch(fetchInvestIQByUser(userData.id));
  }, [userData, records, dispatch]);

  const handleSpendsForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const cost = Number(data.get("cost") ?? 0);

    if (!title || !category || !cost) return;

    const newSpend = {
      date: new Date().toLocaleDateString("uk-UA"),
      title,
      category,
      cost,
    };

    const updatedSpends = [...(mergedRecord?.costs ?? []), newSpend];

    const newBalance = (mergedRecord?.balance ?? 0) - cost;

    try {
      await updateSpendsInvestIQ(userData.id, updatedSpends, newBalance);

      dispatch(fetchInvestIQByUser(userData.id));

      form.reset();
    } catch (err) {
      console.error(err);
    }
  };
  const handleIncomeForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData) return;

    const form = e.currentTarget;
    const data = new FormData(form);

    const title = String(data.get("title") ?? "").trim();
    const category = String(data.get("category") ?? "").trim();
    const cost = Number(data.get("cost") ?? 0);

    if (!title || !category || !cost) return;

    const newIncome = {
      date: new Date().toLocaleDateString("uk-UA"),
      title,
      category,
      cost,
    };

    const updatedIncome = [...(mergedRecord?.income ?? []), newIncome];

    const newBalance = (mergedRecord?.balance ?? 0) + cost;

    try {
      await updateIncomeInvestIQ(userData.id, updatedIncome, newBalance);

      dispatch(fetchInvestIQByUser(userData.id));

      form.reset();
    } catch (err) {
      console.error(err);
    }
  };

  const handleBalanceForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData) return;

    const newBalance = Number(balanceInput);

    if (isNaN(newBalance)) return;

    try {
      await updateBalanceInvestIQ(userData.id, newBalance);

      await dispatch(fetchInvestIQByUser(userData.id));

      setBalanceInput("");
    } catch (err) {
      console.error("Balance update error:", err);
    }
  };
  return (
    <>
      <Header isLogged={isLoggedIn} userName={UserName} />
      <section className={styles.home}>
        <img src={img} className={styles.homeBackground} />
        <div className={styles.homeContent}>
          <div className={styles.balanceContainer}>
            <p className={styles.balance}>Баланс:</p>
            <form
              action=""
              onSubmit={(e) => {
                handleBalanceForm(e);
              }}
            >
              <input
                id="balance"
                type="number"
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                placeholder={displayedBalance + " UAH"}
                className={styles.balanceInput}
              />
              <button type="submit" className={styles.balanceButton}>
                Підтвердити
              </button>
            </form>
          </div>
          <Link to="/charts" className={styles.investmentsLink}>
            Перейти до розрахунків
            <svg className={styles.investmentsLinkIcon} width="16" height="16">
              <use href={svg + "#icon-chart"} width="16" height="16"></use>
            </svg>
          </Link>
        </div>
        <div className={styles.homeMain}>
          <ul className={styles.homeMenu}>
            <li>
              <button
                className={
                  styles.menuButton +
                  " " +
                  (moneyChange === 0 ? styles.active : "")
                }
                onClick={() => {
                  setMoneyChange(0);
                }}
              >
                Витрати
              </button>
            </li>
            <li>
              <button
                className={
                  styles.menuButton +
                  " " +
                  (moneyChange === 1 ? styles.active : "")
                }
                onClick={() => {
                  setMoneyChange(1);
                }}
              >
                Дохід
              </button>
            </li>
          </ul>
          <div className={styles.homeGoods}>
            <p className={styles.homeDate}>
              <svg className={styles.dateIcon} width="16" height="16">
                <use href={svg + "#icon-date"} width="16" height="16"></use>
              </svg>{" "}
              {new Date().toLocaleDateString()}
            </p>

            {moneyChange === 0 ? (
              <form
                action=""
                className={styles.homeGoodsForm}
                onSubmit={handleSpendsForm}
              >
                <div className={styles.formWrap}>
                  <input
                    name="title"
                    type="text"
                    placeholder="Опис товару"
                    className={styles.homeGoodNameInput}
                    required
                  />
                  <select
                    name="category"
                    id="category"
                    className={styles.homeGoodCategoryInput}
                    required
                  >
                    <option value="">Категорія товару</option>
                    <option value="Транспорт">Транспорт</option>
                    <option value="Продукти">Продукти</option>
                    <option value="Здоров'я">Здоров'я</option>
                    <option value="Алкоголь">Алкоголь</option>
                    <option value="Розваги">Розваги</option>
                    <option value="Все для дому">Все для дому</option>
                    <option value="Техніка">Техніка</option>
                    <option value="Комуналка, зв’язок">
                      Комуналка, зв’язок
                    </option>
                    <option value="Спорт">Спорт</option>
                    <option value="Навчання">Навчання</option>
                    <option value="Інше">Інше</option>
                  </select>
                  <input
                    name="cost"
                    type="number"
                    placeholder="0.00"
                    className={styles.homeGoodCostInput}
                    required
                  />
                  <svg className={styles.costIcon} width="16" height="16">
                    <use
                      href={svg + "#icon-calculator"}
                      width="16"
                      height="16"
                    ></use>
                  </svg>
                </div>
                <button className={styles.menuButtonSubmit} type="submit">
                  Ввести
                </button>
                <button className={styles.menuButtonClear} type="reset">
                  Очистити
                </button>
              </form>
            ) : (
              <form
                action=""
                className={styles.homeGoodsForm}
                onSubmit={(e) => {
                  handleIncomeForm(e);
                }}
              >
                <div className={styles.formWrap}>
                  <input
                    name="title"
                    type="text"
                    placeholder="Опис прибутку"
                    className={styles.homeGoodNameInput}
                  />
                  <select
                    name="category"
                    id="category"
                    className={styles.homeGoodCategoryInput}
                  >
                    <option value="">Категорія товару</option>
                    <option value="ЗП">ЗП</option>
                    <option value="Дод. прибуток">Дод. прибуток </option>
                  </select>
                  <input
                    name="cost"
                    type="number"
                    placeholder="0.00"
                    className={styles.homeGoodCostInput}
                  />
                  <svg className={styles.costIcon} width="16" height="16">
                    <use
                      href={svg + "#icon-calculator"}
                      width="16"
                      height="16"
                    ></use>
                  </svg>
                </div>
                <button className={styles.menuButtonSubmit} type="submit">
                  Ввести
                </button>
                <button className={styles.menuButtonClear} type="reset">
                  Очистити
                </button>
              </form>
            )}
          </div>
          <div className={styles.moneyWrap}>
            {goodsError ? (
              <p style={{ color: "red", padding: "16px 0" }}>
                Помилка завантаження даних: {goodsError}
              </p>
            ) : null}
            {moneyChange === 0 ? (
              <Spends spendsData={spendsData} />
            ) : (
              <Income incomeData={incomeData} />
            )}
            <Reduction record={mergedRecord} />
          </div>
        </div>
        
      </section>
    </>
  );
};

export default Home;

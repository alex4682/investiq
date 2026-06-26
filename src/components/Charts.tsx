import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "./Header.tsx";
import { useAppDispatch, useAppSelector } from "../redux/store.ts";
import { fetchInvestIQByUser } from "../redux/goods-slice";
import { updateBalanceInvestIQ } from "../redux/goods-api";
import svg from "../img/symbol-defs-1.svg";
import styles from "../scss/Charts.module.scss";
import img from "../img/bg.png";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Charts = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [balanceInput, setBalanceInput] = useState("");
  const [isExpenseMode, setIsExpenseMode] = useState(true);
  const [activeCategory, setActiveCategory] = useState("food");

  const monthNames = [
    "Січень",
    "Лютий",
    "Березень",
    "Квітень",
    "Травень",
    "Червень",
    "Липень",
    "Серпень",
    "Вересень",
    "Жовтень",
    "Листопад",
    "Грудень",
  ];

  const expenseCategories = [
    { id: "food", label: "Продукти", icon: "icon-food" },
    { id: "alcohol", label: "Алкоголь", icon: "icon-cocktail" },
    { id: "entertainment", label: "Розваги", icon: "icon-kite" },
    { id: "health", label: "Здоров'я", icon: "icon-health" },
    { id: "transport", label: "Транспорт", icon: "icon-car" },
    { id: "home", label: "Все для дому", icon: "icon-couch" },
    { id: "technics", label: "Техніка", icon: "icon-tools" },
    { id: "communal", label: "Комуналка, зв'язок", icon: "icon-invoice" },
    { id: "hobby", label: "Спорт, хобі", icon: "icon-clay" },
    { id: "education", label: "Навчання", icon: "icon-book" },
    { id: "other", label: "Інше", icon: "icon-ufo" },
  ];

  const incomeCategories = [
    { id: "salary", label: "ЗП", icon: "icon-income" },
    { id: "additional", label: "Дод. прибуток", icon: "icon-add-income" },
  ];

  const currentCategories = isExpenseMode
    ? expenseCategories
    : incomeCategories;

  const { isLoggedIn, loading, userData } = useAppSelector(
    (state) => state.user,
  );
  const userName = userData?.name ?? undefined;
  const { records } = useAppSelector((state) => state.goods);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      navigate("/");
    }
  }, [loading, isLoggedIn, navigate]);

  useEffect(() => {
    if (!userData?.id) return;
    if (records.length > 0) return;

    dispatch(fetchInvestIQByUser(userData.id));
  }, [userData, records, dispatch]);

  useEffect(() => {
    if (isExpenseMode) {
      setActiveCategory("food");
    } else {
      setActiveCategory("salary");
    }
  }, [isExpenseMode]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

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

  const displayedBalance = mergedRecord?.balance ?? 0;

  const totalExpensesForPeriod =
    mergedRecord?.costs.reduce((acc, item) => {
      if (!item.date) return acc;
      const [, month, year] = item.date.split(".");

      if (Number(year) === currentYear && Number(month) === currentMonth + 1) {
        return acc + item.cost;
      }
      return acc;
    }, 0) ?? 0;

  const totalIncomeForPeriod =
    mergedRecord?.income.reduce((acc, item) => {
      if (!item.date) return acc;
      const [, month, year] = item.date.split(".");

      if (Number(year) === currentYear && Number(month) === currentMonth + 1) {
        return acc + item.cost;
      }
      return acc;
    }, 0) ?? 0;

  const categoryTotals =
    (isExpenseMode ? mergedRecord?.costs : mergedRecord?.income)?.reduce(
      (acc, item) => {
        if (!item.date || !item.category) return acc;
        const [, month, year] = item.date.split(".");

        if (
          Number(year) === currentYear &&
          Number(month) === currentMonth + 1
        ) {
          const catNormalize = item.category.trim();
          acc[catNormalize] = (acc[catNormalize] || 0) + item.cost;
        }
        return acc;
      },
      {} as Record<string, number>,
    ) ?? {};

  const activeCategoryObj = currentCategories.find(
    (c) => c.id === activeCategory,
  );
  const activeCategoryLabel = activeCategoryObj?.label ?? "";

  const filteredTransactions =
    (isExpenseMode ? mergedRecord?.costs : mergedRecord?.income)?.filter(
      (item) => {
        if (!item.date || !item.category) return false;
        const [, month, year] = item.date.split(".");

        const recordCategory = item.category.trim().toLowerCase();
        const currentActiveLabel = activeCategoryLabel.trim().toLowerCase();

        return (
          Number(year) === currentYear &&
          Number(month) === currentMonth + 1 &&
          (recordCategory === currentActiveLabel ||
            (currentActiveLabel === "зп" && recordCategory.includes("з/п")) ||
            (currentActiveLabel === "дод. прибуток" &&
              (recordCategory.includes("дод") ||
                recordCategory.includes("додатков"))))
        );
      },
    ) ?? [];

  const chartDataGrouped = filteredTransactions.reduce(
    (acc, item) => {
      const title = item.title ? item.title.trim() : activeCategoryLabel;
      acc[title] = (acc[title] || 0) + item.cost;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedChartItems = Object.entries(chartDataGrouped).sort(
    (a, b) => b[1] - a[1],
  );

  const chartLabels = sortedChartItems.map((item) => item[0]);
  const chartValues = sortedChartItems.map((item) => item[1]);

  const backgroundColors = chartValues.map((_, index) => {
    return index % 2 === 0 ? "rgba(255, 117, 32, 1)" : "rgba(255, 218, 191, 1)";
  });

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        data: chartValues,
        backgroundColor: backgroundColors,
        barThickness: 38,
        borderRadius: {
          topLeft: 10,
          topRight: 10,
          bottomLeft: 0,
          bottomRight: 0,
        },
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => ` ${context.raw} грн`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#aaa",
          callback: (value: any) => `${value} грн`,
        },
        grid: {
          color: "#f2f3f7",
          drawTicks: false,
        },
        border: {
          display: false,
        },
      },
      x: {
        ticks: {
          color: "#555",
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  };

  const handleBalanceForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userData?.id) return;

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
    <section className={styles.chartsSection}>
      <div>
        <Header isLogged={isLoggedIn} userName={userName} />
      </div>
      <img src={img} className={styles.homeBackground} alt="background" />
      <div className={styles.wrap}>
        <Link to="/home" className={styles.link}>
          <svg className={styles.back}>
            <use href={svg + "#icon-back"}></use>
          </svg>
          Повернутись на головну
        </Link>

        <div className={styles.balanceContainer}>
          <p className={styles.balance}>Баланс:</p>
          <form
            action=""
            onSubmit={handleBalanceForm}
            className={styles.balanceForm}
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

        <div className={styles.periodContainer}>
          <p className={styles.periodTitle}>Поточний період</p>
          <div className={styles.periodBtnWrap}>
            <button
              type="button"
              onClick={prevMonth}
              className={styles.periodButton}
            >
              {"<"}
            </button>

            <h3 className={styles.periodCurrent}>
              {monthNames[currentMonth]} {currentYear}
            </h3>

            <button
              type="button"
              onClick={nextMonth}
              className={styles.periodButton}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>

      <div className={styles.totalsContainer}>
        <div className={styles.totalBlock}>
          <h3 className={styles.totalBlockTitle}>Витрати</h3>
          <p className={styles.totalExpenses}>-{totalExpensesForPeriod} грн</p>
        </div>
        <div className={styles.totalBlock}>
          <h3 className={styles.totalBlockTitle}>Доходи</h3>
          <p className={styles.totalIncome}>+{totalIncomeForPeriod} грн</p>
        </div>
      </div>

      <div className={styles.typesWrap}>
        <div className={styles.typesChange}>
          <button
            type="button"
            onClick={() => setIsExpenseMode((prev) => !prev)}
          >
            {"<"}
          </button>
          <h2>{isExpenseMode ? "Витрати" : "Доходи"}</h2>
          <button
            type="button"
            onClick={() => setIsExpenseMode((prev) => !prev)}
          >
            {">"}
          </button>
        </div>
        <ul className={styles.typesList}>
          {currentCategories.map((category) => {
            const amount =
              categoryTotals[category.label] ||
              (category.label === "ЗП"
                ? categoryTotals["З/П"] || categoryTotals["ЗП"]
                : 0) ||
              (category.label === "Дод. прибуток"
                ? categoryTotals["Дод. прибуток"] ||
                  categoryTotals["Додатковий дохід"]
                : 0);
            const isActive = activeCategory === category.id;

            return (
              <li
                key={category.id}
                className={styles.typesItem}
                onClick={() => setActiveCategory(category.id)}
                style={{ cursor: "pointer" }}
              >
                <p className={styles.categoryAmount}>
                  {amount > 0
                    ? `${isExpenseMode ? "-" : "+"}${amount} грн`
                    : "0 грн"}
                </p>
                <svg
                  className={`${styles.typesIcons} ${isActive ? styles.active : ""}`}
                >
                  <use href={`${svg}#${category.icon}`}></use>
                </svg>
                <p className={styles.categoryLabel}>{category.label}</p>
              </li>
            );
          })}
        </ul>
      </div>

      <div
        className={styles.chart}
        style={{
          height: "380px",
          padding: "20px",
          background: "#fff",
          borderRadius: "30px",
          boxShadow: "0px 10px 60px rgba(170, 178, 197, 0.2)",
        }}
      >
        {chartLabels.length > 0 ? (
          <Bar
            key={`${isExpenseMode}-${activeCategory}-${currentMonth}`}
            data={chartData}
            options={chartOptions}
          />
        ) : (
          <p
            style={{ color: "#aaa", textAlign: "center", paddingTop: "100px" }}
          >
            Немає даних для графіка за категорією "{activeCategoryLabel}" у
            цьому періоді.
          </p>
        )}
      </div>
    </section>
  );
};

export default Charts;

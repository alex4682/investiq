import React from "react";
import styles from "../scss/Spends.module.scss";
import svg from "../img/symbol-defs.svg";
import { updateIncomeInvestIQ } from "../redux/goods-api";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchInvestIQByUser } from "../redux/goods-slice";

const Income = ({ incomeData }: { incomeData: any[] }) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { records } = useAppSelector((state) => state.goods);

  const displayedData = React.useMemo(() => {
    const arr = Array.isArray(incomeData) ? [...incomeData] : [];

    while (arr.length < 10) {
      arr.push({
        date: "",
        title: "",
        category: "",
        cost: 0,
      });
    }

    return arr;
  }, [incomeData]);

  const handleDelete = async (indexToDelete: number) => {
    if (!userData) return;

    const currentIncome = records[0]?.income ?? [];

    const deletedIncome = currentIncome[indexToDelete];

    const updatedIncome = currentIncome.filter(
      (_, index) => index !== indexToDelete
    );

    const currentBalance = records[0]?.balance ?? 0;

    // видалення доходу зменшує баланс
    const newBalance = currentBalance - (deletedIncome?.cost ?? 0);

    try {
      await updateIncomeInvestIQ(
        userData.id,
        updatedIncome,
        newBalance
      );

      dispatch(fetchInvestIQByUser(userData.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <table className={styles.spendsTable}>
        <thead>
          <tr className={styles.spendsTableHeader}>
            <th className={styles.spendsDate}>Дата</th>
            <th className={styles.spendsTitle}>Опис</th>
            <th className={styles.spendsCategory}>Категорія</th>
            <th className={styles.spendsCost}>Сума</th>
          </tr>
        </thead>

        <tbody>
          {displayedData.map((income, index) => (
            <tr key={index} className={styles.spendsTableRow}>
              <td className={styles.spendsTableDate}>{income.date}</td>

              <td className={styles.spendsTableTitle}>{income.title}</td>

              <td className={styles.spendsTableCategory}>
                {income.category}
              </td>

              <td className={`${styles.spendsTableCost} ${styles.green}`}>
                {income.cost ? `${income.cost} грн` : ""}

                {income.cost !== 0 && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(index)}
                  >
                    <svg className={styles.delete} width="16" height="16">
                      <use href={svg + "#icon-delete"}></use>
                    </svg>
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Income;
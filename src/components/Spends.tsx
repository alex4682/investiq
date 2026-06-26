import React from "react";
import styles from "../scss/Spends.module.scss";
import svg from "../img/symbol-defs.svg";
import { updateSpendsInvestIQ } from "../redux/goods-api";
import { useAppDispatch, useAppSelector } from "../redux/store";
import { fetchInvestIQByUser } from "../redux/goods-slice";

type Spend = {
  date: string;
  title: string;
  category: string;
  cost: number;
};

type SpendsProps = {
  spendsData: Spend[];
};

const Spends = ({ spendsData }: SpendsProps) => {
  const dispatch = useAppDispatch();
  const { userData } = useAppSelector((state) => state.user);
  const { records } = useAppSelector((state) => state.goods);

  const displayedData = React.useMemo(() => {
    const arr = Array.isArray(spendsData) ? [...spendsData] : [];

    while (arr.length < 10) {
      arr.push({
        date: "",
        title: "",
        category: "",
        cost: 0,
      });
    }

    return arr;
  }, [spendsData]);

  const handleDelete = async (indexToDelete: number) => {
    if (!userData) return;

    const currentSpends = records[0]?.costs ?? [];

    const deletedSpend = currentSpends[indexToDelete];

    const updatedSpends = currentSpends.filter(
      (_, index) => index !== indexToDelete,
    );

    const currentBalance = records[0]?.balance ?? 0;

    const newBalance = currentBalance + (deletedSpend?.cost ?? 0);

    try {
      await updateSpendsInvestIQ(userData.id, updatedSpends, newBalance);

      dispatch(fetchInvestIQByUser(userData.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div >
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
            {displayedData.map((spend, index) => (
              <tr key={index} className={styles.spendsTableRow}>
                <td className={styles.spendsTableDate}>{spend.date}</td>

                <td className={styles.spendsTableTitle}>{spend.title}</td>

                <td className={styles.spendsTableCategory}>{spend.category}</td>

                <td className={styles.spendsTableCost}>
                  {spend.cost !== 0 && `-${spend.cost} грн`}

                  {spend.cost !== 0 && (
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

export default Spends;

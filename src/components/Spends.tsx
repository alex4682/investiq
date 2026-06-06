import React from "react";
import { useEffect } from "react";
import styles from "../scss/Spends.module.scss";

const Spends = ({ spendsData }: { spendsData: any[] }) => {
  useEffect(() => {
    while (spendsData.length < 9) {
      spendsData.push({
        date: "",
        title: "",
        category: "",
        cost: "",
      });
    }
  }, [spendsData]);
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
          {Object.values(spendsData).map((spend: object, index: number) => (
            <tr key={index} className={styles.spendsTableRow}>
              <td className={styles.spendsTableDate}>{spend.date}</td>
              <td className={styles.spendsTableTitle}>{spend.title}</td>
              <td className={styles.spendsTableCategory}>{spend.category}</td>
              <td className={styles.spendsTableCost}>
                {spend.cost ? `-${spend.cost} грн` : ""}
                {spend.cost && <button>Видалити</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Spends;

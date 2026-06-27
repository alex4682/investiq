
import styles from "../scss/Reduction.module.scss";

type Item = {
  date: string;
  title: string;
  category: string;
  cost: number;
};

type RecordType = {
  costs: Item[];
  income: Item[];
};

const Reduction = ({ record }: { record: RecordType | null }) => {
  if (!record) return null;

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

  const currentYear = new Date().getFullYear();

  const monthlyExpenses = record.costs.reduce(
    (acc, item) => {
      if (!item.date) return acc;

      const [, month, year] = item.date.split(".");

      if (Number(year) !== currentYear) return acc;

      const monthName = monthNames[Number(month) - 1];

      acc[monthName] = (acc[monthName] || 0) + item.cost;

      return acc;
    },
    {} as Record<string, number>,
  );

  const monthlyIncomes = record.income.reduce(
    (acc, item) => {
      if (!item.date) return acc;

      const [, month, year] = item.date.split(".");

      if (Number(year) !== currentYear) return acc;

      const monthName = monthNames[Number(month) - 1];

      acc[monthName] = (acc[monthName] || 0) + item.cost;

      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className={styles.reduction}>
      <div className={styles.titleWrap}>
        <h2 className={styles.reductionTitle}>Зведення</h2>
      </div>
      <ul className={styles.reductionList}>
        {monthNames.map((month) => {
          const expenses = monthlyExpenses[month] || 0;
          const incomes = monthlyIncomes[month] || 0;
          const result = incomes - expenses;

          return (
            <li>
              <p key={month}>{month}</p>
              <p>{result} грн</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Reduction;

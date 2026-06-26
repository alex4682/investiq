import { supabase } from "./users-api";

type CostItem = {
  date: string;
  title: string;
  category: string;
  cost: number;
};

type IncomeItem = {
  date: string;
  title: string;
  category: string;
  cost: number;
};

export type InvestIQRecord = {
  id: string;
  userId: string;
  balance: number;
  costs: CostItem[];
  income: IncomeItem[];
};

export async function getInvestIQRecordsByUser(userId: string) {
  const { data, error } = await supabase
    .from("InvestIQ")
    .select("*")
    .eq("userId", userId);

  if (error) throw error;
  return (data ?? []) as InvestIQRecord[];
}

export async function insertInvestIQRecord(userId: string) {
  const { data, error } = await supabase
    .from("InvestIQ")
    .insert({
      userId,
      balance: 0,
      costs: [],
      income: [],
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateSpendsInvestIQ(
  userId: string,
  spends: object[],
  balance: number,
) {
  const { data, error } = await supabase
    .from("InvestIQ")
    .update({ costs: spends, balance })
    .eq("userId", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateIncomeInvestIQ(
  userId: string,
  income: IncomeItem[],
  balance: number,
) {
  const { data, error } = await supabase
    .from("InvestIQ")
    .update({
      income,
      balance,
    })
    .eq("userId", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function updateBalanceInvestIQ(userId: string, balance: number) {
  const { data, error } = await supabase
    .from("InvestIQ")
    .update({
      balance,
    })
    .eq("userId", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
}

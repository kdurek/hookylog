import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const MAX_VALUE = 9999999.99;

const currencyFormatter = new Intl.NumberFormat("pl-PL", {
  style: "currency",
  currency: "PLN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: true,
});

export const formatCurrency = (value: number) => {
  return currencyFormatter.format(value);
};

export const convertCurrencyToNumber = (amount: string): number =>
  parseFloat(amount.replace(",", "."));

export const isAmountWithinRange = (amount: number): boolean =>
  MAX_VALUE * -1 <= amount && amount <= MAX_VALUE;

export const removeTimezoneFromDate = (date: Date): Date => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000);
};

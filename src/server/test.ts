import { classify, loadClassificationRules, loadTransactions } from "./data";

console.table(loadTransactions());

console.table(loadClassificationRules());

console.log(classify("IKEA"));

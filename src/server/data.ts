import fs from "node:fs";
import path from "node:path";

export type Classification =
	| "Household"
	| "Transport"
	| "Food"
	| "Entertainment"
	| "Unknown";

export interface Transaction {
	id: number;
	date: string;
	recipient: string;
	amount: number;
	classification?: Classification;
	message?: string;
}

export interface ClassificationRule {
	recipient: string[];
	classification: Exclude<Classification, "Unknown">;
}

const DATA_DIR = path.join(__dirname, "../../data");

export function loadTransactions(): Transaction[] {
	const raw = fs.readFileSync(path.join(DATA_DIR, "transactions.json"), {
		encoding: "utf-8",
		flag: "r",
	});
	return JSON.parse(raw);
}

export function saveTransaction(transactions: Transaction[]): void {
	fs.writeFileSync(
		path.join(DATA_DIR, "transactions.json"),
		JSON.stringify(transactions, null, 2),
	);
}

export function loadClassificationRules(): ClassificationRule[] {
	const raw = fs.readFileSync(path.join(DATA_DIR, "classifications.json"), {
		encoding: "utf-8",
		flag: "r",
	});
	return JSON.parse(raw);
}

export function classify(recipient: string): Classification {
	const rules = loadClassificationRules();
	const match = rules.find((rule) =>
		rule.recipient.some(
			(name) => name.toLowerCase() === recipient.toLowerCase(),
		),
	);
	return match ? match.classification : "Unknown";
}

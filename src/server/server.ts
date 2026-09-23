import express from "express";

import {
	loadTransactions,
	saveTransactions,
	loadClassificationRules,
	classify,
} from "./data";

import type { Transaction } from "./data";

const app = express();
const PORT = 3000;

app.use(express.json());

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});

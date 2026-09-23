import express from "express";

import type { Request, Response } from "express";

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

// log the requests to terminal
app.use((req: Request, res: Response, next) => {
	res.on("finish", () => {
		console.log(`${req.method} ${req.url} ${res.statusCode}`);
	});

	next();
});

// Routes Here ↓↓↓ (eg GET, PUT, POST...)

// Catch all other paths and return 404
app.use((_req: Request, res: Response) => {
	res.status(404).json({ error: "Not Found" });
});

app.listen(PORT, () => {
	console.log(`Server is running on ${PORT}`);
});

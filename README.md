# Internet Bank Transaction App (Course Project)

A REST API with a terminal UI for managing bank transactions. The server stores transactions as JSON and auto-classifies them by recipient.

## Install

```bash
npm install
```

## Start the API

```bash
npm run server
```

Server runs at `http://localhost:3000`.

## Start the Terminal Application

Open a second terminal, then:

```bash
npm run client
```

The server must be running first.

## API Endpoints

Base URL: `http://localhost:3000`

### Transactions

| Method   | Endpoint            | Description            | Query Params                           | Request Body                     | Response                       |
| -------- | ------------------- | ---------------------- | -------------------------------------- | -------------------------------- | ------------------------------ |
| `GET`    | `/transactions`     | List all transactions  | `from` (YYYY-MM-DD), `to` (YYYY-MM-DD) | —                                | `Transaction[]`                |
| `GET`    | `/transactions/:id` | Get single transaction | —                                      | —                                | `Transaction`                  |
| `POST`   | `/transactions`     | Create transaction     | —                                      | `{ date, recipient, amount }`    | `201 { message, transaction }` |
| `PUT`    | `/transactions/:id` | Update transaction     | —                                      | `{ date?, recipient?, amount? }` | `{ message, transaction }`     |
| `DELETE` | `/transactions/:id` | Delete transaction     | —                                      | —                                | `{ message, transaction }`     |

### Classifications

| Method | Endpoint           | Description                   | Response               |
| ------ | ------------------ | ----------------------------- | ---------------------- |
| `GET`  | `/classifications` | List all classification rules | `ClassificationRule[]` |

### Request Body

`POST /transactions` — all fields required:

```json
{ "date": "2024-03-01", "recipient": "ICA", "amount": 150 }
```

`PUT /transactions/:id` — all fields optional:

```json
{ "date": "2024-03-01", "recipient": "ICA", "amount": 150 }
```

### Response Types

```ts
type Classification =
  | "Household"
  | "Transport"
  | "Food"
  | "Entertainment"
  | "Unknown";

interface Transaction {
  id: string; // UUID
  date: string; // YYYY-MM-DD
  recipient: string;
  amount: number; // always negative (debit)
  classification?: Classification;
}

interface ClassificationRule {
  recipient: string[];
  classification: Exclude<Classification, "Unknown">;
}
```

## Terminal Application

Launch with `npm run client`. Use arrow keys to navigate the menu, Enter to select.

| Option             | Description                                              |
| ------------------ | -------------------------------------------------------- |
| View transactions  | Display all transactions in a table                      |
| View a transaction | Select one transaction by date/recipient to view details |
| Add transaction    | Prompt for date, recipient, and amount, then create      |
| Delete transaction | Select a transaction, confirm, then delete               |
| Exit               | Quit the application                                     |

## Important Decisions

**Date filter bounds** — `from` and `to` are inclusive. A transaction on exactly the `from` or `to` date is included.

**Invalid dates** — requests with a malformed date (not `YYYY-MM-DD`) return `400 Bad Request`.

**`from` after `to`** — if `from > to`, the request returns `400 Bad Request`.

**No matching classification** — transactions whose recipient matches no rule get `classification: "Unknown"`. Classification is never stored, always derived at read time.

**Required fields on create** — `date`, `recipient`, and `amount` are all required. Missing or wrong type returns `400`.

**Updatable fields** — `date`, `recipient`, and `amount` can each be updated independently. Omitting a field leaves it unchanged.

**Amount sign** — positive `amount` values are automatically negated to keep all amounts negative (debits).

**Transaction not found** — `GET`, `PUT`, and `DELETE` on an unknown id return `404`.

**Invalid id format** — `:id` must be a valid UUID. Non-UUID values return `400`.

**HTTP status codes** — `200` for successful reads/updates/deletes, `201` for successful create, `400` for validation errors, `404` for missing resources.

**Race conditions** — `loadTransactions` and `saveTransactions` use synchronous I/O (`readFileSync`/`writeFileSync`). No race condition possible — Node.js is single-threaded and sync ops block the event loop, preventing handler interleaving.

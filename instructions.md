# Assignment: Internet Bank Transaction App

## Overview

In this assignment, you will build a small **Internet Bank Transaction App**.

The application will have:

- A REST API built with **Node.js, Express, and TypeScript**
- A terminal application using **`@inquirer/prompts`**
- Simulated external services using **JSON files**
- CRUD operations for transactions
- Automatic classification of outgoing transactions
- Date filtering
- GitHub Projects, Issues, Milestones, branches, and Pull Requests

You have **one week** to complete the assignment.

Keep the application simple. The goal is to practice the things you have learned, not to build a production-ready banking system.

---

# 1. Main User Story

Create a GitHub Issue for this user story:

> **As a user of the internet bank, I want to see the transactions in my savings account with a classification for each outgoing transaction.**

A transaction is anything that changes the balance of the savings account.

For example:

| Date | Recipient | Amount | Classification |
|---|---|---:|---|
| 2026-09-01 | ICA | -350 SEK | Food |
| 2026-09-02 | SL | -120 SEK | Transport |
| 2026-09-03 | Netflix | -149 SEK | Entertainment |
| 2026-09-04 | Employer | +30,000 SEK | — |

Only **outgoing transactions** need a classification.

The available classifications are:

- Household
- Transport
- Food
- Entertainment
- Unknown

---

# 2. Additional User Stories

In addition to the main user story, your application must support the following CRUD functionality.

## 2.1 Get All Transactions

> **As a user, I want to see my transactions so that I can understand what has happened to my savings account.**

Example endpoint:

```text
GET /transactions
```

The API should return the transactions.

Outgoing transactions should include their classification.

---

## 2.2 Get One Transaction

> **As a user, I want to see details about one transaction so that I can understand a specific transaction.**

Example endpoint:

```text
GET /transactions/:id
```

For example:

```text
GET /transactions/3
```

If the transaction does not exist, return an appropriate HTTP status and message.

---

## 2.3 Create a Transaction

> **As a bank employee, I want to add a transaction so that new transactions can be added to the system.**

Example endpoint:

```text
POST /transactions
```

Example request:

```json
{
  "date": "2026-09-10",
  "recipient": "ICA",
  "amount": -350
}
```

When an outgoing transaction is created, the application should automatically find its classification based on the recipient.

For example:

```text
ICA → Food
SL → Transport
Netflix → Entertainment
```

If the recipient cannot be matched, use:

```text
Unknown
```

You must decide which fields are required when creating a transaction.

Document your decision in the README.

---

## 2.4 Update a Transaction

> **As a bank employee, I want to update a transaction so that incorrect transaction information can be corrected.**

Example endpoint:

```text
PUT /transactions/:id
```

For example:

```text
PUT /transactions/3
```

You must decide which transaction fields can be updated.

For example, you might allow the date, recipient, and amount to be updated.

If the recipient changes, the classification should also be handled correctly.

If the transaction does not exist, return an appropriate HTTP status and message.

Document your decisions in the README.

---

## 2.5 Delete a Transaction

> **As a bank employee, I want to delete a transaction so that incorrect transactions can be removed from the system.**

Example endpoint:

```text
DELETE /transactions/:id
```

For example:

```text
DELETE /transactions/3
```

If the transaction does not exist, return an appropriate HTTP status and message.

---

## 2.6 Get Classifications

The application should also provide a way to get the available classifications.

Example endpoint:

```text
GET /classifications
```

The API should return:

```text
Household
Transport
Food
Entertainment
Unknown
```

You do **not** need to create, update, or delete classifications.

---

# 3. Date Filtering

The user should be able to enter a date interval.

For example:

```text
From: 2026-09-01
To: 2026-09-05
```

The application should then show transactions where the transaction date is inside the selected interval.

For example:

```text
2026-09-01 → 2026-09-05
```

You must decide:

- Are the start and end dates included?
- What happens if the date is invalid?
- What happens if the start date is after the end date?
- What happens if there are no transactions in the interval?

There is no single correct answer.

Document your decisions in the README.

---

# 4. Terminal Application

You must build a terminal application using:

- TypeScript
- `@inquirer/prompts`

The terminal application should provide a menu.

For example:

```text
=== Internet Bank ===

1. View transactions
2. View one transaction
3. Add transaction
4. Update transaction
5. Delete transaction
6. Filter transactions by date
7. Exit

Choose an option:
```

The exact menu design is up to you.

The user should be able to:

- View all transactions
- View one transaction
- Add a transaction
- Update a transaction
- Delete a transaction
- Filter transactions by date
- Exit the application

---

# 5. The Terminal App Must Use the API

The terminal application should communicate with your Express API.

For example:

```text
User
 ↓
Terminal application
 ↓
HTTP request
 ↓
Express API
 ↓
Data
 ↓
Express API
 ↓
Terminal application
 ↓
User
```

The terminal application should **not** access the transaction data directly.

For example, when the user chooses:

```text
View transactions
```

the terminal application should make a request such as:

```text
GET /transactions
```

The API returns the transactions, and the terminal application displays them.

---

# 6. API

Build the API using:

- Node.js
- Express
- TypeScript

At minimum, your API should provide:

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get one transaction |
| POST | `/transactions` | Create a transaction |
| PUT | `/transactions/:id` | Update a transaction |
| DELETE | `/transactions/:id` | Delete a transaction |
| GET | `/classifications` | Get available classifications |

You may use slightly different endpoint names or response formats if you have a good reason.

Your API should:

- Return JSON
- Use appropriate HTTP status codes
- Handle invalid input
- Handle transactions that do not exist
- Return reasonable error messages

---

# 7. Simulating External Services

In a real banking application, transaction data and classification data might come from different services.

For this assignment, you will **simulate these external services** using JSON files.

You can use a structure such as:

```text
data/
├── transactions.json
└── classifications.json
```

For example, `transactions.json` could contain:

```json
[
  {
    "id": 1,
    "date": "2026-09-01",
    "recipient": "ICA",
    "amount": -350
  },
  {
    "id": 2,
    "date": "2026-09-02",
    "recipient": "SL",
    "amount": -120
  },
  {
    "id": 3,
    "date": "2026-09-04",
    "recipient": "Employer",
    "amount": 30000
  }
]
```

Your classification data could look something like:

```json
[
  {
    "recipient": "ICA",
    "classification": "Food"
  },
  {
    "recipient": "SL",
    "classification": "Transport"
  },
  {
    "recipient": "Netflix",
    "classification": "Entertainment"
  }
]
```

These are only examples. You may create your own data.

When creating or updating an outgoing transaction, the application should use the classification data to find the classification.

If there is no match:

```text
Unknown
```

You do **not** need to connect to a real external service.

---

# 8. Keep the Application Simple

This assignment is designed to take approximately **one week**.

You do not need to build a production-ready banking application.

You do **not** need:

- A database
- User authentication
- User registration
- Passwords
- A frontend
- React
- Docker
- Cloud deployment
- A real external API
- Complex architecture

You can use:

- JSON files
- Arrays
- In-memory data

For example:

```ts
let transactions = [...]
```

is completely fine for this assignment.

The goal is to practice:

- TypeScript
- Express
- REST APIs
- CRUD
- HTTP requests
- Terminal applications
- Git and GitHub

---

# 9. Suggested Project Structure

You can use a simple project structure such as:

```text
project/
├── src/
│   ├── server.ts
│   ├── data.ts
│   └── cli.ts
│
├── data/
│   ├── transactions.json
│   └── classifications.json
│
├── package.json
├── tsconfig.json
└── README.md
```

A possible responsibility for each file:

### `server.ts`

Contains your Express server and API routes.

It is completely fine to keep all your routes in this file, similar to the CRUD examples you have worked with in class.

### `data.ts`

Can contain:

- TypeScript types
- Data loading
- Data handling

You can decide what makes sense for your application.

### `cli.ts`

Contains your terminal application and `@inquirer/prompts` code.

You do **not** need to create:

- Controllers
- Services
- Repositories
- Routers
- Complex folder structures

If you want to structure the project differently, that is allowed.

Keep it simple and explain your decisions.

---

# 10. GitHub Project

You must use **GitHub Projects** to organize your work.

Create a GitHub Project for the assignment.

Use your GitHub Project to track:

- What needs to be done
- What you are currently working on
- What is finished

Break the assignment into smaller GitHub Issues.

For example:

```text
Set up TypeScript project
Create transaction data
Create classification data
Create transaction types
Create GET /transactions
Create GET /transactions/:id
Create POST /transactions
Create PUT /transactions/:id
Create DELETE /transactions/:id
Create GET /classifications
Add date filtering
Create terminal menu
Add view transactions
Add view one transaction
Add create transaction
Add update transaction
Add delete transaction
Connect terminal app to API
Handle invalid input
Write README
```

You do not have to use exactly these issues.

Create issues that make sense for your implementation.

---

# 11. GitHub Milestones

Create at least **two milestones**.

For example:

## Milestone 1 — API

Possible issues:

- Project setup
- Transaction data
- Classification data
- Transaction types
- GET transactions
- GET one transaction
- POST transaction
- PUT transaction
- DELETE transaction
- GET classifications
- Date filtering

## Milestone 2 — Terminal Application

Possible issues:

- Create terminal menu
- View transactions
- View one transaction
- Add transaction
- Update transaction
- Delete transaction
- Date filtering
- Connect terminal app to API
- Handle invalid input

You can create additional milestones if useful.

---

# 12. Git Branches

Do not do all your work directly on `main`.

Create branches for your work.

For example:

```text
feature/transaction-api
feature/date-filter
feature/terminal-app
feature/create-transaction
feature/update-transaction
feature/delete-transaction
```

Try to keep each branch focused on one piece of work.

For example:

```text
feature/create-transaction
```

should mainly contain work related to creating transactions.

---

# 13. Pull Requests

When you finish a feature:

1. Push your branch to GitHub.
2. Create a Pull Request.
3. Explain what you changed.
4. Check the changes.
5. Merge the Pull Request into `main`.
6. Close the related issue if appropriate.

For example:

```text
Branch:
feature/create-transaction

Pull Request:
Add POST /transactions endpoint
```

The Pull Request should clearly explain what was implemented.

---

# 14. Commits

Use clear commit messages.

For example:

```text
Add transaction types
```

```text
Add GET transactions endpoint
```

```text
Add POST transaction endpoint
```

```text
Add date filtering
```

```text
Create terminal menu
```

```text
Connect CLI to API
```

```text
Handle invalid dates
```

Avoid commit messages such as:

```text
stuff
```

or:

```text
changes
```

Your commit history should help another developer understand how the project was built.

---

# 15. Code Quality

Your code should:

- Use TypeScript
- Have clear variable and function names
- Use types where appropriate
- Handle invalid input
- Handle errors
- Use reasonable HTTP status codes
- Avoid unnecessary duplicated code
- Be easy to understand

You should also keep the code reasonably organized.

You do **not** need advanced architecture.

Focus on writing code that another beginner TypeScript/Express developer could understand.

---

# 16. README

Your project must contain a `README.md`.

The README should explain:

## 1. What the application does

Give a short description of the project.

## 2. How to install it

For example:

```bash
npm install
```

## 3. How to start the API

For example:

```bash
npm run dev
```

Use the actual command from your project.

## 4. How to start the terminal application

Explain the command needed to start the CLI.

## 5. API Endpoints

Document your endpoints.

For example:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Get all transactions |
| GET | `/transactions/:id` | Get one transaction |
| POST | `/transactions` | Create transaction |
| PUT | `/transactions/:id` | Update transaction |
| DELETE | `/transactions/:id` | Delete transaction |
| GET | `/classifications` | Get classifications |

## 6. How to use the terminal application

Explain the available menu options.

## 7. Important Decisions

Explain decisions you made when the requirements were unclear.

For example:

- Are start/end dates included?
- What happens with invalid dates?
- What happens when there is no classification?
- Which fields are required when creating a transaction?
- Which fields can be updated?
- What happens when a transaction does not exist?
- Which HTTP status codes did you choose?

---

# 17. When Requirements Are Unclear

Some parts of this assignment are intentionally not fully specified.

This is similar to working on a real software project.

In a real team, you could ask a:

- Product Owner
- Business Analyst
- Developer
- Team member

for clarification.

For this assignment, you should make a **reasonable decision**.

For example, the assignment does not tell you exactly:

- What the API response should look like
- Which HTTP status codes to use
- Which fields are required
- Which fields can be updated
- How to handle invalid dates
- Whether date boundaries are included
- How to display transactions in the terminal
- What to do if a classification cannot be found

You decide.

There is not necessarily one correct answer.

What is important is that:

1. You make a reasonable decision.
2. Your application behaves consistently.
3. You document the decision in your README.

---

# 18. Optional Part

Only work on this section after you have completed the mandatory requirements.

Create a new GitHub Issue with an additional user story.

For example:

> **As a user, I want to see how much money I have spent in each category so that I can better understand my spending.**

You could then add functionality such as:

- Total spending per category
- Filter by classification
- Spending summary
- Change a classification
- Show the number of transactions per category

Choose one feature and implement it if you have time.

This part is **optional**.

---

# 19. Submission Checklist

Before submitting, make sure you have completed the following.

## Application

- [ ] Node.js
- [ ] Express
- [ ] TypeScript
- [ ] `@inquirer/prompts`
- [ ] Express API
- [ ] Terminal application
- [ ] Terminal application communicates with the API
- [ ] Get all transactions
- [ ] Get one transaction
- [ ] Create transaction
- [ ] Update transaction
- [ ] Delete transaction
- [ ] Classify outgoing transactions
- [ ] Household classification
- [ ] Transport classification
- [ ] Food classification
- [ ] Entertainment classification
- [ ] Unknown classification
- [ ] Date filtering
- [ ] Simulated external services using JSON
- [ ] Input validation
- [ ] Error handling
- [ ] Another developer can install and run the application

## GitHub

- [ ] GitHub Project
- [ ] GitHub Issues
- [ ] GitHub Milestones
- [ ] Git branches
- [ ] Pull Requests
- [ ] Features merged into `main`
- [ ] Clear commit messages
- [ ] README

---

# 20. Time Limit

You have **one week** to complete this assignment.

Focus on the mandatory requirements first.

Do not spend too much time making the application complicated.

A simple application that works well is better than a complicated application that is not finished.

Remember:

> **Make reasonable decisions, keep the code simple, and explain your decisions.**

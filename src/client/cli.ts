import { select, input, confirm } from "@inquirer/prompts";

const BASE_URL = "http://localhost:3000";

async function main() {
  console.log("======= Internet Back =======\n");
  while (true) {
    const action = await select({
      message: "What do you want to do?",
      choices: [
        { name: "View transactions", value: "all" },
        { name: "View a transaction", value: "one" },
        { name: "Exit", value: "exit" },
      ],
    });
    if (action === "exit") {
      break;
    }
  }
}

main();

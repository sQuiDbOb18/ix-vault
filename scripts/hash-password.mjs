import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const rl = createInterface({ input, output });

try {
  const password = await rl.question("Admin password to hash: ");
  if (password.length < 8) {
    console.error("Use at least 8 characters for the admin password.");
    process.exitCode = 1;
  } else {
    const hash = await bcrypt.hash(password, 12);
    console.log("\nPaste this into .env.local as ADMIN_PASSWORD_HASH:");
    console.log(hash);
  }
} finally {
  rl.close();
}

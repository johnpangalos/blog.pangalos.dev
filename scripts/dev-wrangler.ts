import "dotenv/config";
import { env, exit } from "process";
import { execSync } from "child_process";

const cloudflarePagesPrefix = "CFP_";

const bindings = Object.entries(env).filter((k) =>
  k[0].startsWith(cloudflarePagesPrefix)
);

const bindingsStr = bindings.reduce((acc, [k, v]) => {
  return acc + ` --binding ${k}=\"${v}\"`;
}, "");

const commandStr = `pnpm wrangler pages dev ./public --kv DEV_BLOG --watch ./build ${bindingsStr}`;
console.log(`\nRunning:\n${commandStr}\n`);

try {
  execSync(commandStr, {
    stdio: "inherit",
  });
} catch (e) {
  exit(1);
}

// replace-url.js
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// For ES Modules, get __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directory = path.join(__dirname, "src"); // adjust to your source folder
const oldUrl = "http://localhost:4000";
const newUrl = "https://lms-mern-s8k6.onrender.com";

function replaceInFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.lstatSync(filePath);
    if (stat.isDirectory()) {
      replaceInFiles(filePath);
    } else if (filePath.endsWith(".js") || filePath.endsWith(".jsx")) {
      let content = fs.readFileSync(filePath, "utf8");
      const newContent = content.split(oldUrl).join(newUrl);
      fs.writeFileSync(filePath, newContent, "utf8");
      console.log(`Updated: ${filePath}`);
    }
  }
}

replaceInFiles(directory);
console.log("✅ All URLs replaced!");

import http from "http";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const publicDir = path.join(__dirname, "public");

// Read an HTML file asynchronously and send it to the browser.
async function servePage(res, fileName, statusCode = 200) {
  try {
    const filePath = path.join(publicDir, fileName);
    const content = await readFile(filePath, "utf8");

    res.writeHead(statusCode, {
      "Content-Type": "text/html; charset=utf-8"
    });
    res.end(content);
  } catch (error) {
    console.error("File error:", error.message);
    await servePage(res, "404.html", 404);
  }
}

// Read and serve the CSS file asynchronously.
async function serveCss(res) {
  try {
    const cssPath = path.join(publicDir, "style.css");
    const css = await readFile(cssPath, "utf8");

    res.writeHead(200, {
      "Content-Type": "text/css; charset=utf-8"
    });
    res.end(css);
  } catch (error) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 - Unable to load stylesheet");
  }
}

// Create a basic Node.js HTTP server.
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);

  console.log(`${new Date().toISOString()} - ${req.method} ${url.pathname}`);

  // Only GET requests are required for this assignment.
  if (req.method !== "GET") {
    res.writeHead(405, {
      "Content-Type": "text/html; charset=utf-8",
      "Allow": "GET"
    });
    return res.end(`
      <h1>405 - Method Not Allowed</h1>
      <p>This server currently accepts GET requests only.</p>
    `);
  }

  // Routing for required pages.
  switch (url.pathname) {
    case "/":
    case "/home":
      return servePage(res, "home.html");

    case "/about":
      return servePage(res, "about.html");

    case "/contact":
      return servePage(res, "contact.html");

    case "/services":
      return servePage(res, "services.html");

    case "/style.css":
      return serveCss(res);

    // Custom 404 page for invalid routes.
    default:
      return servePage(res, "404.html", 404);
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log("Available routes:");
  console.log("  /home");
  console.log("  /about");
  console.log("  /contact");
  console.log("  /services");
  console.log("  Invalid routes -> custom 404 page");
});

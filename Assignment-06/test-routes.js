import http from "http";

const routes = ["/home", "/about", "/contact", "/services", "/invalid-route"];

function request(path) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:3000${path}`, (res) => {
      res.resume();
      res.on("end", () => resolve({ path, status: res.statusCode }));
    }).on("error", reject);
  });
}

const results = [];
for (const route of routes) {
  results.push(await request(route));
}

console.table(results);

export default async function handler(req, res) {
    const base = "https://api.helldivers2.dev";
  
    const { path = "/" } = req.query;
  
    const targetUrl = base + path;
  
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          "X-Super-Client": "helldivers2-toy",
          "X-Super-Contact": "1091329318@qq.com",
          "Content-Type": "application/json",
        },
        body: ["POST", "PUT", "PATCH"].includes(req.method)
          ? req.body
          : undefined,
      });
  
      const contentType = response.headers.get("content-type") || "";
      const data = await (contentType.includes("application/json")
        ? response.json()
        : response.text());
  
      res.status(response.status).send(data);
    } catch (e) {
      res.status(500).json({ error: "代理请求失败", detail: e.toString() });
    }
  }
  
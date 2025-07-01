import { URL } from 'url';

export default async function handler(req, res) {
    const base = "https://api.helldivers2.dev";
  
    const { path = "/" , ...restQuery } = req.query;
  
    let targetUrl;
    try {
      const url = new URL(path, base);
      Object.entries(restQuery).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
      targetUrl = url.toString();
    } catch (e) {
      res.status(400).json({ error: '无效的 path 参数', detail: e.toString() });
      return;
    }
  
    let body;
    if (["POST", "PUT", "PATCH"].includes(req.method)) {
      if (typeof req.body === 'object') {
        body = JSON.stringify(req.body);
      } else {
        body = req.body;
      }
    }
  
    try {
      const response = await fetch(targetUrl, {
        method: req.method,
        headers: {
          "X-Super-Client": "helldivers2-toy",
          "X-Super-Contact": "1091329318@qq.com",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body,
      });
  
      const contentType = response.headers.get("content-type") || "";
      res.setHeader('content-type', contentType);
      const data = await (contentType.includes("application/json")
        ? response.json()
        : response.text());
  
      res.status(response.status).send(data);
    } catch (e) {
      res.status(500).json({ error: "代理请求失败", detail: e.toString() });
    }
  }
  
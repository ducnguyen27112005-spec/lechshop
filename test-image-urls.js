const https = require('https');

const urls = [
    'https://img.icons8.com/color/512/threads.png',
    'https://img.icons8.com/color/512/shopee.png'
];

urls.forEach(url => {
    https.get(url, (res) => {
        console.log(`${url}: ${res.statusCode}`);
    });
});

import http from 'http';

http.get('http://localhost:3000/api/admin/product-orders', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Product API response:', data));
}).on('error', err => console.error(err));

http.get('http://localhost:3000/api/admin/social-orders', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log('Social API response:', data));
}).on('error', err => console.error(err));

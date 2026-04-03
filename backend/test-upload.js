const fs = require('fs');
require('dotenv').config({ path: './.env' });
const pw = process.env.ADMIN_PASSWORD;

fs.writeFileSync('test-img.txt', 'fake image content');

// Node 18+ native fetch
const formData = new FormData();
// Add file to formData
const blob = new Blob(['fake image data']);
formData.append('logo', blob, 'test.png');

fetch('http://localhost:5000/api/upload', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer ' + pw
  },
  body: formData
}).then(res => res.text()).then(t => {
  console.log('UPLOAD RESPONSE (status=' + t.status + '):', t);
  if (t.includes('url')) {
    const url = JSON.parse(t).url;
    fetch('http://localhost:5000/api/apps', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + pw,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name: 'Testing', logo_url: url, download_link: 'http' })
    }).then(r => r.text()).then(r2 => console.log('APPS POST:', r2));
  }
}).catch(console.error);

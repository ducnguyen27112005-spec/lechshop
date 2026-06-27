const bcrypt = require('bcryptjs');
const hash = '$2b$12$ARV2Fkb5AMLoa94X2xfGCOrMd8b/4SH3pBu8HfJvRUvSDh9lY7XL2';
const passes = ['0344948165', '123456', 'admin', 'password', 'lechshop', 'lechshop2026', 'admin@lechshop.vn'];

async function test() {
    for (const p of passes) {
        if (await bcrypt.compare(p, hash)) {
            console.log('Password is:', p);
            return;
        }
    }
    console.log('Password not found in common list');
}
test();

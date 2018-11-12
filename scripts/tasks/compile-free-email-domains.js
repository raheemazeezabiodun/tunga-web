const fs = require('fs'),
    path = require('path');

function freeEmailDomains() {
    return (fs.readFileSync(path.join(__dirname, 'free-email-domains.txt'), 'utf8') || '').split('\n');
}

fs.writeFile(path.join(__dirname, '..', '..', 'src', 'utils', 'free-email-domains.json'), JSON.stringify(freeEmailDomains(), null, 4), () => {});

console.log(freeEmailDomains());

const http = require('http');
const fs = require('fs');
const url = require('url');

const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    var realPath = "assets/" + url.parse(req.url).pathname;
    res.setHeader('Content-Type', 'text/plain');
    fs.readFile(realPath, 'utf-8', function(err, file) {
        if (err) throw err;
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        res.write(file, "binary");
        res.end();
    })
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
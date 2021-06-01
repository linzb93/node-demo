const pify = require('pify');
const fs = require('fs-extra');
const pSassRender = pify(require('node-sass').render);

pSassRender({
	file: 'atom.scss'
})
.then(ret => {
	fs.writeFile('atom.css', ret.css);
})
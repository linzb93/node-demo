const fs = require('fs-extra');
const pReduce = require('p-reduce');
const chalk = require('chalk');
const glob = require('glob');
const projectUrl = ''; // 在这里填写根目录
const colorMap = ['red', 'cyan', 'green', 'magenta', 'white', 'yellow'];
let colorIdx = 0;
const orgPrefixReg = /@[a-z0-9\-]+\//; // 匹配 @babel/ 字样
const pkgPrefixReg = /[a-z0-9]+\-/; // 匹配 vue- 字样
glob(`${projectUrl}/**/package.json`, async (err, files) => {
    let pkgs = await pReduce(files, async (map, file) => {
        const data = await fs.readJSON(file);
        return map
        .concat(data.dependencies ? Object.keys(data.dependencies) : [])
        .concat(data.devDependencies ? Object.keys(data.devDependencies) : [])
        .concat(data.peerDependencies ? Object.keys(data.peerDependencies) : []);
    }, []);
    pkgs = [...new Set(pkgs)];
    pkgs = pkgs.filter(item => !item.includes('@vue/') && !item.includes('@types/'));
    pkgs = pkgs.sort();
    console.log(pkgs.length);
    const output = pkgs.map((pkg, index) => {
        if (index === 0) {
            return chalk[colorMap[colorIdx]](pkg);
        }
        const prePkg = pkgs[index - 1];
        const hasSamePrefix = (pkg.match(orgPrefixReg) && prePkg.match(orgPrefixReg) && pkg.match(orgPrefixReg)[0] === prePkg.match(orgPrefixReg)[0]) ||
        (pkg.match(pkgPrefixReg) && prePkg.match(pkgPrefixReg) && pkg.match(pkgPrefixReg)[0] === prePkg.match(pkgPrefixReg)[0]);
        if (index !== 0 && !hasSamePrefix) {
            colorIdx++;
            if (colorIdx === colorMap.length) {
                colorIdx = 0;
            }
        }
        return chalk[colorMap[colorIdx]](pkg);
    }).join('\n');
    console.log(output);
})
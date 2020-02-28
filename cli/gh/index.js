const flagMap = {
  'g': 'g', // 从本地仓库拷贝到项目
  'u': 'u',  // 从项目拷贝到本地仓库
  'p': 'p',    // 从GitHub上拉取代码
};
module.exports = (args, flag) => {
  if (flagMap[flag]) {
    require(`./${flagMap[flag]}`)(args);
  }
}
const flagMap = {
  'i': 'init',
  'u': 'upload'
};
module.exports = (args, flag) => {
  if (flagMap[flag]) {
    require(`./${flagMap[flag]}`)(args);
  }
}
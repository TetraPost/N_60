function getJwtList() {
  const list = { secret: 'supersecret', exp: Math.floor(Date.now() / 1000) + (10) };
  return list;
}

module.exports.getJwtList = getJwtList;

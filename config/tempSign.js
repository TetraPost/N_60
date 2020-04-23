module.exports = {
  secret: 'supersecret',
  tokenLife: Math.floor(Date.now() / 1000) + (50),
  refreshTokenSecret: 'supersecretRefresh',
  refreshTokenLife: Math.floor(Date.now() / 1000) + (30),
};

// конфигурация базы данных
module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/tetra_database',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
};

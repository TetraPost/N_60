const express = require('express');

const homeRouter = express.Router();

const multer = require('multer');

const upload = multer({ dest: 'public/upload' });

const homeController = require('../controllers/homeController');

homeRouter.get('/', homeController.index);

/* Auth */
homeRouter.post('/auth', upload.none(), async (req, res) => {
  try {
    const data = ({ email: req.body.email, password: req.body.password });
    const dataToController = await homeController.sendDataToController(req, res, data);
    const load = dataToController;
    return res.json({ response: load });
  } catch (error) {
    return res.json({ response: { auth: false, message: 'Something went wrong' } });
  }
});


/* Проверяем кукки для отправки на другой сервер */
homeRouter.post('/getCookies', upload.none(), async (req, res, next) => {
  try {
    const getCookies = await homeController.getCookies(req, res);
    return res.json({ resp: getCookies });
  } catch (error) {
    console.log(error);
  }
});

/* Проверяем accesToken */
homeRouter.post('/checkAccessToken', upload.none(), async (req, res, next) => {
  try {
    const token = await homeController.checkAccessToken(req, res);
    return res.json({ resp: token });
  } catch (error) {
    console.log(error);
  }
});

module.exports = homeRouter;

const uniqid = require('uniqid');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const tempSign = require('../config/tempSign');

// const CookieModel = require('../models/cookie.js');

module.exports.index = async function (req, res) {
  res.render('index', { title: 'Auth N_58'});
};

/* Проверяем логин/пароль */
function checkCretential(data) {
  if (data.email === 'breaking_Bad@aol.com' && data.password === 'AaronPaul') {
    return true;
  }
  return false;
}

/* Подписываем AccessToken */
const setToken = async (data) => {
  const tokenList = {};
  const accesTime = Math.floor(Date.now() / 1000) + (10);
  const refreshTime = Math.floor(Date.now() / 1000) + (60);
  const token = jwt.sign({ id: data.email, name: 'Paul', exp: accesTime }, tempSign.secret);
  const refresh = jwt.sign({ id: data.email, name: 'Paul', exp: refreshTime }, tempSign.refreshTokenSecret);
  // const tokenList = jwt.sign({ id: data.email, name: 'Paul' }, tempSign.secret);
  const response = {
    act: token,
    rft: refresh,
    exp: accesTime,
  };
  tokenList[token] = response;
  // tokenList[refresh] = response; ??
  return response;
};

/* Проверяем куки */
const checkCookies = async (req, res, data) => {
  try {
    /* если в куках нет токена - присваиваем токен и возвращаем куки */
    if (!req.cookies.accessToken) {
      /* присваиваем токен */
      const valid = await setToken(data); // отправляем токены строкой
      return valid;
    }
    /* иначе возвращаем текущий куки */
    return req.cookies.accessToken;
  } catch (error) {
    console.log(error);
  }
};


const sendDataToController = async (req, res, data) => {
  try {
    /* Проверяем данные для авторизации */
    const check = await checkCretential(data);
    if (check) {
      /* нужно проверить наличие кук у нынешнего пользователя и наличие AccessToken */
      const payload = await checkCookies(req, res, data);
      const tokens = payload;
      res.cookie('accessToken', tokens, { httpOnly: true });
      return { auth: true, accessToken: payload };
    }
    /* Данные для авторизации не верны */
    return { auth: false, message: 'There was a problem with credential data.' };
  } catch (error) {
    console.log(error);
  }
};

/* Проверяем куки для отправки на другой сервер */
const getCookies = async (req, res) => {
  try {
    const cookiesCheck = req.cookies.accessToken;
    /* Если нет кук с accessToken - предлагаем пользователю авторизироваться */
    if (!cookiesCheck) {
      return { cookies: false, message: 'You must be a loging first' };
    }
    /* иначе - возвращаем текущие куки с accessToken для отправки на другой сервер */
    return { cookies: true, message: cookiesCheck.act };
  } catch (error) {
    console.log(error);
  }
};

/* Проверяем accesToken */
const checkAccessToken = async (req, res) => {
  try {
    const checkToken = req.cookies.accessToken;
    /* если грохнуть куки */
    if (!checkToken) {
      getCookies(req, res);
      const mess = ({ message: 'Кукки сброшены. Нужно авторизироваться', status: false });
      return mess;
    }
    let mess = '';
    let status = '';

    // console.log(checkToken.exp);
    // console.log(checkToken);

    if (Date.now() >= checkToken.exp * 1000) {
      /* раскодируем токен, вытянем данные юзверга */
      let user = '';
      const jwtS = await jwt.verify(checkToken.act, tempSign.secret, (err, decoded) => {
        if (err) {
          /* просроченый токен, собираем данные юзера */
          const dec = jwt.decode(checkToken.act, { complete: true });
          user = {
            email: dec.payload.id,
            name: dec.payload.name,
          };
          status = { data: false, payload: err.message };
        }
      });
      /* если ошибка - обновить токен */
      if (status.data === false) {
        const updateToken = await setToken(user);
        res.cookie('accessToken', updateToken, { httpOnly: true });
        mess = 'Токен обновлен';
      }
      mess = ({ message: mess, status: true });
    } else {
      /* все ок */
      mess = ({ message: 'Токен в порядке. Нечего не делаем', status: true });
    }
    return mess;
  } catch (error) {
    console.log(error);
  }
};

module.exports.checkAccessToken = checkAccessToken;
module.exports.getCookies = getCookies;
module.exports.sendDataToController = sendDataToController;

const form = document.forms.formAuth;
const resp = document.querySelector('.response');
const btnSend = document.querySelector('.btnSend');
const status = document.querySelector('.status');
const tokenStatus = document.querySelector('.tokenStatus');

let timerId;

function timer() {
  timerId = setTimeout(function tick() {
    checkAccessToken();
    timerId = setTimeout(tick, 4000);
  }, 2000);
}


async function checkAccessToken() {
  try {
    const TokenStatus = await axios.post('checkAccessToken');
    tokenStatus.innerHTML = TokenStatus.data.resp.message;
    if (TokenStatus.data.resp.status === false) {
      console.log('errrrrr');
      clearTimeout(timerId);
    }
  } catch (error) {
    console.log(error);
  }
}

/* Отправка в роут Авторизации */
async function sendPostData(data) {
  try {
    const response = await axios.post('auth', data);
    const dataRes = response.data;
    if (dataRes.response.auth === true) {
      resp.innerHTML = `<pre>${dataRes.response.accessToken}</pre>`;
      btnSend.classList.remove('disabled');
      /* запускаем скрипт проверки */
      timer();
      // checkAccessToken();
    } else {
      resp.innerHTML = dataRes.response.message;
    }
  } catch (error) {
    console.log(error);
  }
}

/* Событие */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const data = new FormData(form);
  sendPostData(data);
});

/* Отправка в роут получения кук текущего пользователя (авторизированого) */
async function sendData() {
  try {
    /* Читаем куки */
    const checkCookies = await axios.post('getCookies');
    if (checkCookies.data.resp.cookies) {
      /* collect data */
      const options = {
        method: 'POST',
        withCredentials: false, // if you need send cookie - change true. be ware with CORS
        crossDomain: true,
        data: { token: checkCookies.data.resp.message },
      };
      console.log(options);
      /* отправляем запрос на другой сервер */
      const send = await axios('http://localhost:4000/sendData', options);
      status.innerHTML = JSON.stringify(send.data);
    } else {
      status.innerHTML = checkCookies.data.resp.message; 
    }
  } catch (error) {
    console.log(error);
  }
};

/* Событие */
btnSend.onclick = () => {
  sendData();
};



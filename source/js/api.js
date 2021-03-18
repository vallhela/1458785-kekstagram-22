const getData = () => {
  return fetch('https://22.javascript.pages.academy/kekstagram/data')
    .then((response) =>{
      if(!response.ok){
        throw 'Не удалось получить фотографии. Попробуйте ещё раз';
      }

      return response.json();
    })
    .catch(() => {
      throw 'При загрузке данных с сервера произошла ошибка запроса';
    });
};

const sendData = (body) => {
  return fetch(
    'https://22.javascript.pages.academy/kekstagram',
    {
      method: 'POST',
      body,
    })
    .then((response) =>{
      if(!response.ok){
        throw 'Не удалось отправить форму. Попробуйте ещё раз';
      }
    });
};

export {getData, sendData};

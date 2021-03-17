import {createModal} from './modal.js';

const main = document.querySelector('main');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');
const successTemplate = document.querySelector('#success').content.querySelector('.success');

const showMessageBox = function(element, button){
  const modal = createModal(element);
  const onClick = function() {
    modal.close();
  };

  modal.onOpening = function(){
    main.appendChild(element);
  };

  modal.onClosing = function(){
    element.remove();
  };

  modal.onOpened = function(){
    element.addEventListener('click', onClick);
    button.addEventListener('click', onClick);
  };

  modal.onClosed = function(){
    button.removeEventListener('click', onClick);
    element.removeEventListener('click', onClick);
  }

  modal.open();
}

const showSuccessMessageBox = function () {
  const success = successTemplate.cloneNode(true);
  const successButton = success.querySelector('.success__button');

  showMessageBox(success, successButton);
};

const showErrorMessageBox = function () {
  const error = errorTemplate.cloneNode(true);
  const errorButton = error.querySelector('.error__button');

  showMessageBox(error, errorButton);
};

export {showSuccessMessageBox, showErrorMessageBox};

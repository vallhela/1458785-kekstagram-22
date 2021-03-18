import {isEscEvent} from './utils.js';

const createModal = function (element) {
  const modal = { };
  modal.context = { };
  modal.element = element;

  modal.onOpening = function(){
    modal.element.classList.remove('hidden');
    document.body.classList.add('modal-open');
  };

  modal.onClosing = function(){
    modal.element.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  modal.close = function(){
    if(modal.onClosing){
      modal.onClosing(modal);
    }

    document.removeEventListener('keydown', modal.onKeyDown);

    if(modal.onClosed){
      modal.onClosed(modal);
    }
  };

  modal.onKeyDown = function (evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();

      modal.close();
    }
  };

  modal.open = function(){
    if(modal.onOpening){
      modal.onOpening(modal);
    }

    document.addEventListener('keydown', modal.onKeyDown);

    if(modal.onOpened){
      modal.onOpened(modal);
    }
  }

  return modal;
};

export {createModal}

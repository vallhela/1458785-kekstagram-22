import {createModal} from './modal.js';
import {isValidLength, isEscEvent} from './utils.js';
import {showSuccessMessageBox, showErrorMessageBox} from './message-box.js';
import {sendData} from './api.js';

const SCALE_DEFAULT_VALUE = 100;
const SCALE_MIN_VALUE = 25;
const SCALE_MAX_VALUE = 100;
const SCALE_STEP_VALUE = 25;
const EFFECT_DEFAULT = 'effects__preview--none';
const DESCRIPTION_MAX_LENGTH = 140;
const HASHTAG_MIN_LENGTH = 1;
const HASHTAG_MAX_LENGTH = 20;
const HASHTAG_MAX_COUNT = 5;
const LETTERS = /^[0-9a-zA-Zа-яА-Я]+$/;
const FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

const noUiSlider = window.noUiSlider;

const pictureUploadModal = document.querySelector('.img-upload__overlay');
const pictureStartUploadInput = document.querySelector('#upload-file');
const pictureCancelUploadButton = pictureUploadModal.querySelector('#upload-cancel');

// Переменные для масштабирования
const scaleSmallerButton = pictureUploadModal.querySelector('.scale__control--smaller');
const scaleBiggerButton = pictureUploadModal.querySelector('.scale__control--bigger');
const scaleValue = pictureUploadModal.querySelector('.scale__control--value');
const previewContainer = document.querySelector('.img-upload__preview');
const previewImg = previewContainer.querySelector('img');

// Переменные для наложения эффектов
const effects = {
  chrome: {
    getSliderOptions: function() {
      return {
        min: 0,
        max: 1,
        initial: 1,
        step: 0.1,
      };
    },
    set: function(element, value){
      element.style.filter = 'grayscale(' + value + ')';
    },
  },
  sepia: {
    getSliderOptions: function() {
      return {
        min: 0,
        max: 1,
        initial: 1,
        step: 0.1,
      };
    },
    set: function(element, value){
      element.style.filter = 'sepia(' + value + ')';
    },
  },
  marvin: {
    getSliderOptions: function() {
      return {
        min: 0,
        max: 100,
        initial: 100,
        step: 1,
      };
    },
    set: function(element, value){
      element.style.filter = 'invert(' + value + '%)';
    },
  },
  phobos: {
    getSliderOptions: function() {
      return {
        min: 0,
        max: 3,
        initial: 3,
        step: 0.1,
      };
    },
    set: function(element, value){
      element.style.filter = 'blur(' + value + 'px)';
    },
  },
  heat: {
    getSliderOptions: function() {
      return {
        min: 1,
        max: 3,
        initial: 3,
        step: 0.1,
      };
    },
    set: function(element, value){
      element.style.filter = 'brightness(' + value + ')';
    },
  },
  getByClass: function(effectClass){
    switch (effectClass) {
      case 'effects__preview--chrome':
        return this.chrome;
      case 'effects__preview--sepia':
        return this.sepia;
      case 'effects__preview--marvin':
        return this.marvin;
      case 'effects__preview--phobos':
        return this.phobos;
      case 'effects__preview--heat':
        return this.heat;
      default:
        return undefined;
    }
  },
};
const effectsList = document.querySelector('.img-upload__effects');
const effectRadioButtons = document.querySelectorAll('.effects__radio');
const effectsClasses = document.querySelectorAll('.effects__preview');
const effectsSliderContainer = document.querySelector('.img-upload__effect-level');
const effectsSlider = effectsSliderContainer.querySelector('.effect-level__slider');
const effectsSliderValue = effectsSliderContainer.querySelector('.effect-level__value');

//Переменные валидации формы
const uploadForm = document.querySelector('.img-upload__form');
const uploadFormText = document.querySelector('.img-upload__text');
const hashtagInput = uploadFormText.querySelector('.text__hashtags');
const descriptionInput = uploadFormText.querySelector('.text__description');

const submitButton = document.querySelector('#upload-submit');

const setScale = function(scale){
  scaleValue.value = scale + '%';
  previewImg.style.transform = 'scale(' + (scale / 100) + ')';
}

pictureStartUploadInput.addEventListener('change', function() {
  const file = pictureStartUploadInput.files[0];
  const fileName = file.name.toLowerCase();

  const matches = FILE_TYPES.some((it) => {
    return fileName.endsWith(it);
  });

  if (matches) {
    const reader = new FileReader();

    reader.addEventListener('load', () => {
      previewImg.src = reader.result;
    });

    reader.readAsDataURL(file);
  }

  setScale(SCALE_DEFAULT_VALUE);
  const modal = createModal(pictureUploadModal);
  const onPictureCancelUploadButtonClicked = function(){
    modal.close();
  };

  const onUploadFormSubmitted = function(evt){
    evt.preventDefault();

    sendData(new FormData(evt.target))
      .then(() =>{
        modal.close();
        showSuccessMessageBox();
      })
      .catch(() =>
      {
        modal.close();
        showErrorMessageBox();
      });
  };

  modal.onOpened = function(){
    pictureCancelUploadButton.addEventListener('click', onPictureCancelUploadButtonClicked);
    uploadForm.addEventListener('submit', onUploadFormSubmitted);
  };

  modal.onClosed = function(){
    uploadForm.removeEventListener('submit', onUploadFormSubmitted);
    pictureCancelUploadButton.removeEventListener('click', onPictureCancelUploadButtonClicked);
    setEffect(EFFECT_DEFAULT);
    setScale(SCALE_DEFAULT_VALUE);
    pictureStartUploadInput.value = '';
    descriptionInput.value = '';
    hashtagInput.value = '';
  };

  setEffect(EFFECT_DEFAULT);
  modal.open();
});

// ------------------Масштабирование----------------------------

scaleSmallerButton.addEventListener('click', function() {
  let scale = parseInt(scaleValue.value);
  scale = scale - SCALE_STEP_VALUE;

  if (scale < SCALE_MIN_VALUE) {
    scale = SCALE_MIN_VALUE;
  }

  setScale(scale);
});

scaleBiggerButton.addEventListener('click', function() {
  let scale = parseInt(scaleValue.value);
  scale = scale + SCALE_STEP_VALUE;

  if(scale > SCALE_MAX_VALUE) {
    scale = SCALE_MAX_VALUE;
  }

  setScale(scale);
});

// ------------------Наложение эффектов----------------------------

const setEffect = function(effectClass) {
  previewImg.className = '';
  previewImg.style.filter = '';
  previewImg.classList.add(effectClass);

  const radioButtonId = effectClass.replace('s__preview-','');
  const radio = effectsList.querySelector('#' + radioButtonId);
  radio.checked = true;

  const effect = effects.getByClass(effectClass);
  if (effect) {
    const sliderOptions = effect.getSliderOptions();
    effect.set(previewImg, sliderOptions.initial);

    effectsSlider.noUiSlider.updateOptions({
      range:{
        min: sliderOptions.min,
        max: sliderOptions.max,
      },
      start: sliderOptions.initial,
      step: sliderOptions.step,
    });

    effectsSliderContainer.classList.remove('hidden');
  }
  else {
    effectsSliderContainer.classList.add('hidden');
  }
};

const initializeSlider = function() {
  noUiSlider.create(effectsSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
  });

  effectsSlider.noUiSlider.on('update', (values, handle) => {
    const effect = effects.getByClass(previewImg.className);
    if (effect) {
      const value = values[handle];
      const initial = effect.getSliderOptions().initial;
      effectsSliderValue.value = (100*(+value)/(+initial)).toFixed(0);
      effect.set(previewImg, value);
    }
    else{
      effectsSliderValue.value = '';
    }
  });
};

effectsList.addEventListener('change', function() {
  for (let i = 0; i < effectRadioButtons.length; i++) {
    if (effectRadioButtons[i].checked) {
      const effect = effectsClasses[i].classList[1];
      setEffect(effect);
    }
  }
});

// ------------------Валидация формы----------------------------

hashtagInput.addEventListener('keydown', (evt) => {
  if (isEscEvent(evt)) {
    evt.stopPropagation();
  }
});

const validateHashtag = function (hashtag) {
  if (hashtag[0] !== '#') {
    return 'Хэш-тег должен начинаться с #';
  }

  if (hashtag.length === HASHTAG_MIN_LENGTH) {
    return 'Хэш-тег не может состоять только из одной #';
  }

  if (hashtag.length > HASHTAG_MAX_LENGTH) {
    return 'Максимальная длина одного хэш-тега 20 символов, включая #';
  }

  if (!hashtag.substring(1).match(LETTERS)) {
    return 'Cтрока после решётки должна состоять из букв и чисел и не может содержать пробелы, спецсимволы (#, @, $ и т. п.), символы пунктуации (тире, дефис, запятая и т. п.), эмодзи и т. д.';
  }

  return null;
};

const validateHashtags = function (hashtags) {

  if (hashtags.length !== [...new Set(hashtags)].length) {
    return 'Oдин и тот же хэш-тег не может быть использован дважды';
  }

  if (hashtags.length > HASHTAG_MAX_COUNT) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }

  for (let hashtag of hashtags) {
    const errorMessage = validateHashtag(hashtag);
    if (errorMessage !== null) {
      return errorMessage;
    }
  }

  return null;
};

hashtagInput.addEventListener('input', () => {
  const hashtagText = hashtagInput.value;
  const hashtags = hashtagText.split(' ').map(p => p.toLowerCase());

  const errorMessage = validateHashtags(hashtags);

  if (errorMessage !== null) {
    hashtagInput.setCustomValidity(errorMessage);
  } else {
    hashtagInput.setCustomValidity('');
  }

  hashtagInput.reportValidity();
});

descriptionInput.addEventListener('keydown', (evt) => {
  if (isEscEvent(evt)) {
    evt.stopPropagation();
  }
});

descriptionInput.addEventListener('input', () => {
  const descriptionLength = descriptionInput.value.length;

  if (isValidLength(descriptionLength, DESCRIPTION_MAX_LENGTH)) {
    descriptionInput.setCustomValidity('Использовано ' + descriptionLength +' симв. из ' + DESCRIPTION_MAX_LENGTH);
  } else if (descriptionLength  > DESCRIPTION_MAX_LENGTH) {
    descriptionInput.setCustomValidity('Удалите лишние ' + (descriptionLength - DESCRIPTION_MAX_LENGTH) +' симв.');
  } else {
    descriptionInput.setCustomValidity('');
  }
  descriptionInput.reportValidity();
});

submitButton.addEventListener('click', function() {
  submitButton.focus();
});

initializeSlider();

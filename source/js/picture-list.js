/* global _:readonly */
import {showPictureModal} from './picture-modal.js';
import {getRandomUniqueArrayElements} from './utils.js';

const PICTURES_COUNT_DEFAULT = 25;
const PICTURES_COUNT_RANDOM = 10;
const UPDATE_FILTER_DEBOUNCE_DELAY = 500;

const pictures = [];

const pictureContainer = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
const filter = document.querySelector('.img-filters');
const filterDefault = filter.querySelector('#filter-default');
const filterRandom = filter.querySelector('#filter-random');
const filterDiscussed = filter.querySelector('#filter-discussed');

const render = (pics) => {
  const existingPictures = pictureContainer.querySelectorAll('.picture');
  for (let existingPicture of existingPictures) {
    existingPicture.parentNode.removeChild(existingPicture);
  }

  const picturesListFragment = document.createDocumentFragment();
  pics
    .slice(0, PICTURES_COUNT_DEFAULT)
    .forEach((pic) => {
      const picture = pictureTemplate.cloneNode(true);
      picture.querySelector('.picture__img').src = pic.url;
      picture.querySelector('.picture__comments').textContent = pic.comments.length;
      picture.querySelector('.picture__likes').textContent = pic.likes;

      picture.addEventListener('click', () => {
        showPictureModal(pic);
      });

      picturesListFragment.appendChild(picture);
    });

  pictureContainer.appendChild(picturesListFragment);
};

const updateFilter = _.debounce(
  function (filter) {
    const filtered = filter(pictures);
    render(filtered);
  },
  UPDATE_FILTER_DEBOUNCE_DELAY);

const updateFilterButtons = function (selectedFilterButton) {
  if (selectedFilterButton !== filterDefault) {
    filterDefault.classList.remove('img-filters__button--active');
  }
  if (selectedFilterButton !== filterRandom) {
    filterRandom.classList.remove('img-filters__button--active');
  }
  if (selectedFilterButton !== filterDiscussed) {
    filterDiscussed.classList.remove('img-filters__button--active');
  }

  selectedFilterButton.classList.add('img-filters__button--active');
};

const getFilterFunction = function(selectedFilterButton){
  if (filterRandom === selectedFilterButton) {
    return (pics) => getRandomUniqueArrayElements(pics, PICTURES_COUNT_RANDOM);
  }
  else if (filterDiscussed === selectedFilterButton) {
    return (pics) => pics.slice().sort((a, b) => b.comments.length - a.comments.length);
  }

  return (pics) => pics;
}

const setFilter = function(selectedFilterButton){
  updateFilterButtons(selectedFilterButton);

  const filter = getFilterFunction(selectedFilterButton);
  updateFilter(filter);
}

const onFilterClicked = function(evt){
  const clickedButton = evt.target;
  setFilter(clickedButton);
}

filterDefault.addEventListener('click', onFilterClicked);
filterRandom.addEventListener('click', onFilterClicked);
filterDiscussed.addEventListener('click', onFilterClicked);

const initializePictureList = function (pics) {
  pictures.push(...pics);
  setFilter(filterDefault);

  filter.classList.remove('img-filters--inactive');
};

export {initializePictureList};

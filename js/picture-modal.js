import {createModal} from './modal.js';
import {removeChildren} from './utils.js';

const COMMENTS_BATCH_SIZE = 5;
const COMMENT_IMAGE_HEIGHT = 35;
const COMMENT_IMAGE_WIDTH = 35;

const bigPictureView = document.querySelector('.big-picture');
const bigPictureClose = bigPictureView.querySelector('.big-picture__cancel');

const bigPictureImage = bigPictureView.querySelector('.big-picture__img').children[0];
const bigPictureLikes = bigPictureView.querySelector('.likes-count');
const bigPictureCommentsCount = bigPictureView.querySelector('.comments-count');
const bigPictureComments = bigPictureView.querySelector('.social__comments');
const bigPictureDescription = bigPictureView.querySelector('.social__caption');
const bigPictureCommentsLoader = bigPictureView.querySelector('.comments-loader');
const bigPictureSocialCommentCount = bigPictureView.querySelector('.social__comment-count');

const createComment = function (comment) {
  const img = document.createElement('img');
  img.classList.add('social__picture');
  img.src = comment.avatar;
  img.alt = comment.name;
  img.height = COMMENT_IMAGE_HEIGHT;
  img.width = COMMENT_IMAGE_WIDTH;

  const p = document.createElement('p');
  p.classList.add('social__text');
  p.textContent = comment.message;

  const li = document.createElement('li');
  li.classList.add('social__comment');
  li.appendChild(img);
  li.appendChild(p);

  return li;
};

const showPictureModal = function (picture) {
  bigPictureImage.src = picture.url;
  bigPictureLikes.textContent = picture.likes;
  bigPictureCommentsCount.textContent = picture.comments.length;
  bigPictureDescription.textContent = picture.description;

  removeChildren(bigPictureComments);

  const modal = createModal();
  modal.context.picture = picture;
  modal.context.showedComments = [];
  modal.context.showNextComments = function(){
    const batchCount = Math.floor((modal.context.showedComments.length/COMMENTS_BATCH_SIZE));
    const nextBatchCount = batchCount+1;

    const commentsToAppend = modal.context.picture.comments.slice(
      batchCount*COMMENTS_BATCH_SIZE,
      Math.max(0, Math.min(modal.context.picture.comments.length, nextBatchCount*COMMENTS_BATCH_SIZE)));

    commentsToAppend.forEach(comment => {
      bigPictureComments.appendChild(createComment(comment));
    });

    modal.context.showedComments.push(...commentsToAppend);
    removeChildren(bigPictureSocialCommentCount);

    bigPictureSocialCommentCount.innerHTML = modal.context.showedComments.length + ' из <span class="comments-count">'+modal.context.picture.comments.length+'</span> комментариев';
    if(modal.context.showedComments.length < modal.context.picture.comments.length){
      bigPictureCommentsLoader.classList.remove('hidden');
    }
    else{
      bigPictureCommentsLoader.classList.add('hidden');
    }
  };

  const onBigPictureCloseClicked = function(){
    modal.close();
  }

  const onBigPictureCommentsLoaderClicked = function(){
    modal.context.showNextComments();
  }

  modal.onOpened = function(){
    bigPictureClose.addEventListener('click', onBigPictureCloseClicked);
    bigPictureCommentsLoader.addEventListener('click', onBigPictureCommentsLoaderClicked);
  }

  modal.onClosed = function(){
    bigPictureClose.removeEventListener('click', onBigPictureCloseClicked);
    bigPictureCommentsLoader.removeEventListener('click', onBigPictureCommentsLoaderClicked);
  };

  modal.context.showNextComments();
  modal.open();
};

export {showPictureModal};

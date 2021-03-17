import './picture-upload.js';
import {getData} from './api.js';
import {initializePictureList} from './picture-list.js';
import {showError} from './error-message.js';

getData()
  .then((pictures) => initializePictureList(pictures))
  .catch((error) => showError(error));

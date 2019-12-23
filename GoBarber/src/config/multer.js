import multer from 'multer';
import crypto from 'crypto';
import { extname, resolve } from 'path';

export default {
  /**
   * Storage is how the multer will save our image files
   * we can use various types of storage that multer has as cdn content
   * delivery network, like amazon images
   */
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'),
    // this file name is how we'll format the name to database.
    filename: (req, file, cb) => {
      // this is a unique code to identify the image files
      // the first parameter is the number of numbers in bytes the second is a callback that replaces the asynchronous function
      crypto.randomBytes(16, (err, res) => {
        // if the cb catch the error, return the crypto a error.
        if (err) return cb(err);
        /**
         * the callback'll convert the crypto random bytes in hexadecimal and
         * add the image extension such as h2h342893.png
         */

        return cb(null, res.toString('hex') + extname(file.originalname));
      });
    },
  }),
};

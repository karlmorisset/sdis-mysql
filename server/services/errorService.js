import { format } from 'date-fns';
import fs from 'node:fs/promises';

export default class ErrorService {
  /**
   * Enregistre une nouvelle erreur dans un fichier de log
   * @param {Error} err
   * @param {Response} res
   * @param {Number} code
   */
  static async record(err, res = null, code = null) {
    try {
      const data = await this.formatError(err, code);

      fs.appendFile('.errors.log', data, 'utf8', () => {});

      if (res) return res.status(code).render(`pages/errors/${code}`);

      return res.end();
    } catch (error) {
      console.error(error);
    }
  }

  /**
   * Permet de formater le message d'erreur à logguer
   * @param {Error} err
   * @param {Number} code
   * @returns {String}
   */
  static formatError(err, code = null) {
    return new Promise((resolve) => {
      const date = format(new Date(), 'dd/MM/yyyy - HH:mm:ss');
      const codeStr = code ? `Code: ${code}` : 'Code inconnu';
      const message = JSON.stringify(err.message);

      resolve(`${date}\t${codeStr}\t${message}\n`);
    });
  }

  static handleValidationError(error) {
    return new Promise((resolve, reject) => {
      try {
        const errors = {};

        if (error.name && error.name === 'ValidationError') {
          const fields = Object.values(error.errors);
          fields.forEach((f) => {
            errors[f.properties.path] = f.properties.message;
          });
        }

        if (error.code && error.code === 11000) {
          const fieldName = Object.keys(error.keyValue)[0];
          const fieldValue = Object.values(error.keyValue)[0];

          errors[fieldName] = `${fieldValue} est déjà utilisé`;
        }
        resolve({ errors });
      } catch (err) {
        reject(err);
      }
    });
  }

  static handleSQLValidationError(error) {
    return new Promise((resolve, reject) => {
      try {
        const errors = {};

        if (
          error?.errors?.length > 0 &&
          error?.errors[0].constructor.name === 'ValidationErrorItem'
        ) {
          error.errors.forEach((f) => {
            errors[f.path] = f.message;
          });
        }

        if (error.code && error.code === 11000) {
          const fieldName = Object.keys(error.keyValue)[0];
          const fieldValue = Object.values(error.keyValue)[0];

          errors[fieldName] = `${fieldValue} est déjà utilisé`;
        }
        resolve({ errors });
      } catch (err) {
        reject(err);
      }
    });
  }
}

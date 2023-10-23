import ValidationErrorItem from './ValidationErrorItem';

export default class ValidationErrorSQL extends Error {
  constructor(message, data) {
    super(message);
    this.errors = [];
    this.name = 'ValidationErrorItem';

    this.buildErrorObject(data);
  }

  buildErrorObject(data) {
    Object.keys(data).forEach((k) => {
      this.errors.push(new ValidationErrorItem(data[k]));
    });
  }
}

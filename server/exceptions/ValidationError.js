export default class ValidationError extends Error {
  constructor(message, data) {
    super(message);
    this.errors = {};
    this.name = 'ValidationError';

    this.buildErrorObject(data);
  }

  buildErrorObject(data) {
    Object.keys(data).forEach((field) => {
      this.errors[field] = {
        properties: {
          message: data[field].message,
          type: 'invalid credentials',
          path: field,
          value: data[field].value,
        },
        kind: 'invalid credentials',
        path: field,
        value: data[field].value,
        message: data[field].message,
      };
    });
  }
}

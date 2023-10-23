export default class ValidationErrorItem {
  constructor(data) {
    this.name = 'ValidationErrorItem';
    this.path = data.path;
    this.message = data.message;
  }
}

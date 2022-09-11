// MVC design pattern
// check out https://www.taniarascia.com/javascript-mvc-todo-app/
// this file stores the abstract class

class Model {
  constructor(database) {
    this.database = database;
  }
}

class View {
  constructor() {}
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

// MVC design pattern
// check out https://www.taniarascia.com/javascript-mvc-todo-app/
// this file stores the abstract class

export class Database {
  constructor() {}
  execute_query(sql) {}
}

export class Model {
  constructor() {}
}

export class View {
  constructor() {}
}

export class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

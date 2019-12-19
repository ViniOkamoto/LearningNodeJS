import Sequelize from 'sequelize';
import databaseConfig from '../config/database';
import User from '../app/models/User';

const models = [User];
// This is where we make our database connection
class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    // this is where we scroll to database to search the entity
    models.map(model => model.init(this.connection));
  }
}

export default new Database();

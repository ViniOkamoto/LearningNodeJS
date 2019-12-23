import { Model, Sequelize } from 'sequelize';
// Here is the model, where we set what the user/client must to send by body request
class File extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        path: Sequelize.STRING,
      },
      {
        sequelize,
      }
    );
    // This return will bring the model that is running
    return this;
  }
}

export default File;

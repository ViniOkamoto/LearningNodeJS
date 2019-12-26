import { Model, Sequelize } from 'sequelize';
// Here is the model, where we set what the user/client must to send by body request
class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
      },
      {
        // This sequelize will render the model
        sequelize,
      }
    );
    // This return will bring the model that is running
    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;

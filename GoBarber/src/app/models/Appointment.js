import { Model, Sequelize } from 'sequelize';
import { isBefore, subHours } from 'date-fns';
// Here is the model, where we set what the user/client must to send by body request
class Appointment extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        canceled_at: Sequelize.DATE,
        // Past checks if the appointment has already happened
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
        // Cancelable checks if the current time is 2 hours before the appointment time
        cancelable: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(new Date(subHours(this.date, 2)));
          },
        },
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
    // always that we have 2 foreign keys we must to identify the column with the "as"
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.User, { foreignKey: 'provider_id', as: 'provider' });
  }
}

export default Appointment;

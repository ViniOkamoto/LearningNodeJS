import { format, parseISO } from 'date-fns';
import { pt } from 'date-fns/locale';
import Mail from '../../lib/Mail';

class CancellationMail {
  /**
   * When we use get, we can access the property within the class without calling the method.
   * import CancellationMail from '..';
   * CancellationMail.key();
   */
  get key() {
    // for each job we need a unique key.
    return 'CancellationMail';
  }

  // inside from data, we have the informations we need.
  async handle({ data }) {
    const { appointment } = data;

    console.log('Passou');

    await Mail.sendMail({
      to: `${appointment.provider.name} <${appointment.provider.email}>`,
      subject: 'Agendamento cancelado',
      template: 'cancellation',
      context: {
        provider: appointment.provider.name,
        user: appointment.user.name,
        date: format(
          parseISO(appointment.date),
          "'dia' dd 'de' MMMM', às' H:mm'h'",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CancellationMail();

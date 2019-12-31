import {
  startOfDay,
  endOfDay,
  format,
  setSeconds,
  setMinutes,
  setHours,
  isAfter,
} from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';

class AvailableController {
  async index(req, res) {
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Invalid date' });
    }

    // Convert string date to number
    const searchDate = Number(date);
    // Search the appointments that will occur on the day
    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.params.providerId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
    });
    // Hours schedule
    const schedule = [
      '08:00',
      '09:00',
      '10:00',
      '11:00',
      '12:00',
      '13:00',
      '14:00',
      '15:00',
      '16:00',
      '17:00',
      '18:00',
    ];

    const available = schedule.map(time => {
      // split the hour and minute from hours schedule
      const [hour, minute] = time.split(':');
      const formatTime = setSeconds(
        setMinutes(setHours(searchDate, hour), minute),
        0
      );
      // here is what we will return
      return {
        time,
        formatTime: format(formatTime, "yyyy-MM-dd'T'HH:mm:ssxx"),
        available:
          // check if format time is after new date, if yes then true
          isAfter(formatTime, new Date()) &&
          // check if the time is available
          !appointments.find(entity => format(entity.date, 'HH:mm') === time),
      };
    });

    return res.json(available);
  }
}

export default new AvailableController();

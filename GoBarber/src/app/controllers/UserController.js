import User from '../models/User';

class UserController {
  async store(req, res) {
    // The store is a method that creates and saves data in the database.
    // Here we are verifing if the user already exists.
    const userExists = await User.findOne({ where: { email: req.body.email } });
    if (userExists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.json({ id, name, email, provider });
  }

  async update(req, res) {
    const { email, oldPassword } = req.body;
    // this id is coming from authMiddleware in routes file.
    const user = await User.findByPk(req.userId);
    // Here I confirm that the email the user is sending already exists.
    if (email !== user.email) {
      const userExists = await User.findOne({ where: { email } });
      if (userExists) {
        return res.status(400).json({ error: 'Email is already in use' });
      }
    }
    // This is where I confirm if the user wants to change the password and if the password matches the old one
    if (oldPassword && !(await user.checkPassword(oldPassword))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name, provider } = await user.update(req.body);

    return res.json({ id, name, email, provider });
  }
}

export default new UserController();

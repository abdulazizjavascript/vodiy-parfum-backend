const Users = require("../models/userModel");

const userCtrl = {
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user)
        return res.status(400).json({ msg: "Foydalanuvchi mavjud emas." });
      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUsers: async (req, res) => {
    try {
      const users = await Users.find({ role: 0 });
      res.json(users);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { firstName, lastName, username, phoneNumber, password } = req.body;

      const user = await Users.findOneAndUpdate(
        { _id: req.params.id },
        {
          firstName,
          lastName,
          username,
          phoneNumber,
          password,
        },
        {
          new: true,
          runValidors: true,
        }
      );

      res.json(user);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      await Users.findByIdAndDelete(req.params.id);
      res.json({ msg: "Foydalanuvchi o'chirildi" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};


module.exports = userCtrl;

const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Products = require("../models/productModel");

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find({ status: req.params.id });
      res.json(payments);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select(
        "name lname login phoneNumber address"
      );
      if (!user)
        return res.status(400).json({ msg: "Foydalanuvchi mavjud emas !" });
      const { cart2, comment } = req.body;

      const { _id, name, lname, login, phoneNumber, address } = user;

      // cart.forEach((item) => {
      //   if (item.quantity > item.number) {
      //     return res
      //       .status(400)
      //       .json({ msg: "Bizda buncha mahsulot mavjud emas !" });
      //   }
      // });

      const newPayment = new Payments({
        user_id: _id,
        name,
        lname,
        login,
        address,
        phoneNumber,
        cart: cart2,
        comment,
      });

      cart2.filter((item) => {
        return sold(item._id, item.quantity, item.sold, item.number);
      });

      await newPayment.save();
      res.json({ msg: "Buyurtmangiz jo'natildi", newPayment });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  sendConfirm: async (req, res) => {
    try {
      const product = await Payments.findOne({ _id: req.params.id });
      product.status = true;
      await Payments.findOneAndUpdate({ _id: req.params.id }, product);
      res.json({ msg: "Buyurtma yetkazib berildi !" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

const sold = async (id, quantity, oldSold, number) => {
  await Products.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
      number: number - quantity,
    }
  );
};

module.exports = paymentCtrl;

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
      const user = await Users.findById(req.user.id);

      if (!user)
        return res.status(400).json({ msg: "Foydalanuvchi mavjud emas !" });

      const { cart, comment } = req.body;

      cart.forEach(async (item) => {
        const product = await Products.findById(item.product);
        console.log(product);
        if (product.quantity < item.quantity) {
          return res
            .status(400)
            .json({ msg: "Bizda buncha mahsulot mavjud emas !" });
        }
      });

      const check = cart.every((el) => el.product && el.quantity);
      if (!check) {
        return res.status(400).json({
          msg: "Every object must have product and quantity property !",
        });
      }

      const newPayment = new Payments({
        userId: user._id,
        cart,
        comment,
      });

      await newPayment.save();

      cart.forEach(async ({ product: id, quantity }) => {
        const product = await Products.findById(id);
        await Products.findOneAndUpdate(
          { _id: id },
          {
            sold: product.sold + quantity,
            quantity: product.quantity - quantity,
          }
        );
      });

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

module.exports = paymentCtrl;

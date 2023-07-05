const User = require("../FormSchema/userSchema");

// Create
exports.createProduct = (req, res) => {
  const product = new User(req.body);
  product
    .save()
    .then(() => {
      res.status(201).json({
        message: "successfully posted",
        data: product,
      });
    })
    .catch((err) => {
      console.log("error", err);
    });
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await User.find();
    res.status(200).json({
      status: "success",
      product: products,
    });
  } catch (err) {
    res.status(404).json({
      message: err,
    });
  }
};

exports.getProduct = async (req, res) => {
  const id = req.params.id;
  console.log({ id });
  const product = await User.findById(id);
  res.status(200).json({
    status: "success",
    product: product,
  });
};
exports.replaceProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await User.findOneAndReplace({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

exports.updateProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await User.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};
exports.deleteProduct = async (req, res) => {
  const id = req.params.id;
  try {
    const doc = await User.findOneAndDelete({ _id: id });
    res.status(200).json(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
};

const validator = require("validator");

const validatorSignupData = (req) => {
  const allowedFields = ["email", "password", "firstName", "lastName"];
  const checkFields = Object.keys(req.body).every((field) => {
    return allowedFields.includes(field);
  });
  console.log("checkFields", checkFields);
  if (checkFields) {
    const { email, password, firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      throw new Error("First Name and Last Name are required.");
    } else if (!email) {
      throw new Error("Email is required.");
    } else if (!validator.isEmail(email)) {
      throw new Error("Invalid Email Address.");
    } else if (!password) {
      throw new Error("Password is required.");
    } else if (!validator.isStrongPassword(password)) {
      throw new Error("Enter a strong Password");
    }
  } else {
    throw new Error("Invalid Fields Provided.");
  }
};

const validationUserData = (req) => {
  const allowedFields = [
    "firstName",
    "lastName",
    "photoUrl",
    "about",
    "phoneNumber",
  ];
  const checkFields = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (checkFields) {
    if (!validator.isMobilePhone(req.body?.phoneNumber)) {
      throw new Error("Invalid Phone Number");
    } else if (!validator.isURL(req.body?.photoUrl)) {
      throw new Error("Invalid picture URL");
    } else if (
      !validator.isAlpha(req.body?.firstName) ||
      !validator.isAlpha(req.body?.lastName)
    ) {
      throw new Error("First Name and Last Name should only contain letters.");
    }
  }
  return checkFields;
};

const newProductDataValidator = (req) => {
  const allowedFields = [
    "name",
    "description",
    "category",
    "photoUrl",
    "quantity",
    "price",
    "size",
    "archived",
  ];
  const checkFields = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (checkFields) {
    if (!req.body?.name) {
      //Maindatory field
      throw new Error("Product name is required.");
    } else if (!validator.isAlpha(req.body?.name.replace(/\s/g, ""))) {
      throw new Error("Product name should only contain letters.");
    } else if (!req.body?.category) {
      //Maindatory field
      throw new Error("Product category is required.");
    } else if (!req.body?.quantity) {
      //Maindatory field
      throw new Error("Product quantity is required.");
    } else if (!validator.isNumeric(req.body?.quantity)) {
      throw new Error("Product quantity should be a number.");
    } else if (!req.body?.price) {
      //Maindatory field
      throw new Error("Product price is required.");
    } else if (!validator.isNumeric(req.body?.price)) {
      throw new Error("Product price should be a number.");
    } else if (!validator.isAlphanumeric(req.body?.size.replace(/\s/g, ""))) {
      throw new Error("Product size should be alphanumeric.");
    } else if (req.body?.photoUrl) {
      if (!validator.isURL(req.body?.photoUrl)) {
        throw new Error("Invalid picture URL");
      }
    } else if (req.body?.archived) {
      if (!validator.isBoolean(req.body?.archived)) {
        throw new Error("Invalid archieve status");
      }
    }
  }
  return checkFields;
};

const productDataValidator = (req) => {
  const allowedFields = [
    "name",
    "description",
    "category",
    "photoUrl",
    "quantity",
    "price",
    "size",
  ];
  const checkFields = Object.keys(req.body).every((field) =>
    allowedFields.includes(field)
  );
  if (checkFields) {
    if (req.body?.name) {
      if (!validator.isAlpha(req.body?.name)) {
        throw new Error("Product name should only contain letters.");
      }
    } else if (req.body?.quantity) {
      if (!validator.isNumeric(req.body?.quantity)) {
        throw new Error("Product quantity should be a number.");
      }
    } else if (req.body?.price) {
      if (!validator.isNumeric(req.body?.price)) {
        throw new Error("Product price should be a number.");
      }
    } else if (req.body?.size) {
      if (!validator.isAlphanumeric(req.body?.size)) {
        throw new Error("Product size should be alphanumeric.");
      }
    } else if (req.body?.photoUrl) {
      if (!validator.isURL(req.body?.photoUrl)) {
        throw new Error("Invalid picture URL");
      }
    }
  }
  return checkFields;
};

module.exports = {
  validatorSignupData,
  validationUserData,
  newProductDataValidator,
  productDataValidator,
};

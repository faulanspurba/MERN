exports.register = (req, res, next) => {
  const { name, email, password } = req.body;

  const result = {
    message: "Register account success!!",
    data: {
      name,
      email,
    },
  };

  res.status(201).json(result);

  next();
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  if (email != "email" || password != "password") {
    res.status(404).json({ message: "email atau password anda salah" });
  } else {
    result = {
      message: "Login success",
      data: {
        cookie: "cookie",
      },
    };
    res.status(201).json(result);
  }

  next();
};

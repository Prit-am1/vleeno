const adminAuth = (req, res, next) => {
  const token = true;
  if (token) {
    console.log("Admin authorization successful!😀");
    next();
  } else {
    res.status(401).send("Admin authorization failed!😒");
  }
};

const userAuth = (req, res, next) => {
  const token = true;
  if (token) {
    console.log("User authorization successful!😀");
    next();
  } else {
    res.status(401).send("User authorization failed!😒");
  }
};

export { adminAuth, userAuth };

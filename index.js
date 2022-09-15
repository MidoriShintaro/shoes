require("dotenv").config();
const express = require("express");
const path = require("path");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const cookieParser = require("cookie-parser");
const expressLayout = require("express-ejs-layouts");
const numeral = require("numeral");
const MongoDBStore = require("connect-mongodb-session")(session);

const app = express();
const port = process.env.PORT || 3000;
const secret = process.env.SECRET;
const dburi = process.env.DBURI;
const node_env = process.env.NODE_ENV;
const passportInit = require("./config/passport");
const viewRoute = require("./routes/viewRoutes");
const userRoute = require("./routes/userRoutes");
const cartRoute = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const reviewRoute = require("./routes/reviewRoutes");
const contactRoute = require("./routes/contactRoute");

//template engine
app.use(expressLayout);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//asset
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser(secret));

//http logger
if (node_env === "development") {
  app.use(morgan("dev"));
}

//connect db
mongoose.connect(dburi).then(() => console.log("DB connect successfull"));

const store = new MongoDBStore({
  uri: dburi,
  collection: "session",
});

//config session
app.use(
  session({
    secret,
    resave: false,
    saveUninitialized: false,
    store,
    maxAge: 24 * 60 * 60 * 1000,
  })
);

//config passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//global middleware
app.locals.numeral = numeral;
app.use((req, res, next) => {
  // console.log(req.isAuthenticated());
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});

app.use("/", viewRoute);
app.use("/user", userRoute);
app.use("/cart", cartRoute);
app.use("/order", orderRoutes);
app.use("/review", reviewRoute);
app.use("/contact", contactRoute);

app.listen(port, () =>
  console.log("Server is up and running on port : " + port)
);

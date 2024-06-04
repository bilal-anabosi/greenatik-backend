const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

// Import your route handlers
const productRouter = require("./routes/productRoutes");
const userRouter = require("./routes/user.router.js");
const profileRouter = require("./routes/profile.router");
const StoreRoutes = require("./routes/StoreRoutes");
const WishlistRoutes = require("./routes/wishlistRoutes.js");
const cartRouter = require("./routes/cartRoutes.js");
const connectDB = require("./DB/connection.js");
const { authenticateToken } = require("./middelware/auth");
const checkoutRoutes = require("./routes/checkoutRoutes");
const reviewRoutes = require("./routes/reviewsRoutes.js");
const postsRoutes = require("./routes/postsRoutes.js");
const SinglePostRoutes = require('./routes/SinglePostRoutes.js');
const wideRoutes =require("./routes/wideRoutes.js");
const contributionRoutes = require('./routes/contributionRoutes');
const leaderBoard = require('./routes/leaderBoardRoutes');

const exchangeRateRouter = require('./routes/exchangeRateRouter');

const blogRoutes = require('./routes/blogRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

const pth = path.join(__dirname, "uploads");
app.use(express.static(pth));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());

connectDB();
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/user", userRouter);
app.use("/profile", profileRouter);
app.use("/api/products", productRouter);

app.use("/store", StoreRoutes);
app.use("/wishlist", WishlistRoutes);
app.use("/cart", cartRouter);
app.use("/checkout", checkoutRoutes);
app.use("/reviews", reviewRoutes);
app.use("/posts", postsRoutes);
app.use("/wide", wideRoutes);
app.use('/singlepost', SinglePostRoutes);
app.use('/delivery', contributionRoutes);
app.use('/leaderboard', leaderBoard);

app.use('/api', exchangeRateRouter);


app.use('/blogs', blogRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

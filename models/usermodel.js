const mongoose = require("mongoose");

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      required: true,
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "delivery"],
    },
    address: {
      type: String,
      required: true,
    },
    image: {
      type: Object,
    },
    sendCode: {
      type: String,
      default: null,
    },
    cart: {
      type: [
        {
          productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
            required: true,
          },
          quantity: { type: Number, default: 1, required: false },
          size: {
            type: String,
            required: true,
          },
        },
      ],
      default: function () {
        // Initialize cart as an empty array if the user's role is 'user'
        if (this.role === "user") {
          return [];
        }
      },
    },
    points: {
      total: {
        type: Number,
        default: 1,
      },
      tasks: {
        type: Number,
        default: 0,
      },
      availablePoints: {
        type: Number,
        default: 1,
      },
      log: {
        type: [
          {
            pointsAdded: {
              type: Number,
              required: true,
            },
            date: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        default: [],
      },
    },
  },
  {
    timestamps: true,
  }
);

// pre-save middleware to initialize points for users with the right role
userSchema.pre("save", function (next) {
  if (this.role === "user" && !this.points) {
    this.points = {
      total: 1,
      tasks: 0,
      availablePoints: 1,
      log: [],
    };
  }
  next();
});

const userModel = model("user", userSchema);

module.exports = userModel;

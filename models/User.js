import mongoose from "mongoose"

const UserSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: String,
    emailVerified: {
      type: Boolean,
      default: false,
    },
    image: String,
    role: {
      type: String,
      default: "User",
      enum: ["User", "Manager", "Admin"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
    },
    image: String,
    resetToken: String,
    resetTokenExpiry: Date,
  },
  { timestamps: true },
)

export default mongoose.models.User || mongoose.model("User", UserSchema)


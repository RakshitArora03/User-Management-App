import mongoose from "mongoose"

const InviteCodeSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Manager"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    usedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true },
)

export default mongoose.models.InviteCode || mongoose.model("InviteCode", InviteCodeSchema)


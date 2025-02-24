import mongoose from "mongoose"

const UserTenantSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Compound index to ensure a user can only join a tenant once
UserTenantSchema.index({ userId: 1, tenantId: 1 }, { unique: true })

export default mongoose.models.UserTenant || mongoose.model("UserTenant", UserTenantSchema)


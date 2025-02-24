import mongoose from "mongoose"
import crypto from "crypto"

const TenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    adminEmail: {
      type: String,
      required: true,
    },
    industryType: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    description: String,
    logo: String,
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    tenantCode: {
      type: String,
      unique: true,
      required: true,
      default: () => crypto.randomBytes(3).toString("hex").toUpperCase(),
    },
  },
  { timestamps: true },
)

// Create slug from name before saving
TenantSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
  }

  next()
})

export default mongoose.models.Tenant || mongoose.model("Tenant", TenantSchema)


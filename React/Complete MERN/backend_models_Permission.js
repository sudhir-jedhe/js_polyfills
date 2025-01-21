const mongoose = require("mongoose")

const PermissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
    },
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "read", "update", "delete"],
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model("Permission", PermissionSchema)


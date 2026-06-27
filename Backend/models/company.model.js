import mongoose from "mongoose";
const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  logo: {
    type: String
  },

  description: {
    type: String
  },

  website: {
    type: String
  },

  location: {
    type: String
  },

  userId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }]
}, {
  timestamps: true,
});

export const Company = mongoose.model("Company", companySchema);
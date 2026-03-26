import mongoose, { Document, Schema } from "mongoose";

export interface IDoctor extends Document {
  user: mongoose.Types.ObjectId;
  specialization: string;
  experience: number;
  fees: number;
  available: boolean;
  about: string;
}

const DoctorSchema = new Schema<IDoctor>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    specialization: {
      type: String,
      required: [true, "Specialization is required"],
    },
    experience: {
      type: Number,
      required: [true, "Experience is required"],
    },
    fees: {
      type: Number,
      required: [true, "Fees is required"],
    },
    available: {
      type: Boolean,
      default: true,
    },
    about: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IDoctor>("Doctor", DoctorSchema);

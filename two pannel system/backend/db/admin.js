import mongoose from 'mongoose';

// Define the schema
const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  profession: {
    type: String,
    required: true,
    trim: true,
  },
  photo: {
    path: {
      type: String, // Storing file path
      required: true,
    },
    fileName: {
      type: String, // Storing original file name
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Create the model
export default mongoose.model('Admin', AdminSchema);
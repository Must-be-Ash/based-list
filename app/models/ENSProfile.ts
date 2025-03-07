import mongoose, { Schema } from 'mongoose';

// Define the schema for ENS records
const ENSRecordSchema = new Schema({
  key: { type: String, required: true },
  value: { type: String, required: true },
  type: { type: String, required: true }
}, { _id: false });

// Define the schema for ENS profiles
const ENSProfileSchema = new Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    index: true
  },
  address: { 
    type: String, 
    required: false,
    index: true
  },
  avatar: { 
    type: String, 
    required: false 
  },
  localAvatar: { 
    type: String, 
    required: false 
  },
  records: [ENSRecordSchema],
  contentHash: { 
    type: String, 
    required: false 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Create or get the model
const ENSProfile = mongoose.models.ENSProfile || mongoose.model('ENSProfile', ENSProfileSchema);

export default ENSProfile; 
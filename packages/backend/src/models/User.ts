import mongoose, { Schema, Document } from 'mongoose';

/**
 * Mongoose Schema for User
 * TODO: Expand based on user.schema.json when available
 */

export interface UserDocument extends Document {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'agent' | 'customer';
  created_at: string;
  updated_at?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['admin', 'agent', 'customer'],
      default: 'customer',
    },
    created_at: {
      type: String,
      required: true,
    },
    updated_at: {
      type: String,
    },
  },
  {
    timestamps: false,
    versionKey: false,
  }
);

// Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ role: 1 });

// TODO: Add password hashing
// TODO: Add authentication methods
// TODO: Add profile fields

const UserModel = mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;

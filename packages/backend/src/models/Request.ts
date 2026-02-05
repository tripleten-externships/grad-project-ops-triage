import mongoose, { Schema, Document } from 'mongoose';
import type { Request as IRequest } from '@shared/types';

/**
 * Mongoose Schema for Request
 * Based on contracts/schemas/request.schema.json
 */

export interface RequestDocument extends Omit<IRequest, 'id'>, Document {
  id: string; // Custom ID field (REQ-XXXXXX)
}

const RequestSchema = new Schema<RequestDocument>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      match: /^REQ-\d{6}$/,
    },
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
      maxlength: 5000,
    },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'account', 'billing', 'general'],
    },
    priority: {
      type: String,
      required: true,
      enum: ['P0', 'P1', 'P2', 'P3'],
    },
    status: {
      type: String,
      required: true,
      enum: ['new', 'triaged', 'in_progress', 'waiting', 'resolved', 'closed'],
      default: 'new',
    },
    requester_type: {
      type: String,
      required: true,
      enum: ['free', 'paid', 'enterprise', 'internal'],
    },
    channel: {
      type: String,
      required: true,
      enum: ['email', 'chat', 'phone', 'web_form', 'api'],
    },
    created_at: {
      type: String,
      required: true,
    },
    updated_at: {
      type: String,
    },
    assigned_to: {
      type: String,
      default: null,
    },
    resolution_code: {
      type: String,
      enum: ['solved', 'workaround', 'duplicate', 'wont_fix', 'spam', null],
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: false, // We manage timestamps manually
    versionKey: false,
  }
);

// Indexes for common queries
RequestSchema.index({ status: 1, priority: 1 });
RequestSchema.index({ assigned_to: 1 });
RequestSchema.index({ created_at: -1 });
RequestSchema.index({ category: 1, status: 1 });

// TODO: Add virtual fields for computed properties
// TODO: Add pre-save hooks for validation
// TODO: Add methods for business logic

const RequestModel = mongoose.model<RequestDocument>('Request', RequestSchema);

export default RequestModel;

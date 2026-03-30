import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'event'],
    default: 'info'
  },
  icon: {
    type: String,
    default: 'Bell' // Lucide icon name
  },
  isActive: {
    type: Boolean,
    default: true
  },
  expiresAt: {
    type: Date,
    default: null // null means it doesn't expire automatically
  }
}, { timestamps: true });

export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);

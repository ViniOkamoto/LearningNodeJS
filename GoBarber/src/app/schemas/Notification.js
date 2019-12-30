import mongoose from 'mongoose';
// It's define
const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
// Notification is the model name. We don't need to load the model like the migrations
export default mongoose.model('Notification', NotificationSchema);

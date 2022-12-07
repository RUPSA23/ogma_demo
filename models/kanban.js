const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kanbanSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  Kanban_generated_at: {
    type: Date, default: Date.now
  },
  kanban_subscribed_at: {
    type: Date
  },
  kanban_completed_at: {
    type: Date
  },
  kanban_approved_at: {
    type: Date
  },
  status: {
    type: String,
    default: 'pending',
    enum: ["pending","subscribed", "done", "approved", "rejected"],
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  developerAssigned: {
    type: Schema.Types.ObjectId,
    ref: 'User'
    }  
});

module.exports = mongoose.model('Kanban', kanbanSchema);
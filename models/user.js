const mongoose = require('mongoose');
const kanban = require('./kanban');

const Schema = mongoose.Schema;

const ZuserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  usertype: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  kanbans: [{
    kanbanId: {
      type: Schema.Types.ObjectId,
      ref: 'kanban',
      required: true
    },
    created_at: {type: Date, default: Date.now}
  }]
});


ZuserSchema.methods.addkanbanIds = function (kanban) {
  const kanbansarray = [...this.kanbans];
  kanbansarray.push({
    kanbanId: kanban._id
  });
  this.kanbans = kanbansarray;
  this.save();
}

module.exports = mongoose.model('User', ZuserSchema);










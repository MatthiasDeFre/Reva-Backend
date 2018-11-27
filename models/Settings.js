let mongoose = require('mongoose');

let SettingsSchema = new mongoose.Schema({
  studentCode: String,
  teacherCode: String,
  expoDate: Date
  
});

mongoose.model('Settings', SettingsSchema);

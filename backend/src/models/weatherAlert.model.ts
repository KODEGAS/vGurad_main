import mongoose from 'mongoose';

const WeatherAlertSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  alert_type: {
    type: String,
    required: true,
    enum: ['weather', 'disease', 'pest', 'general']
  },
  severity: {
    type: String,
    required: true,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  location: {
    type: String,
    trim: true
  },
  start_date: {
    type: Date,
    default: Date.now
  },
  end_date: {
    type: Date
  },
  is_active: {
    type: Boolean,
    default: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Update the updated_at field before saving
WeatherAlertSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model('WeatherAlert', WeatherAlertSchema);

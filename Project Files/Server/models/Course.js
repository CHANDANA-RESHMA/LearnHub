const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  C_title: { type: String, required: true },
  C_description: String,
  C_price: Number,
  C_educator: { type: String, required: true }, // Only once, and required
  C_categories: String,
  enrolled: { type: Number, default: 0 },
  isCompleted: { type: Boolean, default: false },
  userID: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // ✅ New section-wise course content
  courseContent: [
    {
      sectionTitle: String,
      sectionDescription: String,
      resources: [
        {
          title: String,
          url: String
        }
      ]
    }
  ]
});

module.exports = mongoose.model('Course', courseSchema);

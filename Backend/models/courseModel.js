const mongoose = require('mongoose');

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the section title'],
  },
  content: {
    type: String,
    required: [true, 'Please enter the section content'],
  },
  duration: {
    type: String, // You can choose the appropriate data type for duration, such as String or Number
    required: [true, 'Please enter the section duration'],
  },
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter the course title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter the course description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter the course price'],
    min: [0, 'Price cannot be negative'],
  },
  thumbnail: {
    type: String, // Assuming the thumbnail is a URL, adjust the type accordingly
    required: [true, 'Please provide a thumbnail for the course'],
  },
  instructor: {
    type: String,
    required: [true, 'Please enter the instructor name'],
  },
  duration: {
    type: String, // You can choose the appropriate data type for duration, such as String or Number
    required: [true, 'Please enter the course duration'],
  },
  level: {
    type: String, // Beginner, Intermediate, Advanced, etc.
    required: [true, 'Please enter the course level'],
  },
  language: {
    type: String,
    required: [true, 'Please enter the course language'],
  },
  category: {
    type: String,
    required: [true, 'Please enter the course category'],
  },
  tags: {
    type: [String], // Array of tags related to the course
  },
  sections: [sectionSchema], // Embed the sectionSchema as an array of sections
  // Other relevant fields can be added here.
  // ...

  // Timestamps to track when the course was created and last updated
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: null,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  ratings: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],

});

// Update the 'updatedAt' field before saving the document
courseSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;

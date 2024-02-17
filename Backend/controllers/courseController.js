const Course = require('../models/courseModel');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middleware/catchAsyncError');
const ApiFeatures = require("../utils/apiFeatures");

// Create a new course
exports.createCourse = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.create(req.body);
  res.status(201).json({
    success: true,
    course,
  });
});

// Get all courses
exports.getAllCourses = catchAsyncErrors(async (req, res, next) => {
  const courses = await Course.find();
  res.status(200).json({
    success: true,
    courses,
  });
});

// Get details of a specific course
exports.getCourseDetails = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler('Course not found', 404));
  }
  res.status(200).json({
    success: true,
    course,
  });
});

// Update a course
exports.updateCourse = catchAsyncErrors(async (req, res, next) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler('Course not found', 404));
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  res.status(200).json({
    success: true,
    course,
  });
});

// Delete a course
exports.deleteCourse = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return next(new ErrorHandler('Course not found', 404));
  }
  await course.deleteOne();
  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
  });
});

// Add a review to a course
exports.addCourseReview = catchAsyncErrors(async (req, res, next) => {
  const { courseId, rating, comment } = req.body;
  const review = { user: req.user._id, rating, comment }; // Assuming user ID is available in req.user._id
  const course = await Course.findById(courseId); // Change req.params.id to courseId

  if (!course) {
    return next(new ErrorHandler('Course not found', 404));
  }

  const isReviewed = course.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    // Update the existing review
    course.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    // Add a new review
    course.reviews.push(review);
    course.numOfReviews = course.reviews.length;
  }

  // Calculate the average rating
  let avg = 0;
  course.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  course.ratings = avg / course.reviews.length;

  // Save the updated course
  await course.save({ validateBeforeSave: false });

  // Send a success response
  res.status(200).json({
    success: true,
  });
});

//Get all reviews of a product

exports.getProductReviews =catchAsyncErrors(async(req,res,next)=>{
  const course = await Course.findById(req.query.id);

  if(!course){
    return next (new ErrorHandler("course not found",404));
  }

  res.status(200).json({
    success: true,
    reviews: course.reviews,
  });
});

//Delete review
exports.deleteCourseReviews = catchAsyncErrors(async (req, res, next) => {
  const course = await Course.findById(req.query.courseId);

  if (!course) {
    return next(new ErrorHandler('Course not found', 404));
  }

  // Filter out the review to be deleted
  const reviews = course.reviews.filter((rev) => rev._id.toString() !== req.query.id);

  if (reviews.length > 0) {
    // Calculate the average rating
    let avg = 0;
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
    const ratings = avg / reviews.length;

    const numOfReviews = reviews.length;

    // Update course with new reviews, ratings, and numOfReviews
    await Course.findByIdAndUpdate(
      req.query.courseId, // Change to courseId
      {
        reviews,
        ratings,
        numOfReviews,
      },
      {
        new: true,
        runValidators: true,
        useFindAndModify: false,
      }
    );

    res.status(200).json({
      success: true,
    });
  } else {
    // If there are no reviews left, you might want to delete the course or handle it accordingly
    return next(new ErrorHandler('No reviews found for deletion', 404));
  }
});


const express = require('express');
const router = express.Router();
const {
  getAllCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCourseDetails,
  addCourseReview,
  getProductReviews,
  deleteCourseReviews
  
} = require('../controllers/courseController');
const { isAuthenticatedUser, authorizedRoles } = require('../middleware/auth');

router.route('/courses').get(getAllCourses);

router
  .route('/admin/courses/new')
  .post(isAuthenticatedUser, authorizedRoles('admin'), createCourse);

router
  .route('/admin/course/:id')
  .put(isAuthenticatedUser, authorizedRoles('admin'), updateCourse)
  .delete(isAuthenticatedUser, authorizedRoles('admin'), deleteCourse)
  .get(isAuthenticatedUser, getCourseDetails);

router.route('/course/:id').get(getCourseDetails);

router.route('/course/review').put(isAuthenticatedUser,addCourseReview);

router.route('/course/reviews').get(getProductReviews).delete(isAuthenticatedUser,deleteCourseReviews)

module.exports = router;

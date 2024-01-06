const express = require("express");
const requireAuth = require("../middlewares/requireAuth");
const isLoggedIn = require("../middlewares/isLoggedIn.js");

const {
  signup,
  login,
  getProfileInfo,
  getPersonalInfo,
  updateProfile,
  followUnfollow,
} = require("../controllers/userControllers");

const {
  uploadAnswer,
  updateAnswer,
  upvoteDownvoteAnswer,
  markAnswerAsCorrect,
} = require("../controllers/answerControllers.js");

const {
  uploadQuestions,
  updateQuestion,
  getWholeQuestion,
  getPersonalQuestions,
  relatedQuestions,
  tagBasedQuestions,
  getAllQuestions,
  getPopularTags,
  getAllTags,
  upvoteDownvoteQuestion,
} = require("../controllers/questionControllers.js");

const router = express.Router();

//UPLOADING IMAGE UPLOAD MIDDLE WARES
const questionUpload = require("../middlewares/questionUpload.js");
const profileImageUpload = require("../middlewares/profileImageUpload.js");
const answerUpload = require("../middlewares/answerImageUpload.js");

/**PROFILE ROUTES */
router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/").get(requireAuth, getPersonalInfo);
router.route("/get-profile").get(getProfileInfo);
router
  .route("/update-profile")
  .put(requireAuth, profileImageUpload.array("images"), updateProfile);
router.route("/follow-unfollow").put(requireAuth, followUnfollow);

/**QUESTION ROUTES */
router
  .route("/add-question")
  .post(requireAuth, questionUpload.array("images"), uploadQuestions);
router
  .route("/update-question")
  .put(requireAuth, questionUpload.array("images"), updateQuestion);
router.route("/all-questions").get(isLoggedIn, getAllQuestions);
router.route("/tag-questions").get(tagBasedQuestions);
router.route("/related-questions").get(relatedQuestions);
router.route("/personal-questions").get(getPersonalQuestions);
router.route("/popular-tags").get(getPopularTags);
router.route("/all-tags").get(getAllTags);
router.route("/upvote-downvote").put(requireAuth, upvoteDownvoteQuestion);
router.route("/single-question").get(getWholeQuestion);

/**ANSWER ROUTES */
router.route("/upvote-downvote-ans").put(requireAuth, upvoteDownvoteAnswer);
router.route("/mark-as-correct").put(requireAuth, markAnswerAsCorrect);
router
  .route("/add-answer")
  .post(requireAuth, answerUpload.array("images"), uploadAnswer);
router
  .route("/update-answer")
  .put(requireAuth, answerUpload.array("images"), updateAnswer);

module.exports = router;

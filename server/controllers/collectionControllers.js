const moment = require("moment");

const jwt = require("jsonwebtoken");
const Question = require("../model/questionModel");
const Tag = require("../model/tagModel");
const User = require("../model/userModel");
const Collection = require("../model/collectionModel");
const { removeFile } = require("../utilities/account");

const addToCollection = async (req, res) => {
    try {
        const { userId, questionId } = req.body;

        // Check if the user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the question exists
        const questionExists = await Question.findById(questionId);
        if (!questionExists) {
            return res.status(404).json({ error: "Question not found" });
        }

        // Check if the user already has the question in their collection
        const collectionExists = await Collection.findOne({ userId });
        if (!collectionExists) {
            const newCollection = new Collection({
                userId,
                questionIds: [questionId],
            });
            await newCollection.save();
        } else {
            if (!collectionExists.questionIds.includes(questionId)) {
                collectionExists.questionIds.push(questionId);
                await collectionExists.save();
            }
        }

        return res.status(200).json({ message: "Question added to collection" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

const removeFromCollection = async (req, res) => {
    try {
        const { userId, questionId } = req.body;
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: "User not found" });
        }
        const questionExists = await Question.findById(questionId);
        if (!questionExists) {
            return res.status(404).json({ error: "Question not found" });
        }
        const collectionExists = await Collection.findOne({ userId });
        if (!collectionExists) {
            return res.status(404).json({ error: "Collection not found for the user" });
        }
        collectionExists.questionIds = collectionExists.questionIds.filter(
            (id) => id.toString() !== questionId.toString()
        );
        await collectionExists.save();

        return res.status(200).json({ message: "Question removed from collection" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports = {
    addToCollection,
    removeFromCollection,
};
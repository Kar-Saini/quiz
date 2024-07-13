"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizManager = void 0;
const RoomManager_1 = __importDefault(require("./RoomManager"));
class QuizManager {
    constructor() {
        this.quiz = [];
    }
    startQuiz(roomId) {
        const newQuizId = Math.ceil(Math.random() * 100000).toString();
        this.quiz.push({
            quizId: newQuizId,
            roomId,
            questions: [],
            correctOption: 0,
        });
        return newQuizId;
    }
    addQuestion(roomId, quizId, questionStatement, options, correctOption) {
        const roomExists = RoomManager_1.default.getRoom(roomId);
        if (!roomExists)
            return;
        let quizExists = this.quiz.find((quiz) => quiz.quizId === quizId);
        if (!quizExists) {
            quizExists = {
                quizId: Math.random().toString(),
                roomId,
                questions: [],
                correctOption,
            };
            this.quiz.push(quizExists);
        }
        const newQuestion = {
            questionId: Math.ceil(Math.random() * 1000).toString(),
            questionStatement,
            options,
        };
        quizExists.questions.push(newQuestion);
    }
    checkAnswer(roomId, userId, quizId, questionId, option) {
        const room = RoomManager_1.default.getRoom(roomId);
        if (!room) {
            console.log("RoomId : " + roomId + " doesn't exist");
            return;
        }
        const userExists = room.userIds.find((id) => id === userId);
        if (!userExists) {
            console.log("UserId : " + userId + " is not in RoomId : " + roomId);
            return;
        }
    }
}
exports.QuizManager = QuizManager;
const quizManager = new QuizManager();
exports.default = quizManager;

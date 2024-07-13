import roomManager from "./RoomManager";

interface Question {
  questionId: string;
  questionStatement: string;
  options: string[];
}
interface Quiz {
  quizId: string;
  roomId: string;
  questions: Question[];
  correctOption: number;
}
export class QuizManager {
  private quiz: Quiz[];
  constructor() {
    this.quiz = [];
  }
  startQuiz(roomId: string) {
    const newQuizId = Math.ceil(Math.random() * 100000).toString();
    this.quiz.push({
      quizId: newQuizId,
      roomId,
      questions: [],
      correctOption: 0,
    });
    return newQuizId;
  }
  addQuestion(
    roomId: string,
    quizId: string,
    questionStatement: string,
    options: string[],
    correctOption: number
  ) {
    const roomExists = roomManager.getRoom(roomId);
    if (!roomExists) return;
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
  checkAnswer(
    roomId: string,
    userId: string,
    quizId: String,
    questionId: string,
    option: number
  ) {
    const room = roomManager.getRoom(roomId);
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

const quizManager = new QuizManager();
export default quizManager;

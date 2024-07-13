import { useEffect, useState } from "react";

const Landing = () => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [userId, setUserId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [quizId, setQuizId] = useState("");
  const [adminOfRoom, setAdminOfRoom] = useState({
    roomId: "",
    adminUserId: "",
  });
  const [enteredRoomId, setEnteredRoomId] = useState("");
  const [usersInRoom, setUsersInRoom] = useState<string[]>([]);
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
      switch (message.type) {
        case "user-joined":
          setUserId(message.payload.userId);
          break;
        case "room-created":
          console.log(message.payload.roomId);
          setRoomId(message.payload.roomId);
          break;
        case "room-joined":
          if (roomId === "") {
            setRoomId(message.payload.roomId);
          } else {
            console.log("User already in a room");
          }
          break;
        case "admin-info":
          console.log(message.payload);
          setAdminOfRoom((prev) => {
            return {
              ...prev,
              roomId: message.payload.roomId,
              adminUserId: message.payload.adminUserId,
            };
          });
          break;
        case "update-users":
          setUsersInRoom(message.payload.users);
          break;
        case "quiz-started":
          setQuizId(message.payload.quizId);
          break;
      }
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    setSocket(ws);
    return () => {
      ws.close();
    };
  }, []);
  console.log(adminOfRoom);

  return (
    <div className=" flex flex-col h-screen justify-center items-center bg-gray-400">
      {roomId === "" ? (
        !usersInRoom.find((id) => id === userId) && (
          <>
            <div className=" font-semibold tracking-widest m-3 p-3">
              <h1 className="text-4xl border-b-4 border-gray-800 border-spacing-y-3">
                Welcome to <span className="italic">QUIZ</span>
              </h1>
              <div>USER ID : {userId}</div>
            </div>
            <div className="flex flex-col m-2 p-2">
              <div
                className="bg-gray-300 m-2 p-2 rounded-md text-center text-lg hover:bg-gray-200 hover:scale-105 transition"
                onClick={() => {
                  socket?.send(
                    JSON.stringify({ type: "create-room", payload: { userId } })
                  );
                  setUsersInRoom((prev) => {
                    const userIdExists = prev.find((id) => id === userId);
                    if (!userIdExists) {
                      return [...prev, userId];
                    }
                    return prev;
                  });
                }}
              >
                Create Room
              </div>
              <div className="bg-gray-300 m-2 p-2 rounded-md text-center text-lg ">
                <input
                  type="text"
                  name=""
                  id=""
                  value={enteredRoomId}
                  onChange={(event) => {
                    setEnteredRoomId(event.target.value);
                  }}
                  placeholder="Join Room"
                  className="bg-gray-300 outline-none  text-black"
                />
                <button
                  className="bg-gray-300 p-1 rounded-md text-center text-lg hover:bg-gray-200 hover:scale-105 transition"
                  onClick={() => {
                    socket?.send(
                      JSON.stringify({
                        type: "user-join-room",
                        payload: { userId, roomId: enteredRoomId },
                      })
                    );
                    setUsersInRoom((prev) => {
                      const userIdExists = prev.find((id) => id === userId);
                      if (!userIdExists) {
                        return [...prev, userId];
                      }
                      return prev;
                    });
                  }}
                >
                  Join
                </button>
              </div>
            </div>
          </>
        )
      ) : (
        <>
          <div>
            <div>Welcome to Room ID : {roomId}</div>
            <div>You have USER ID : {userId}</div>
            {roomId === adminOfRoom.roomId && (
              <div>Admin of ROOM : {adminOfRoom.adminUserId}</div>
            )}
            <div className="">
              Users in this Room :
              {usersInRoom.map((user) => (
                <>
                  <div>{user}</div>
                </>
              ))}
            </div>
          </div>
          {userId === adminOfRoom.adminUserId &&
            (quizId === "" ? (
              <div
                onClick={() => {
                  socket?.send(
                    JSON.stringify({
                      type: "start-quiz",
                      payload: {
                        roomId,
                      },
                    })
                  );
                }}
              >
                Start a Quiz
              </div>
            ) : (
              <div>
                <div>Quiz Started, QuizId : {quizId}</div>
                <div>
                  <input type="text" placeholder="Question" />
                  <input type="text" placeholder="Option 1" />
                  <input type="text" placeholder="Option 2" />
                  <input type="text" placeholder="Option 3" />
                </div>
              </div>
            ))}
        </>
      )}
    </div>
  );
};

export default Landing;

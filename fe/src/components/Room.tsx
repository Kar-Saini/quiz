import { useParams } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  return <div>Room ID : {roomId}</div>;
};

export default Room;

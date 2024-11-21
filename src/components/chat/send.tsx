import { socket } from "@/api/socket";
import MessageForm from "../forms/message";
import { UUID } from "crypto";
import { Message } from "postcss";

export default function SendMessage({
  UserId,
  BranchId,
}: {
  UserId: UUID;
  BranchId: UUID;
}) {
  function sendMessage(text: string) {
    const messageToSend: Partial<Message> = {
      UserId,
      BranchId,
      text,
    };

    socket.emit("message", messageToSend);
  }
  return (
    <div className="p-4 border-t">
      <MessageForm sendMessage={sendMessage}></MessageForm>
    </div>
  );
}

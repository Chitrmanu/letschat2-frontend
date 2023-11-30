import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import styles from "../../../styles/chat.module.scss";
import { fetchAPI } from "@/utils/Api";
interface Message {
  message: string;
  sender: string;
  sender_id: string;
}
interface chatTypes {
  id: Number;
  room_name: string;
}
type Props = {
  username: string | null;
  selectedChatRoom: chatTypes;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  userId: string | undefined;
};

const ChatRoom: React.FC<Props> = ({
  username,
  selectedChatRoom,
  messages,
  setMessages,
  userId
}) => {
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const socket = io("http://localhost:4000");
  const [message, setMessage] = useState("");

  useEffect(() => {
    socket.emit("join_room", selectedChatRoom.room_name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if(messageContainerRef.current){
      messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  useEffect(() => {
    socket.emit("join_room", selectedChatRoom.room_name);
    socket.on("received_message", (data: any) => {
      setMessages(
        [
          messages,
          { message: `${data.message}`, sender: `${data.sender}`,sender_id: `${data.sender_id}` },
        ].flat(2)
        );
      });
      if(messageContainerRef.current){
        messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
      }
    return () => {
      socket.disconnect();
    };
  }, [socket, messages, selectedChatRoom, setMessages, userId]);
  console.log(messages);
  const handleSendMessage = () => {
    console.log("sending message", message, username);
    if(message !== ""){
      socket.emit("send_message", {
        message: message,
        sender: username,
        sender_id: userId,
        room: selectedChatRoom.room_name,
      });
      setMessages(
        [messages, { message: `${message}`, sender: `${username}`,sender_id: `${userId}` }].flat(5)
        );
        setMessage("");
        if(messageContainerRef.current){
      messageContainerRef.current.scrollIntoView({ behavior: "smooth" });
    }
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        { messages.map((msg, key) => {
          console.log(msg.sender_id, userId);
          let sender = msg.sender_id === userId;
          console.log(sender);
          return (
            <div key={key} className={styles.message}>
              <div  
                className={
                  sender ? styles.messageSender : styles.messageReceiver
                }
              >
                <span className={styles.sender}>{msg.sender}</span>
                <p className={styles.content}>{msg.message}</p>
              </div>
            </div>
          );
        })}
       <span ref={messageContainerRef}></span>
      </div>
      <div className={styles.inputContainer}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage();
            }
          }}
        />
        <button className={styles.button} 
        onClick={handleSendMessage} >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;

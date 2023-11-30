import React, { useEffect, useState } from "react";
import styles from "../../styles/chat.module.scss";
import { fetchAPI } from "@/utils/Api";

interface chatTypes {
  id: Number;
  room_name: string;
}

interface Message {
  message: string;
  sender: string;
  sender_id: string;
}


type Props = {
  chatRoomsName: chatTypes[];
  setSelectedChatRoom: React.Dispatch<React.SetStateAction<chatTypes>>;
  selectedChatRoom: chatTypes;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  setChatRoomsName: React.Dispatch<React.SetStateAction<chatTypes[]>>;
};

export default function ChatSwitch({
  chatRoomsName,
  setSelectedChatRoom,
  selectedChatRoom,
  setMessages,
  setChatRoomsName
}: Props) {
  const [messageDelete, setMessageDelete] = useState<Message[]>([
    { message: "Welcome to the new chat", sender: "Admin", sender_id: "1" },
  ]);
  const [openCreateRoom, setOpenCreateRoom] = useState<boolean>(false);
  const [newRoom, setNewRoom] = useState<string>("");
  const createRoom = async () => {
    if (newRoom) {
      let response: any = await fetchAPI("/createroom", "POST", {
        room_name: newRoom,
      });
      console.log(response);
      if (response.status === 200 && response.message == "Room Created") {
        setNewRoom("");
        setOpenCreateRoom(false);
        let chatrooms: any = await fetchAPI("/getrooms", "GET", null);
        setChatRoomsName(chatrooms.data);
      }
    }
  };
  useEffect(() => {
    setMessages(messageDelete);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messageDelete]);
  return (
    <div className={styles.chatSwitch}>
      <div className={styles.chatSwitchContainer}>
        {openCreateRoom && (
          <div className={styles.createRoomContainer}>
            <div onClick={ ()=> setOpenCreateRoom(false)} className={styles.background}></div>
            <div className={styles.block}>
              Create a new room
              <div className={styles.createRoom}>
                <input
                  type="text"
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="Enter new room name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      createRoom();
                    }
                  }}
                />
                <button 
                onClick={() => {createRoom();}}
                className={styles.button}>Create</button>
              </div>
            </div>
          </div>
        )}
        <div className={styles.chatRoomsContainer}>
        <div
          onClick={() => {
            setOpenCreateRoom(true);
          }}
          className={styles.chatRoom}
        >
          <p>Create a new room</p>
        </div>
        {chatRoomsName.map((chatRoomName, key) => {
          let selected = chatRoomName.id === selectedChatRoom.id;
          console.log(selected, chatRoomName.id, selectedChatRoom.id);
          return (
            <div
            key={key}
            className={styles.chatSwitchItem}
            onClick={() => {
              setSelectedChatRoom(chatRoomName);
              setMessageDelete([
                {
                  message: "Welcome to the new chat",
                  sender: "Admin",
                  sender_id: "1",
                },
              ]);
            }}
            >
              <p className={selected ? styles.selectedChatRoom : ""}>
                {chatRoomName.room_name}
              </p>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}

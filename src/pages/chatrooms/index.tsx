import Header from "@/Components/Header";
import React, { use, useContext, useEffect, useState } from "react";
import { GetServerSideProps, NextApiRequest, NextApiResponse } from "next";
import Chat from "./chat";
import Cookies from "js-cookie";
import { UserContext } from "@/context/Context";
import ChatSwitch from "@/Components/chatswitchroom/ChatSwitch";
import { fetchAPI } from "@/utils/Api";

interface Message {
  message: string;
  sender: string;
  sender_id: string;
}

interface PreGenMessage {
  message: string;
  sender: string;
  user_id: string;
  room_name: string;
  sender_name: string;
  timestamp: BigInt;
}

interface chatTypes {
  id: Number;
  room_name: string;
}

type Props = {};

export default function Index({}: Props) {
  const { userName } = useContext(UserContext);
  const userId: string | undefined = Cookies.get("userId");
  const [chatRoomsName, setChatRoomsName] = useState<chatTypes[]>([]);
  const [selectedChatRoom, setSelectedChatRoom] = useState<chatTypes>({
    id: 1,
    room_name: "General",
  });
  const [messages, setMessages] = useState<Message[]>([
    { message: "Welcome to the new chat", sender: "Admin", sender_id: "1" },
  ]);
  const [previousMessages, setPreviousMessages] = useState<PreGenMessage[]>([]);
  useEffect(() => {
    async function fetchData() {
      const chatrooms: any = await fetchAPI("/getrooms", "GET", null);
      console.log(chatrooms);
      setChatRoomsName(chatrooms.data);
    }
    fetchData();
  }, []);
  useEffect(() => {
    let getMessages = async () => {
      if(!selectedChatRoom) return;
      if(selectedChatRoom.room_name){
        let response: any = await fetchAPI("/getmessages", "POST", {
          room_name: selectedChatRoom.room_name? selectedChatRoom.room_name : "General",
        });
        console.log("mesg", response.data);
        setPreviousMessages(response.data);
      };
    }
    getMessages();
  }, [selectedChatRoom]);
  useEffect(() => {
    async function loadMessages() {
    let newPreviousMessages = previousMessages.map((message) => {
      return {
        message: message.message,
        sender: message.sender_name,
        sender_id: message.user_id,
      };
    });
    setMessages(newPreviousMessages);
  }
    loadMessages();
  }, [previousMessages]);
  return (
    <div>
      <Header />
      <div style={{ display: "flex" }}>
        <div>
        <ChatSwitch
          chatRoomsName={chatRoomsName}
          setSelectedChatRoom={setSelectedChatRoom}
          selectedChatRoom={selectedChatRoom}
          setMessages={setMessages}
          setChatRoomsName={setChatRoomsName}
          />
          </div>
          <div>
        <Chat
          username={userName}
          selectedChatRoom={selectedChatRoom}
          setMessages={setMessages}
          messages={messages}
          userId={userId}
          />
          </div>
      </div>
    </div>
  );
}
export const getServerSideProps: GetServerSideProps = async (context) => {
  const token: string | undefined = context.req.cookies.token;
  const userId: string | undefined = context.req.cookies.userId;
  try {
    if (!token) {
      return {
        props: {
          isLogged: false,
          msg: "Unauthorized",
        },
        redirect: {
          destination: "/",
        },
      };
    }
    const response = await fetch("http://localhost:4000/users/checktoken", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        token: token ? token : "",
        userId: userId ? userId : "",
      },
    });
    const responseData = await response.json();
    console.log(response);
    if (!response.ok || !responseData.success) {
      localStorage.removeItem("userData");
      return {
        props: {
          isLogged: false,
          msg: "Invalid token",
        },
        redirect: {
          destination: "/",
        },
      };
    }
    return {
      props: {
        isLogged: true,
        msg: "User logged In",
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        isLogged: false,
        msg: "Internal server error",
      },
    };
  }
};

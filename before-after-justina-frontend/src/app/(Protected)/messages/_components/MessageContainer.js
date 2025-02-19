"use client";

import Image from "next/image";
import { Loader2, Paperclip, PlusCircleIcon, Send, X } from "lucide-react";
import UserCard from "./UserCard";
import { useEffect, useRef, useState } from "react";
import { useSocket } from "@/context/SocketContextApi";
import { useSelector } from "react-redux";
import { selectUser } from "@/redux/features/authSlice";
import MessageCard from "./MessageCard";
import { useForm } from "react-hook-form";
import { useUploadImageMutation } from "@/redux/api/messageApi";
import { toast } from "sonner";
import clsx from "clsx";
import CustomLoader from "@/components/CustomLoader/CustomLoader";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SendHorizontal } from "lucide-react";
import { useOnClickOutside } from "usehooks-ts";
import CustomAvatar from "@/components/CustomAvatar/CustomAvatar";
import { cn } from "@/lib/utils";
import { CirclePlus } from "lucide-react";
import { Images } from "lucide-react";
import { SmilePlus } from "lucide-react";
import Link from "next/link";
import EmojiPicker from "emoji-picker-react";
import { errorToast } from "@/utils/customToast";
import { Pen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useGetUserByIdQuery } from "@/redux/api/userApi";

const MessageContainer = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  const [chatListLoading, setChatListLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isMsgSendLoading, setIsMsgSendLoading] = useState(false);
  const [images, setImages] = useState(null);

  const { socket } = useSocket();
  const userId = useSelector(selectUser)?.userId;
  const [chatList, setChatList] = useState([]);
  const [chatId, setChatId] = useState("");
  const [selectedUser, setSelectedUser] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const chatBoxRef = useRef(null);
  const fileInputRef = useRef(null);

  const [fileUploadFn] = useUploadImageMutation();
  const emojiPickerRef = useRef(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [imgPreviews, setImgPreviews] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [searchError, setSearchError] = useState("");

  // typing states
  const [isSenderTyping, setIsSenderTyping] = useState(null);
  const [isReceiverTyping, setIsReceiverTyping] = useState(false);

  // ================= Image preview handler ================
  useEffect(() => {
    if (images) {
      images.forEach((imgFile) => {
        setImgPreviews((prev) => [...prev, URL.createObjectURL(imgFile)]);
      });
    }
  }, [images]);

  // ================= Scroll to bottom of chat box ================
  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  // Function to add emoji in input text
  const handleEmojiClick = (value) => {
    const emoji = value?.emoji;

    // Set react hook form input value
    const currentMessage = getValues("message");
    setValue("message", currentMessage + emoji);
  };

  // ================ Function to handle the file input click ===============
  const handleFileInputClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // ================= Handle search user ================
  const handleSearchUser = (value) => {
    if (!value) {
      setSearchError("Please type something");
    }

    setSearchText(value);
  };

  // =============== Click on outside event handler ===============
  useOnClickOutside(emojiPickerRef, () => setShowEmojiPicker(false));

  // ================ Emit `my-chat-list` to get chat list  ================
  const handleChatRes = (res) => {
    setChatList(res?.message);
    setChatListLoading(false);
  };

  useEffect(() => {
    setChatListLoading(true);

    if (socket) {
      socket.emit("my-chat-list", {}, handleChatRes);
    }
  }, [socket, userId]);

  /**
   * Emit `message-page` to get
   *  1. Previous messages
   *  2. Active users
   */
  useEffect(() => {
    if (socket && userId && selectedUser?._id) {
      socket.emit("message-page", selectedUser?._id);
    }
  }, [socket, userId, selectedUser?._id]);

  // ==================== Listen to `message` for previous messages ================
  useEffect(() => {
    setMessagesLoading(true);

    if (socket && userId) {
      socket.on("message", (res) => {
        setMessages(res);
        setMessagesLoading(false);
      });
    }

    return () => {
      socket.off("message", (res) => {
        setMessages(res);
        setMessagesLoading(false);
      });
    };
  }, [socket, userId]);

  // ==================== Listen to `onlineUser` for active users =================
  useEffect(() => {
    if (socket && userId) {
      socket.on("onlineUser", (res) => {
        setActiveUsers(res);
      });
    }

    return () => {
      socket.off("onlineUser", (res) => {
        setActiveUsers(res);
      });
    };
  }, [socket, userId]);

  // ==================== Set chatId if messages found =================
  useEffect(() => {
    if (messages?.length < 1) return;

    if (selectedUser) {
      setChatId(selectedUser?.chatId);
    }
  }, [messages, selectedUser]);

  // ==================== Listen to `newMessage` for new messages =================
  useEffect(() => {
    if (socket && userId && chatId) {
      socket.on(`new-message::${chatId}`, (res) => {
        setMessages((prev) => [...prev, res]);
        setIsMsgSendLoading(false);
      });
    }

    return () => {
      socket?.off(`new-message::${chatId}}`, (res) => {
        setMessages((prev) => [...prev, res]);
        setIsMsgSendLoading(false);
      });
    };
  }, [socket, userId, chatId]);

  useEffect(() => {
    setChatListLoading(true);
    if (userId) {
      socket.on(`chat-list::${userId}`, async (res) => {
        setChatList(res);
        setChatListLoading(false);
      });
    }

    return () => {
      socket?.off(`chat-list::${userId}`, async (res) => {
        setChatList(res);
        setChatListLoading(false);
      });
    };
  }, [userId, socket]);

  // =================== Send message =================
  const handleSendMsg = async (data) => {
    setIsMsgSendLoading(true);

    const payload = {
      text: data?.message,
      imageUrl: [],
      receiver: selectedUser?._id,
    };

    // return;

    try {
      if (images) {
        const formData = new FormData();

        images.forEach((image) => {
          formData.append("images", image);
        });

        const res = await fileUploadFn(formData).unwrap();
        payload.imageUrl = res?.data;
      }

      if (socket && userId) {
        socket?.emit("send-message", payload, async (res) => {
          if (!chatId) {
            setMessages((prev) => [...prev, res?.data]);
            setIsMsgSendLoading(false);
          }
        });
      }

      setImgPreviews([]);
      setImages(null);
      fileInputRef.current.value = null;
      reset();
    } catch (error) {
      errorToast(error?.data?.message);
      setIsMsgSendLoading(false);
    }
  };

  // =================== Listen to `typing` socket event =======================
  useEffect(() => {
    if (socket && userId) {
      socket.on(`typing::${userId}`, async (res) => {
        if (res?.success) {
          setIsReceiverTyping(true);
        }
      });
    }
  }, [socket, userId]);

  useEffect(() => {
    if (socket && userId) {
      socket.on(`stop-typing::${userId}`, async (res) => {
        if (res?.success) {
          setIsReceiverTyping(false);
        }
      });
    }
  }, [socket, userId]);

  useEffect(() => {
    if (isSenderTyping) {
      if (socket && chatId) {
        socket?.emit(`typing`, {
          chatId,
        });
      }
    } else if (!isSenderTyping) {
      socket?.emit(`stop-typing`, {
        chatId,
      });
    }
  }, [isSenderTyping, socket, chatId]);

  // =================== Change seen status =================
  useEffect(() => {
    if (socket && userId && chatId) {
      socket.emit("seen", { chatId });
    }
  }, [chatId, socket, userId]);

  // Check if user id is present in search params
  // If present, fetch user info and show input box on the right to send message
  const userIdFromSearchParams = useSearchParams().get("user");
  const { data: userRes, isLoading: isUserLoading } = useGetUserByIdQuery(
    userIdFromSearchParams,
    { skip: !userIdFromSearchParams },
  );
  const userFromSearchParam = userRes?.data || {};

  useEffect(() => {
    if (userIdFromSearchParams && !selectedUser?._id) {
      setSelectedUser(userFromSearchParam);
    }
  }, [userIdFromSearchParams, isUserLoading]);

  // ==================== Show loading while getting chat list =================
  if (chatListLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <CustomLoader color="var(--primary-blue)" size={35} stroke={4} />
      </div>
    );
  }

  return (
    <div className="min-h-[75vh] rounded-xl shadow-lg lg:mx-auto lg:max-h-[85vh]">
      <div className="relative z-10 flex flex-col rounded-xl rounded-t-xl border-t-8 border-t-primary-blue px-5 py-5 lg:flex-row xl:px-10">
        {/* left */}
        <div
          className={cn(
            "scroll-hide pr-6 lg:block lg:w-[30%] 2xl:w-[26%]",
            chatId ? "hidden" : "block",
          )}
        >
          <div className="flex items-end gap-x-5 text-black">
            <h4 className="text-2xl font-semibold">Messages</h4>
          </div>

          <div className="mx-auto mt-4">
            {/* TODO: Add a search field */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 size-5 -translate-y-1/2" />
              <Input
                name="search"
                placeholder="Search people..."
                className="px-8 py-5 font-dm-sans"
                onChange={handleSearchUser}
              />
              {searchError && (
                <span className="text-danger">{searchError}</span>
              )}
            </div>

            {/* users list */}
            <div className="scroll-hide mt-6 max-h-[100vh] space-y-2 overflow-auto">
              {chatList?.map((chat, idx) => (
                <>
                  <UserCard
                    key={chat?.chat?._id}
                    user={chat?.chat}
                    message={chat?.message}
                    unreadMessageCount={chat?.unreadMessageCount}
                    selectedUser={selectedUser}
                    setSelectedUser={setSelectedUser}
                    activeUsers={activeUsers}
                    loggedInUserId={userId}
                  />

                  {idx !== chatList?.length - 1 && (
                    <Separator className="!my-0 w-full py-0" />
                  )}
                </>
              ))}
            </div>
          </div>
        </div>

        {/* right */}
        <div
          className={cn(
            "scroll-hide flex h-full flex-col justify-between rounded-tl-lg lg:block lg:max-h-[80vh] lg:flex-grow lg:border lg:border-b-0 lg:border-r-0",
            chatId ? "block" : "hidden",
          )}
        >
          {!selectedUser?._id ? (
            <div className="flex h-[75vh] items-center justify-center">
              <div className="flex items-center gap-x-3 font-dm-sans text-2xl">
                <PlusCircleIcon size={28} /> Start a conversation
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-between lg:flex-grow lg:px-8">
              <div className="flex-center-between border-b-primary-black/20 border-b py-3">
                <div className="flex-center-start gap-x-4">
                  <CustomAvatar
                    img={selectedUser?.profile}
                    name={selectedUser?.name}
                    className="size-12 border border-primary-blue"
                  />

                  <div className="lg:flex-grow">
                    <h3 className="text-primary-black text-lg font-bold">
                      {selectedUser?.name}
                    </h3>

                    <div className="flex-center-start gap-x-3">
                      <div className="flex-center-start gap-x-1">
                        {/* Active/Online Indicator */}
                        <div
                          className={cn(
                            "h-2 w-2 rounded-full",
                            activeUsers?.includes(selectedUser?._id)
                              ? "bg-green-500"
                              : "bg-yellow-500",
                          )}
                        />
                        <p className="text-muted-foreground text-xs font-medium">
                          {activeUsers?.includes(selectedUser?._id)
                            ? "Online"
                            : "Offline"}
                        </p>
                      </div>

                      {/* {isReceiverTyping && (
                        <span className="flex-center-start text-primary-black/50 text-sm font-semibold">
                          Typing... <Pencil size={13} className="ml-2" />
                        </span>
                      )} */}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat messages */}
              <div
                className="hide-scroll max-h-[65vh] min-h-[65vh] overflow-auto py-10"
                ref={chatBoxRef}
              >
                <div>
                  {messages === undefined ? (
                    <div className="flex-center min-h-[65vh] w-full gap-x-2 text-2xl font-bold">
                      <Loader2
                        size={50}
                        className="animate-spin"
                        color="#6b7280"
                      />
                    </div>
                  ) : (
                    <>
                      {messages?.length > 0 ? (
                        <>
                          {messages?.map((msg, index) => (
                            <MessageCard
                              key={msg?._id}
                              message={msg}
                              userId={userId}
                              selectedUser={selectedUser}
                              previousMessage={
                                index > 0 ? messages[index - 1] : null
                              }
                            />
                          ))}
                        </>
                      ) : (
                        <div className="flex-center min-h-[65vh] w-full gap-x-2 text-2xl font-bold">
                          <CirclePlus />
                          <p>Start a conversation</p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Chat Input Form */}
              <div className="relative !z-[99999]">
                {/* Image preview */}
                {imgPreviews?.length > 0 && (
                  <div className="border-b-none border-primary-black absolute bottom-14 rounded-2xl border-x border-t bg-white p-2 lg:w-[89%]">
                    <button
                      className="absolute right-1 top-1 rounded-full bg-danger p-1 text-white"
                      onClick={() => {
                        setImages(null);
                        setImgPreviews([]);
                        fileInputRef.current.value = null;
                      }}
                    >
                      <X size={16} />
                    </button>

                    <div className="!z-[99999] grid grid-cols-1 gap-5 md:grid-cols-3 lg:grid-cols-5">
                      {imgPreviews?.map((imgPreview) => (
                        <div
                          key={imgPreview}
                          className="w-full rounded-xl border border-slate-200 p-1"
                        >
                          <Image
                            src={imgPreview}
                            alt="image preview"
                            height={1250}
                            width={1250}
                            className="mx-auto block h-[120px] w-auto rounded-lg"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* {isReceiverTyping && (
                  <div className="mb-5 mr-auto max-w-max">
                    {selectedUser?.name} is typing... <Pen size={15} />
                  </div>
                )} */}

                <form
                  onSubmit={handleSubmit(handleSendMsg)}
                  className="flex-center gap-x-4 py-2"
                >
                  {/* Message Input */}
                  <div className="relative flex-grow">
                    <Input
                      placeholder="Type a message"
                      type="text"
                      className={cn(
                        "w-full rounded-full border border-primary-blue/50 bg-transparent px-4 py-6 pr-14 text-base font-medium text-black",
                        errors?.message && "outline-red-500",
                      )}
                      {...register("message", {
                        required: imgPreviews ? false : true,
                      })}
                      // onFocus={() => setIsSenderTyping(true)}
                      // onBlur={() => setIsSenderTyping(false)}
                    />

                    {/* Send Button */}
                    <button
                      disabled={isMsgSendLoading}
                      type="submit"
                      className="text-primary-white absolute right-2 top-1/2 -translate-y-1/2 rounded-full border-none bg-primary-blue p-2.5 shadow-none disabled:text-gray-400"
                    >
                      {isMsgSendLoading ? (
                        <Loader2
                          size={18}
                          className="animate-spin text-white"
                        />
                      ) : (
                        <SendHorizontal size={18} className="text-white" />
                      )}
                    </button>
                  </div>

                  {/* Buttons */}
                  {/* File Input */}
                  <button
                    type="button"
                    disabled={isMsgSendLoading}
                    className="rounded-full bg-light-primary-blue p-3 disabled:text-gray-400"
                    onClick={handleFileInputClick}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      multiple={true}
                      className="hidden"
                      onChange={(e) => {
                        setImages([...e.target.files]);
                      }}
                    />

                    <Images size={20} />
                  </button>

                  {/* Emoji */}
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded-full bg-light-primary-blue p-3 disabled:text-gray-400"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    >
                      <SmilePlus size={20} />
                    </button>

                    <div
                      ref={emojiPickerRef}
                      className="absolute bottom-16 right-0"
                    >
                      <EmojiPicker
                        open={showEmojiPicker}
                        onEmojiClick={handleEmojiClick}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageContainer;

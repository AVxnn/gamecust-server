import Comment from "../models/comment/comment.js";

export const socketPost = (io) => {
  let onlineUsers = [];

  console.log("socket work");
  io.on("connection", async (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("addNewUser", (userId) => {
      !onlineUsers.some((user) => user.userId === userId) &&
        onlineUsers.push({
          userId,
          socketId: socket.id,
        });
      console.log(onlineUsers, userId);

      io.emit("getOnlineUsers", onlineUsers);
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("🔥: A user disconnected");
    });
  });
};

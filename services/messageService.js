const messageDao = require("../dao/messageDao");
const fs = require("fs");
const path = require("path");

// Helper function to get a random avatar
const getRandomAvatar = () => {
  const avatarDir = path.resolve(__dirname, "../public/static/avatar");
  const avatarFiles = fs.readdirSync(avatarDir);
  const randomIndex = Math.floor(Math.random() * avatarFiles.length);
  return `/static/avatar/${avatarFiles[randomIndex]}`;
};

// Add a new message (blogId is null)
exports.addMessage = async function (messageInfo) {
  // Validate message data
  if (!messageInfo.nickname || !messageInfo.content) {
    throw new Error("Nickname and content are required");
  }
  
  // Set blogId to null for messages
  messageInfo.blogId = null;
  
  // Set createDate to current time
  messageInfo.createDate = Date.now();
  
  // Set random avatar
  messageInfo.avatar = getRandomAvatar();
  
  return await messageDao.addMessage(messageInfo);
};

// Add a new comment (blogId is not null)
exports.addComment = async function (commentInfo) {
  // Validate comment data
  if (!commentInfo.nickname || !commentInfo.content) {
    throw new Error("Nickname and content are required");
  }
  
  // If blogId is empty string, set it to null
  if (commentInfo.blogId === "") {
    commentInfo.blogId = null;
  }
  
  // Set createDate to current time
  commentInfo.createDate = Date.now()
  
  // Set random avatar
  commentInfo.avatar = getRandomAvatar();
  
  const result = await messageDao.addMessage(commentInfo);
  
  // If it's a comment with blogId, increment commentNumber
  if (result.blogId) {
    await messageDao.incrementBlogCommentCount(result.blogId);
  }
  
  return result;
};

// Get messages or comments
exports.getMessages = async function (blogId, page, limit) {
  return await messageDao.getMessages(blogId, page, limit);
};

// Delete a message or comment
exports.deleteMessage = async function (id) {
  if (!id) {
    throw new Error("Message ID is required");
  }
  
  // Get the message to check if it's a comment
  const message = await messageDao.deleteMessage(id);
  
  if (!message) {
    throw new Error("Message not found");
  }
  
  // If it was a comment with blogId, decrement commentNumber
  if (message.blogId) {
    await messageDao.decrementBlogCommentCount(message.blogId);
  }
  
  return message;
};

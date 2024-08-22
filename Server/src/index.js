import { createServer } from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import dotenv from 'dotenv';
import OpenAI from 'openai';
import { indexDocument, retrieveRelevantChunks } from './elasticsearch.js';
import { generateSummary } from './summarization.js';

// Load environment variables
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.use((socket, next) => {
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.username = username;
  socket.userId = uuidv4();
  next();
});

io.on("connection", async (socket) => {
  console.log(`${socket.username} connected with ID: ${socket.userId}`);

  // Handle file upload and PDF summarization
  socket.on("file upload", async ({ file, fileName, fileType }) => {
    console.log("File uploaded:", fileName, fileType);

    const fileExtension = path.extname(fileName);
    const uniqueFileName = `${uuidv4()}${fileExtension}`;
    const filePath = path.join(process.cwd(), "uploads", uniqueFileName);

    // Save PDF file
    fs.writeFile(filePath, Buffer.from(file, "base64"), async (err) => {
      if (err) {
        console.error("Error saving the file:", err);
        return;
      }

      console.log("File saved successfully.");

      // Parse the PDF file
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      const pdfText = pdfData.text;

      // Index the document
      const fileId = uuidv4();
      await indexDocument(pdfText, fileId);

      // Generate summary
      const summary = generateSummary(pdfText);

      // Broadcast the summary to all users
      socket.broadcast.emit("pdf summary", {
        userId: socket.userId,
        username: socket.username,
        fileName,
        summary,
      });

      // Optionally, you can remove the file after processing
      fs.unlinkSync(filePath);
    });
  });

  // Handle document querying
  socket.on("query document", async (query) => {
    const relevantChunks = await retrieveRelevantChunks(query);
    const summary = generateSummary(relevantChunks);

    socket.emit("query results", {
      query,
      summary,
      relevantChunks,
    });
  });

  // Send all connected users
  const users = [];
  for (let [id, socket] of io.of("/").sockets) {
    users.push({
      userId: socket.userId,
      username: socket.username,
    });
  }
  socket.emit("session", { userId: socket.userId, username: socket.username });
  socket.emit("users", users);

  // Notify other users of the new connection
  socket.broadcast.emit("user connected", { userId: socket.userId, username: socket.username });

  // Handle new message event
  socket.on("new message", (message) => {
    socket.broadcast.emit("new message", {
      userId: socket.userId,
      username: socket.username,
      message,
    });
  });

  // Handle user disconnection
  socket.on("disconnect", () => {
    console.log(`${socket.username} disconnected`);
    socket.broadcast.emit("user disconnected", {
      userId: socket.userId,
      username: socket.username,
    });
  });
});

console.log("Listening to the port...");
httpServer.listen(process.env.PORT || 4000);
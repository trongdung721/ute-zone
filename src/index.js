import express from "express";
import session from "express-session";
import dbConfig from "./configurations/dbConfig.js";
import "dotenv/config.js";
import cors from "cors";
import job from "./utils/cron.js";
import { swaggerDocs, swaggerUi } from "./configurations/swaggerConfig.js";
import { userRouter } from "./routes/userRouter.js";
import { roleRouter } from "./routes/roleRouter.js";
import { fileRouter } from "./routes/fileRouter.js";
import { permissionRouter } from "./routes/permissionRouter.js";
import { corsOptions } from "./static/constant.js";
import { postRouter } from "./routes/postRouter.js";
import { commentRouter } from "./routes/commentRouter.js";
import { conversationRouter } from "./routes/conversationRouter.js";
import { conversationMemberRouter } from "./routes/conversationMemberRouter.js";
import { friendshipRouter } from "./routes/friendshipRouter.js";
import { messageReactionRouter } from "./routes/messageReactionRouter.js";
import { messageRouter } from "./routes/messageRouter.js";
import { notificationRouter } from "./routes/notificationRouter.js";
import { postReactionRouter } from "./routes/postReactionRouter.js";
import { commentReactionRouter } from "./routes/commentReactionRouter.js";
import { storyViewRouter } from "./routes/storyViewRouter.js";
import { storyRouter } from "./routes/storyRouter.js";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { setupSocketHandlers } from "./utils/utils.js";
import { statisticRouter } from "./routes/statisticRouter.js";
import { settingRouter } from "./routes/settingRouter.js";
import { chatbotRouter } from "./routes/chatbotRouter.js";
import "./configurations/googleConfig.js";
import passport from "passport";
import { pageRouter } from "./routes/pageRouter.js";
import { pageFollowerRouter } from "./routes/pageFollowerRouter.js";
import { pageMemberRouter } from "./routes/pageMemberRouter.js";
import { pagePostRouter} from "./routes/pagePostRouter.js";
import { pagePostCommentRouter } from "./routes/pagePostCommentRouter.js";
import { pagePostReactionRouter } from "./routes/pagePostReactionRouter.js";
import { pagePostCommentReactionRouter } from "./routes/pagePostCommentReactionRouter.js";
import { groupRouter } from "./routes/groupRouter.js";
import { groupMemberRouter } from "./routes/groupMemberRouter.js";
import { groupJoinRequestRouter } from "./routes/groupJoinRequestRouter.js";
import { groupPostRouter } from "./routes/groupPostRouter.js";
import { groupPostReactionRouter } from "./routes/groupPostReactionRouter.js";
import { groupPostCommentRouter } from "./routes/groupPostCommentRouter.js";
import { groupPostCommentReactionRouter } from "./routes/groupPostCommentReactionRouter.js";
import { moderationSettingRouter } from "./routes/moderationSettingRouter.js";
import recommendationRouter from "./routes/recommendationRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(cors(corsOptions));
app.use(express.json({ limit: "200mb" }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use("/v1/user", userRouter);
app.use("/v1/chatbot", chatbotRouter);
app.use("/v1/role", roleRouter);
app.use("/v1/file", fileRouter);
app.use("/v1/permission", permissionRouter);
app.use("/v1/post", postRouter);
app.use("/v1/comment", commentRouter);
app.use("/v1/conversation", conversationRouter);
app.use("/v1/conversation-member", conversationMemberRouter);
app.use("/v1/friendship", friendshipRouter);
app.use("/v1/message-reaction", messageReactionRouter);
app.use("/v1/message", messageRouter);
app.use("/v1/notification", notificationRouter);
app.use("/v1/post-reaction", postReactionRouter);
app.use("/v1/comment-reaction", commentReactionRouter);
app.use("/v1/story-view", storyViewRouter);
app.use("/v1/story", storyRouter);
app.use("/v1/statistic", statisticRouter);
app.use("/v1/setting", settingRouter);
app.use("/v1/page", pageRouter);
app.use("/v1/page-follower", pageFollowerRouter);
app.use("/v1/page-member", pageMemberRouter);
app.use("/v1/Page-Post", pagePostRouter);
app.use("/v1/page-post-comment", pagePostCommentRouter);
app.use("/v1/page-post-reaction", pagePostReactionRouter);
app.use("/v1/page-post-comment-reaction", pagePostCommentReactionRouter);
app.use("/v1/group", groupRouter);
app.use("/v1/group-member", groupMemberRouter);
app.use("/v1/group-join-request", groupJoinRequestRouter);
app.use("/v1/group-post", groupPostRouter);
app.use("/v1/group-post-reaction", groupPostReactionRouter);
app.use("/v1/group-post-comment", groupPostCommentRouter);
app.use("/v1/group-post-comment-reaction", groupPostCommentReactionRouter);
app.use("/v1/moderation-settings", moderationSettingRouter);
app.use("/v1/recommendation", recommendationRouter);
app.use(express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

job.start();

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
dbConfig();
setupSocketHandlers(io);

export { io };

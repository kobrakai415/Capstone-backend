import express from 'express';
import mongoose from "mongoose";
import cors from 'cors';
import listEndpoints from 'express-list-endpoints';
import { unAuthorizedHandler, notFoundErrorHandler, badRequestErrorHandler, forbiddenErrorHandler, catchAllErrorHandler, mongoErrorHandlers } from "./errorHandlers.js";
import NewsRouter from "./services/news/index.js";
import UserRouter from "./services/users/index.js";
import TradeRouter from './services/positions/index.js';
import WatchlistRouter from './services/watchlists/index.js';
import PostsRouter from './services/posts/index.js';
import cookieParser from 'cookie-parser';

const server = express();

const whitelist = [process.env.FE_DEV_URL, process.env.FE_PROD_URL, "http://localhost:3000"]
console.log('whitelist:', whitelist)

const corsOptions = {
  origin: function (origin, next) {
    if (whitelist.indexOf(origin) !== -1) {
      next(null, next)
    } else {
      next(createError(403, { message: "Origin not allowed" }))
    }
  },
  credentials: true
}

server.use(cors(corsOptions));
server.use(express.json());
server.use(cookieParser());

server.use("/", NewsRouter)
server.use("/users", UserRouter)
server.use("/trade", TradeRouter)
server.use("/watchlists", WatchlistRouter)
server.use("/posts", PostsRouter)


server.use(unAuthorizedHandler);
server.use(notFoundErrorHandler);
server.use(badRequestErrorHandler);
server.use(forbiddenErrorHandler);
server.use(mongoErrorHandlers);
server.use(catchAllErrorHandler);


const port = process.env.PORT || 3001

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true }, { useUnifiedTopology: true }).then(() => {
  console.log("Connected to mongo");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log("Server listening on port " + port);
  });
});
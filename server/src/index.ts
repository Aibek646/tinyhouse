import "dotenv/config";
import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";
import { connectDatabase } from "./database";
import { resolvers, typeDefs } from "./graphql";
import cookieParser from "cookie-parser";

const mount = async (app: Application) => {
    const db = await connectDatabase();

    app.use(cookieParser(process.env.SECRET));

    const server = new ApolloServer({
        resolvers,
        typeDefs,
        context: ({ req, res }) => ({ db, req, res })
    });
    server.start().then(() => {
        server.applyMiddleware({ app, path: "/api" });
        app.listen(process.env.PORT);
        console.log(`[app]: http://localhost:${process.env.PORT}`);
    });
};

mount(express());

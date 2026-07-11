import { httpRouter } from "convex/server";
import { chat } from "./assistent/http/chat";
import { getClassSuggestions } from "./assistent/http/getClassSuggestions";
import { getTitle } from "./assistent/http/getTitle";
import { imagine } from "./assistent/http/imagine";
import { auth } from "./auth";
import { githubWebhook } from "./github/webhook";

const http = httpRouter();

auth.addHttpRoutes(http);

http.route({
  path: "/github/webhook",
  method: "POST",
  handler: githubWebhook,
});

// Router endpoint - routes to appropriate agent based on message content
http.route({
  path: "/api/assistent/chat",
  method: "POST",
  handler: chat,
});

http.route({
  path: "/api/assistent/chat",
  method: "OPTIONS",
  handler: chat,
});

http.route({
  path: "/api/assistent/getTitle",
  method: "POST",
  handler: getTitle,
});

http.route({
  path: "/api/assistent/getTitle",
  method: "OPTIONS",
  handler: getTitle,
});

http.route({
  path: "/api/assistent/getClassSuggestions",
  method: "POST",
  handler: getClassSuggestions,
});

http.route({
  path: "/api/assistent/getClassSuggestions",
  method: "OPTIONS",
  handler: getClassSuggestions,
});

http.route({
  path: "/api/assistent/imagine",
  method: "POST",
  handler: imagine,
});

http.route({
  path: "/api/assistent/imagine",
  method: "OPTIONS",
  handler: imagine,
});

export default http;

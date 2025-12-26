import { renderToString } from "react-router/server";
import { router } from "./root";

export default function handleRequest(request: Request) {
  return new Response(renderToString(router), {
    headers: { "Content-Type": "text/html" },
  });
}

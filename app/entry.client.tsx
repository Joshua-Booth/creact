import { hydrateRoot } from "react-router/client";
import { router } from "./root";

hydrateRoot(document.getElementById("root")!, router);

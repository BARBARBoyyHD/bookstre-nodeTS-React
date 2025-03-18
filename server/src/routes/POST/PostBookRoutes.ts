import { Router } from "express";
import { post } from "../../controllers/POST/PostBookControllers";

const route = Router();

route.post("/api/post/book", post);

export default route;

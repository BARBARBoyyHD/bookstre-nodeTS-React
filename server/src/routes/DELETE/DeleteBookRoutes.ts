import { Router } from "express";
import { deleteBook } from "../../controllers/DELETE/DeleteBookControllers";
const route = Router();

route.delete("/api/delete/book/:id",deleteBook);

export default route;

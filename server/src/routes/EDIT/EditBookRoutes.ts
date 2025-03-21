import { Router } from "express";
import { editBook } from "../../controllers/EDIT/EditBookControllers";
const route = Router();

route.put("/api/edit/book/:id", editBook);

export default route;


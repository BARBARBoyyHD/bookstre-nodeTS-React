import { Router } from "express";
import {editSingleBook} from "../../controllers/SINGLE/GetSingleBookControllers"
const route = Router();

route.get("/api/single/book/:id",editSingleBook)

export default route
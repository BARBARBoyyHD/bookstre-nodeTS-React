import {Router} from "express";
import {getBooks} from "../../controllers/GET/bookListControllers";
const route = Router();

route.get("/api/book/list",getBooks)

export default route
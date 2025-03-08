import express from "express";
import bookListRoutes from "./src/routes/GET/bookListRoutes"

const app = express()

const port: number = 5000

app.get("/", (req, res) => {
    res.send("hello world")
})

app.get("/api/book/list",bookListRoutes)

app.listen(port,()=>{
    console.log(`http://localhost:${port}`)
})
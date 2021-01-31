const express = require("express")
const cors = require("cors")
const contactsRouter = require("./routes/contactsRoutes.js")

const PORT = process.env.NODE_START || 5500

class Server {
  start() {
    this.server = express()
    this.initMiddlewares()
    this.initRoutes()
    this.listener()
  }
  initMiddlewares() {
    this.server.use(express.json())
    this.server.use(
      cors({
        origin: "*",
      })
    )
  }
  initRoutes() {
    this.server.use("/api/contacts", contactsRouter)
  }
  listener() {
    this.server.listen(PORT, () => {
      console.log("Server on this port: ", PORT)
    })
  }
}
const server = new Server()
server.start()

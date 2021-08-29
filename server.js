const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})

const chat = require("./utils/routes/chat")
const chatModel = require("./utils/models/chatModel")
const cors = require('cors')
const PORT = process.env.PORT_APP || 8090
const { addUser, getUser, deleteUser, getUsers } = require('./users')


app.use(cors())

io.on('connection', (socket) => {
    socket.on('login', ({ name, room }, callback) => {
        console.log("user login", socket.id, name, room)
        const { user, error } = addUser(socket.id, name, room)
        if (error) return callback(error)
        socket.join(user.room)
        socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the room` })
        io.in(room).emit('users', getUsers(room))
        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        console.log("message", message)
        const user = getUser(socket.id)
        if(user?.name){
            const chat = new chatModel({
                username : user.name,
                message : message,
                room : user.room,
                created_at : new Date()
            })
            chat.save(err => {
                console.log("err save chat", err)
                callback(err)
            })
            io.in(user.room).emit('message', { username: user.name, message });
            callback()
        }else{
            callback("user not found")
        }
    })

    socket.on("disconnect", () => {
        console.log("User disconnected");
        const user = deleteUser(socket.id)
        if (user) {
            io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
            io.in(user.room).emit('users', getUsers(user.room))
        }
    })
})

app.use('/chat', chat);

app.get('/', (req, res) => {
    res.send("Server is up and running")
})

http.listen(PORT, () => {
    console.log(`Listening to ${PORT}`);
})
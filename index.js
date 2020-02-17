var express = require('express');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var port = process.env.PORT || 3000;
var bodyParser = require('body-parser');
var auth = require('./routes/auth');
var chat = require('./routes/chat');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


const{mongoPath} = require('./config');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(mongoPath, {useNewUrlParser: true});



app.use('/', auth);
app.use('/chat', chat);


var userCount = 0;

const {Chat} = require('./models/Chat');

io.on('connection', function(socket){
  ++userCount;
  io.emit('counter', userCount);
  socket.on('chat message', function(msg){
    const chat = new Chat({
      username: msg.username,
      text: msg.msg
    })
    chat.save()
    io.emit('chat message', msg);
  });

  socket.on('disconnect', () => {
      --userCount;    
      io.emit('counter', userCount);
  });
});

http.listen(port, function(){
  console.log('listening on :' + port);
});

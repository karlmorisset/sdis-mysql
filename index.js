import expressLayout from 'express-ejs-layouts';
import cookieParser from 'cookie-parser';
import express from 'express';
import server from './app';
import { checkUser } from './server/middleware/MySQL/authMiddleware';
// import connectDB from './server/config/db/mongodb';
import router from './server/routes/router';
import { connectMYSQL } from './server/config/db/mysql';
import MatchSockets from './server/middleware/SocketsMiddleware';
import { Server } from 'socket.io';

// Initilisation du serveur
const { app, httpServer } = server.init();

// Définition du répertoire contenant les ressources statiques
app.use(express.static('public'));

// Définition du moteur de rendu
app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

// Middleware permettant d'extraire le body des requêtes POST
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkUser);

// app.use(MatchSockets(httpServer));
const io = new Server(httpServer);

io.on('connection', (socket) => {
  socket.on('newComment', (data) => {
    io.sockets.emit('newComment', data);
  });

  socket.on('removeComment', (data) => {
    io.sockets.emit('removeComment', data);
  });
});
// app.use((req, res, next) => {
//   const io = new Server(httpServer);

//   console.log('in MatchSockets middleware');

//   io.on('connection', (socket) => {
//     socket.on('newComment', (data) => {
//       io.sockets.emit('newComment', { ...data, user: res.locals.user.id });
//     });
//     socket.on('removeComment', (data) => {
//       io.sockets.emit('removeComment', data);
//     });
//   });

//   next();
// });

// Toutes les routes de l'application
app.use('/matches', router.matches);
app.use('/auth', router.auth);
app.use('/comments', router.comments);
app.use('/downloads', router.downloads);

// Connexion à la base de données puis démarrage du serveur
connectMYSQL().then(() => server.listen());

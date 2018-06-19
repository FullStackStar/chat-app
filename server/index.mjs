import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import socket from 'socket.io';
import mongoose from 'mongoose';
import routes from './router';
import {mongoUrl, port} from './config';
import {baseHeader} from "./middleware/header";
let app = express();

mongoose.connect(mongoUrl).then(
    () => { console.log('connected to db') },
    err => { console.log(`error connecting:${err}`) }
);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(logger('dev'));

app.use(baseHeader);
app.use('/api/v1', routes);
let server = app.listen(port,() => {
    console.log(`server is running on ${port} `)
});
let io = socket(server);
io.on('connection',(socket) => {
    socket.on('SEND_MESSAGE', (data) => {
        console.log(data);
        io.emit('RECEIVE_MESSAGE', data);
    })
});
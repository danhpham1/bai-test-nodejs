const express = require('express');

const bodyParser = require('body-parser');

const app = express();

const userRouter = require('./routers/user');

app.use( bodyParser.urlencoded({ extended: true }) );
app.use( bodyParser.json() );

app.use('/user', userRouter);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})
const express = require('express');
const morgan = require('morgan');
const { addPage, editPage, main, userList, userPages, wikiPage } = require('./views');
const layout = require('./views/layout');
const { db, Page, User } = require('./models');
const wikiRouter = require('./routes/wiki');
const usersRouter = require('./routes/users');

const app = express();

db.authenticate()
  .then(() => {
    console.log('connected to the database');
  })

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
    res.redirect('/wiki');
})

app.use('/wiki',wikiRouter);
app.use('/users',usersRouter);

const PORT = 1337;

const init = async () => {
    await db.sync({force: true});

    app.listen(PORT, () => {
        console.log(`Server listening in port ${PORT}`);
      });
}

init();
var express = require('express');
var app = express();

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});

const Comments = sequelize.define('Comments', {
  content: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
});

(async () => {
await Comments.sync();
})();

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'ejs');

app.get('/', async function(req, res) {
  const comments = await Comments.findAll();
  res.render('index',{ comments: comments});
});

app.post('/create', async function(req, res) {
  const { content } = req.body
  await Comments.create({ content: content });
  res.redirect('/')
});

app.post('/update/:id', async function(req, res) {
  const { content } = req.body
  const { id } = req.params
  await Comments.update({ content: content }, {
    where: {
      id: id
    }
  });
  res.redirect('/')
});

app.post('/delete/:id', async function(req, res) {
  const { id } = req.params
  await Comments.destroy({
    where: {
      id: id
    }
  });
  res.redirect('/')
});

app.listen(3000);
console.log('Server is listening on port 3000');
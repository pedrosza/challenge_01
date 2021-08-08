const express = require('express');
const cors = require('cors');

const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
   const { username } = request.headers;

   const userExist = users.find(user => user.username === username);

   if(!userExist){
    return response.status(404).json({error: 'User not Exist!'})
   }

   request.username = userExist;
   
   return next();
};

app.post('/users', (request, response) => {
  const {name, username} = request.body;

  usernameAvailable = users.find(user => user.username === username);

  if(usernameAvailable){
    return response.status(400).json({error: 'User already Exist!'});
  }

   const newUser = {
    id: uuidv4(),
    name: name,
    username: username,
    todos: []
   };

   users.push(newUser);

   return response.status(201).json(newUser);
});

app.get('/todos', checksExistsUserAccount, (request, response) => {
  const { username } = request;

  return response.json(username.todos);
});

app.post('/todos', checksExistsUserAccount, (request, response) => {
  const {title, deadline} = request.body;
  const {username} = request;

  const newTodo = {
    id: uuidv4(),
	  title: title,
  	done: false, 
  	deadline: new Date(deadline), 
	  created_at: new Date()
  };

  username.todos.push(newTodo);

  return response.status(201).json(newTodo);

});

app.put('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {title, deadline} = request.body;
  const {id} = request.params;

  const todo = username.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({error: 'Todo not Exist!'});
  }

  todo.title = title;
  todo.deadline = new Date(deadline);

  return response.status(201).json(todo);
  
});

app.patch('/todos/:id/done', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {id} = request.params;

  const todo = username.todos.find(todo => todo.id === id);

  if(!todo){
    return response.status(404).json({error: 'Todo not Exist!'});
  }

  if(todo.done === true){
    return response.status(404).json({error: 'Todo already Done'});
  }

  todo.done = true;

  return response.status(201).json(todo);
  
});

app.delete('/todos/:id', checksExistsUserAccount, (request, response) => {
  const {username} = request;
  const {id} = request.params;

  const todoIndex = username.todos.findIndex(todo => todo.id === id);

  if(todoIndex === -1){
    return response.status(404).json({error: 'Mensagem de Erro'});
  }

  username.todos.splice(todoIndex, 1);

  return response.status(204).send();
});

module.exports = app;
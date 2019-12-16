const express = require('express');
/**
 * Basically the express will help us to start the server and build the http methods.
 * this is a dependencie "yarn add Express".
 */
const api = express();
/*here I started 2 variables, "api" have the express inside it and the projects
  which is a array.
*/
const projects = [];
/**
 * Middleware is any kind of function that is between an HTTP request and the 
 * final response that the server sends back to the client.
 * here is a global middleware, it informs to server to use JSON format in 
 * the https requests
*/
api.use(express.json());

var i = 0;
//This is a local middleware that will check if the ID exists on all requests that are passed an id.
function checkIfIdExist(req, res, next) {
  /**
   * req is the request which capture the datas from user
   * res is the response which will be send to user
   * next is the method which will continue the request.
   */
  const { id } = req.params;
  //here I confirm if there are projects checking with id that is passed by request
  const procjectExists = projects.find(p => p.id == id);
  if (!procjectExists) {
    //if don't exists I send the error
    return res.status(404).json({ error: ' Not found the id.' })
  }
  //if exists continue with the requests
  return next();
}
//This is a local middleware that will validate the registry.
function checkRegister(req, res, next) {
  // here I catch the id and title from request
  const { id, title } = req.body;
  // I search any project with the same id
  const procjectExists = projects.find(p => p.id == id);
  if (!id) {
    //if don't have id in the request, I send a error
    return res.status(400).json({ error: 'Id is required ' })
  }
  if (!title) {
    //if don't have title in the request, I send a error
    return res.status(400).json({ error: 'Title is required ' })
  }
  if (procjectExists) {
    //if exists project with same id, I send a error
    return res.status(400).json({ error: 'The id already exists ' })
  }
  return next();
}

api.use((req, res, next) => {
  i += 1;
  //Here I made a request counter to appear to the developer in the console. 
  console.log(`Foi realizado o método: ${req.method} da URL:${req.url}, requisições realizadas ${i}`);
  return next();
})
/**
 * This are the http requests
 * GET - When we want to search any data inside the database
 * POST - When we want create any data
 * PUT - When we want update any data
 * DELETE - when we want delete any data
 */
api.get("/projects", (req, res) => {
  return res.json(projects);
})
//note the local middleware in the request checkRegister
api.post("/projects", checkRegister, (req, res) => {
  //here I collect the id and the title from request body
  const { id, title } = req.body;
  //here I build the project format
  const project = {
    id: id,
    title: title,
    tasks: []
  }
  //here I push the "project" to "projects" array
  projects.push(project)
  //here I return in the json format the project created.
  return res.json(project);
})
//note the local middleware in the request checkIfIdExist
api.post("/projects/:id/tasks", checkIfIdExist, (req, res) => {
  //id is being collected from url parameter
  const { id } = req.params;
  const { title } = req.body;

  const project = projects.find(p => p.id == id);
  //here I'm pushing the title to tasks.
  project.tasks.push(title)

  return res.json(project);
})

api.put("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id == id);
  //here I'm updating the project title
  project.title = title;

  return res.json(project);
})

api.delete("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id == id);
  //here I'm finding the index with the id i collected from url paramter

  projects.splice(projectIndex, 1);
  // Once I find the index I splice and remove this index from array array
  return res.json({ message: "Deletado com sucesso" });

})



api.listen(3000);
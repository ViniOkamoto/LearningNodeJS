const express = require('express');

const api = express();

const projects = [];
api.use(express.json());

var i = 0;

function checkIfIdExist(req, res, next) {
  const { id } = req.params;
  const procjectExists = projects.find(p => p.id == id);
  if (!procjectExists) {
    return res.status(404).json({ error: ' Not found the id.' })
  }
  return next();
}

function checkRegister(req, res, next) {
  const { id, title } = req.body;
  const procjectExists = projects.find(p => p.id == id);
  if (!id) {
    return res.status(400).json({ error: 'Id is required ' })
  }
  if (!title) {
    return res.status(400).json({ error: 'Title is required ' })
  }
  if (procjectExists) {
    return res.status(400).json({ error: 'The id already exists ' })
  }
  return next();
}

api.use((req, res, next) => {
  i += 1;
  console.log(`Foram realizadas ${i} requisições`);
  return next();
})
api.get("/projects", (req, res) => {
  return res.json(projects);
})

api.post("/projects", checkRegister, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id: id,
    title: title,
    tasks: []
  }
  projects.push(project)
  return res.json(project);
})

api.post("/projects/:id/tasks", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(p => p.id == id);
  project.tasks.push(title)

  return res.json(project);
})

api.put("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(project => project.id == id);
  project.title = title;

  return res.json(project);
})

api.delete("/projects/:id", checkIfIdExist, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(project => project.id === id);
  projects.splice(projectIndex, 1);

  return res.json({ message: "Deletado com sucesso" });

})



api.listen(3000);
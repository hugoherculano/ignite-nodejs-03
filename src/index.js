const express = require("express");
const cors = require("cors");

const { v4: uuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  
  try {
  
    return response.json(repositories);

  } catch(e) {

    return response.status(400).json({ error: 'Error!' });

  }
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body

  try {

    if(!title || !url || !techs) {
      return response.status(400).json({ error: 'Error!' });
    }

    const repository = {
      id: uuid(),
      title,
      url,
      techs,
      likes: 0
    };

    repositories.push(repository)
  
    return response.status(201).json(repository);

  } catch(e) {
    return response.status(400).json({ error: 'Error!' });
  }
});

app.put("/repositories/:id", (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  try {
  
    const repositoryIndex = repositories.findIndex(repo => repo.id === id);

    if (repositoryIndex === -1) {
      return response.status(404).json({ error: "Repository not found" });
    }

    const repositoryOld = { ...repositories[repositoryIndex] }

    const newrepository = {
      id,
      title: title ? title : repositoryOld.title,
      url: url ? url : repositoryOld.url,
      techs: techs ? techs : repositoryOld.techs,
      likes: repositoryOld.likes
    }
  
    repositories[repositoryIndex] = newrepository;
  
    return response.json(newrepository);

  } catch(e) {
    return response.status(400).json({ error: 'Error!' });
  }

});

app.delete("/repositories/:id", (request, response) => {

  const { id } = request.params;

  try {
  
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex === -1) {
      return response.status(404).json({ error: "Repository not found" });
    }
  
    repositories.splice(repositoryIndex, 1);
  
    return response.status(204).json();

  } catch(e) {
    return response.status(400).json({ error: 'Error!' });
  }
});

app.post("/repositories/:id/like", (request, response) => {

  const { id } = request.params;

  try {
  
    const repositoryIndex = repositories.findIndex(repository => repository.id === id);

    if (repositoryIndex === -1) {
      return response.status(404).json({ error: "Repository not found" });
    }
  
    repositories[repositoryIndex].likes += 1
  
    return response.json(repositories[repositoryIndex]);

  } catch(e) {
    return response.status(400).json({ error: 'Error!' });
  }
});



app.listen(process.env.PORT || 3001);

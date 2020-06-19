const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

const baseUrl = "/api/persons";

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    id: 3,
    number: "12-43-234345",
  },
  {
    name: "ride along king",
    number: "12312321",
    id: 4,
  },
  {
    name: "gordita crunch",
    number: "514 485 5554",
    id: 5,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Hello World!1</h1>");
});

app.get(`${baseUrl}`, (req, res) => {
  console.log("Give me the head ", req.headers);
  res.json(persons);
});

app.get(`${baseUrl}/:id`, (req, res) => {
  const id = Number(req.params.id);
  console.log("appel", req.params);

  console.log("id", id);

  const person = persons.find((person) => {
    return person.id === id;
  });
  console.log("dam da di doo", person);

  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete(`${baseUrl}/:id`, (req, res) => {
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  res.status(204).end();
});

const GenerateID = () => {
  const maxID =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  console.log("max id", Number(maxID));

  return maxID + 1;
};

app.post(`${baseUrl}`, (req, res) => {
  const body = req.body;
  console.log("in the post req", body);

  if (!body) {
    return res.status(400).json({
      error: "content missing",
    });
  }

  const person = {
    id: GenerateID(),
    name: body.name,
    number: body.number,
  };

  console.log("a person", person);
  persons = persons.concat(person);
  res.json(person);
});

// to do put req

const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

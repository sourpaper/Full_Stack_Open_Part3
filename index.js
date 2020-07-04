require('dotenv').config()

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require('mongoose')
const Person = require('./models/person')

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


app.get('/api/persons', (req, res)=>{
  Person.find({}).then(thePeople=>{
    res.json(thePeople)
  })
})

app.get(`${baseUrl}/:id`, (req, res) => {
  Person.findById(req.params.id).then(aPerson=>{
    res.json(aPerson)
  })
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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then(savedPerson=>{
    res.json(savedPerson);
  })

});

const port = process.env.PORT 
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const Person = require("./models/person");
const { response } = require("express");
var morgan = require("morgan");
const { update } = require("./models/person");

app.use(express.static("build"));
app.use(cors());
app.use(express.json());

const baseUrl = "/api/persons";

morgan.token("body", (req, res) => {
  return JSON.stringify(req.body);
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

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
  res.send("<h1>Hello World!</h1>");
});

app.get("/info", (req, res) => {
  Person.countDocuments({}, function (error, count) {
    if (error) {
      return errorHandler(error);
    }

    res.send(
      "<p>The phonebook contains  " +
        count +
        " personal information.</p> <p>" +
        new Date() +
        "</p>"
    );
  });
});

app.get(`${baseUrl}`, (req, res) => {
  Person.find({}).then((thePeople) => {
    res.json(thePeople);
  });
});

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

  person
    .save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedNote) => res.json(savedAndFormattedNote))
    .catch((error) => next(error));
});

app.get(`${baseUrl}/:id`, (request, response) => {
  Person.findById(request.params.id)
    .then((aPerson) => {
      if (aPerson) {
        response.json(aPerson);
      } else {
        console.log("chicken butt");
        response
          .status(404)
          .send({ error: "valid object id but not in db" })
          .end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.delete(`${baseUrl}/:id`, (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

const GenerateID = () => {
  const maxID =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  console.log("max id", Number(maxID));

  return maxID + 1;
};

app.put(`${baseUrl}/:id`, (req, res, next) => {
  const body = req.body;
  console.log("hello entered");
  if (!body.name) {
    return res.status(400).json({ error: "Name is missing." });
  }

  const aPerson = {
    name: body.name,
    number: body.number,
  };

  Person.findByIdAndUpdate(req.params.id, aPerson, { new: true })
    .then((updatedPerson) => {
      res.json(updatedPerson);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error("Error Handler ", error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

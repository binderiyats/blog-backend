const { request, response } = require("express");
const express = require("express");

const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const port = 8000;
let categories = [
  { id: 1, name: "Технологи", description: "Технологи" },
  { id: 2, name: "Цаг үе", description: "Цаг үе" },
  { id: 3, name: "Түүх", description: "Түүх" },
  { id: 4, name: "Соёл", description: "Соёл" },
  { id: 5, name: "Спорт", description: "Спорт" },
];

let nextCatId = categories.length;

const articles = [
  {
    id: 1,
    categoryId: 1,
    imageUrl:
      "https://ichef.bbci.co.uk/news/976/cpsprodpb/F351/production/_128398226_2aa649c9-3983-4c82-a0f5-efe5d9c99eb3.jpg.webp",
    name: "Signs used by apes understood by humans",
    description:
      "Humans understand the 'signs' or gestures wild chimps and bonobos use to communicate with one another",
    text: `That is the conclusion of a video-based study in which volunteers translated ape gestures. It was carried out by researchers at St Andrews University.

    It suggests that the last common ancestor we shared with chimps used similar gestures, and that these were a "starting point" for our language.
    
    The findings are published in the scientific journal PLOS Biology.
    
    Lead researcher, Dr Kirsty Graham from St Andrews University explained: "We know that all the great apes - chimps and bonobos - have an overlap of about 95% of the gestures they use to communicate.
    
    "So we already had a suspicion that this was a shared gesturing ability that might have been present in our last shared ancestor. But we're quite confident now that our ancestors would have started off gesturing, and that this was co-opted into language."
    
    This study was part of an ongoing scientific mission to understand this language origin story by carefully studying communication in our closest ape cousins.
    
    `,
  },
  {
    id: 2,
    categoryId: 5,
    imageUrl:
      "https://ichef.bbci.co.uk/onesport/cps/976/cpsprodpb/7184/production/_128406092_gettyimages-1246514605.jpg",
    name: "Australian Open 2023 results: Magda Linette to face Aryna Sabalenka in semi-finals",
    description:
      "Magda Linette will meet fifth seed Aryna Sabalenka in the Australian Open semi-finals after she beat Karolina Pliskova to continue her dream run.",
    text: `That is the conclusion of a video-based study in which volunteers translated ape gestures. It was carried out by researchers at St Andrews University.

    It suggests that the last common ancestor we shared with chimps used similar gestures, and that these were a "starting point" for our language.
    
    The findings are published in the scientific journal PLOS Biology.
    
    Lead researcher, Dr Kirsty Graham from St Andrews University explained: "We know that all the great apes - chimps and bonobos - have an overlap of about 95% of the gestures they use to communicate.
    
    "So we already had a suspicion that this was a shared gesturing ability that might have been present in our last shared ancestor. But we're quite confident now that our ancestors would have started off gesturing, and that this was co-opted into language."
    
    This study was part of an ongoing scientific mission to understand this language origin story by carefully studying communication in our closest ape cousins.
    
    `,
  },
];

app.use(cors());

app.get("/", (request, response) => {
  response.status(200);
  response.json("Hello");
});

app.get("/a", (request, response) => {
  response.status(200);
  response.json("dineg");
});

app.get("/categories", (request, response) => {
  response.status(200);
  response.json(categories);
});

app.get("/articles", (request, response) => {
  response.status(200);
  response.json(articles);
});

app.get("/articles/:id", (request, response) => {
  const { id } = request.params;
  response.json(articles[Number(id) - 1]);
});

app.get("/categories/:id", (request, response) => {
  const { id } = request.params;
  const filtered = articles.filter((article) => {
    if (article.categoryId === Number(id)) {
      return article;
    }
  });
  response.json(filtered);
});

app.get("/categoriesArticle/:id", (request, response) => {
  const { id } = request.params;
  let category = null;
  for (const row of categories) {
    if (id == row.id) {
      category = row;
      break;
    }
  }

  response.json(category);
});

app.delete("/categoriesArticle/:id", (request, response) => {
  const { id } = request.params;
  categories = categories.filter((row) => row.id !== Number(id));
  response.json(id);
});

app.post("/categoriesArticle", jsonParser, (request, response) => {
  const { name } = request.body;
  const { description } = request.body;
  const newCategory = { id: nextCatId++, name, description };
  categories.push(newCategory);
  response.send(newCategory);
});

app.patch("/categoriesArticle/:id", jsonParser, (request, response) => {
  let { id } = request.params;
  id = Number(id);
  const { name, description } = request.body;
  categories = categories.map((category) => {
    if (category.id === id) {
      return { id, name, description };
    }

    return category;
  });

  response.json({ id, name, description });
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});

const { request, response } = require("express");
const express = require("express");

const app = express();
const cors = require("cors");

const port = 8000;
const categories = [
  { id: 1, name: "Технологи" },
  { id: 2, name: "Цаг үе" },
  { id: 3, name: "Түүх" },
  { id: 4, name: "Соёл" },
  { id: 5, name: "Спорт" },
];

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

app.listen(port, () => {
  console.log("http://localhost:" + port);
});

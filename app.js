const express = require("express");

const app = express();
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const port = 8000;
let categories = JSON.parse(fs.readFileSync("categoryData.json", "utf-8"));

const updateCategoriesFile = () => {
  fs.writeFileSync("categoryData.json", JSON.stringify(categories));
};

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

app.get("/categories", (request, response) => {
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
  updateCategoriesFile();
  response.json(id);
});

app.post("/categoriesArticle", jsonParser, (request, response) => {
  const { name } = request.body;
  const { description } = request.body;
  const newCategory = { id: nextCatId++, name, description };
  updateCategoriesFile();
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
  updateCategoriesFile();
  response.json({ id, name, description });
});

// app.get("/generateNumbers", (req, res) => {
//   let request = "";
//   for (let i = 0; i < 1000; i++) {
//     let n = "";
//     if (i < 1000) {
//       n += "0";
//     }
//     if (i < 100) {
//       n += "0";
//     }
//     if (i < 10) {
//       n += "0";
//     }
//     n += i;
//     result += `9911${n}\n`;
//   }
//   fs.writeFileSync("phones.txt", result);
//   res.json("Done");
// });

let products = JSON.parse(fs.readFileSync("productsData.json", "utf-8"));
app.get("/products", (req, res) => {
  let { pageSize, page, priceTo, priceFrom, q } = req.query;
  pageSize = Number(pageSize) || 10;
  page = Number(page) || 1;
  priceTo = Number(priceTo);
  priceFrom = Number(priceFrom);

  let items = [...products];

  if (q) {
    items = items.filter((item) => {
      if (item.name.toLowerCase().includes(q.toLowerCase())) {
        return item;
      }
    });
  }
  if (priceTo && priceFrom) {
    items = items.filter((item) => {
      if (item.price >= priceFrom && item.price <= priceTo) {
        return item;
      }
    });
  }

  let start, end;
  start = (page - 1) * pageSize;
  end = page * pageSize;

  const total = items.length;
  const totalPages = Math.ceil(items.length / pageSize);

  items = items.slice(start, end);

  const result = {
    total,
    totalPages,
    page,
    pageSize,
    items: items,
  };
  res.json(result);
});

app.listen(port, () => {
  console.log("http://localhost:" + port);
});

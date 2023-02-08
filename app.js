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
// CATEGORIES
// Get all categories
app.get("/categories", (request, response) => {
  response.json(categories);
});

// Get single category by id
app.get("/categories/:id", (request, response) => {
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

// Delete single category by id
app.delete("/categories/:id", (request, response) => {
  const { id } = request.params;
  categories = categories.filter((row) => row.id !== Number(id));
  updateCategoriesFile();
  response.json(id);
});

// Create new category
app.post("/categories", jsonParser, (request, response) => {
  const { name } = request.body;
  const { description } = request.body;
  const newCategory = { id: nextCatId++, name, description };
  updateCategoriesFile();
  categories.push(newCategory);
  response.send(newCategory);
});

// Update single category by id
app.patch("/categories/:id", jsonParser, (request, response) => {
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

// ARTICLES

// Get all articles
app.get("/articles", (request, response) => {
  response.status(200);
  response.json(articles);
});

// Get single article by id
app.get("/articles/:id", (request, response) => {
  const { id } = request.params;
  response.json(articles[Number(id) - 1]);
});

// Get filtered articles by category id
app.get("/articles/category/:id", (request, response) => {
  const { id } = request.params;
  const filtered = articles.filter((article) => {
    if (article.categoryId === Number(id)) {
      return article;
    }
  });
  response.json(filtered);
});

//PRODUCTS!!!
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

//MenuPositions

let menuPositions = JSON.parse(fs.readFileSync("menuPositions.json", "utf-8"));
app.get(`/menu-positions`, (req, res) => {
  res.json(menuPositions);
});
app.get(`/menu-positions/:id`, (req, res) => {
  const { id } = req.params;
  let position = null;

  for (const row of menuPositions) {
    if (id == row.id) {
      position = row;
      break;
    }
  }
  res.json(position);
});

let nextPostId = menuPositions.length + 1;

app.post(`/menu-positions`, jsonParser, (req, res) => {
  const { name, alias } = req.body;
  const newPosition = { id: nextPostId++, name, alias };
  menuPositions.push(newPosition);
  fs.writeFileSync("menuPositions.json", JSON.stringify(menuPositions));
  res.json(newPosition);
});
app.delete(`/menu-positions/:id`, (req, res) => {
  const { id } = req.params;

  menuPositions = menuPositions.filter((row) => row.id !== Number(id));
  fs.writeFileSync("menuPositions.json", JSON.stringify(menuPositions));
  res.json(id);
});

let menus = JSON.parse(fs.readFileSync("menus.json", "utf-8"));
let nextMenuId = menus.length + 1;

app.get("/menus", (req, res) => {
  const { positionId } = req.query;
  if (!positionId) return res.statusCode(400).json("PositionId required!");

  const result = menus.filter((menu) => {
    return menu.positionId === Number(positionId);
  });
  console.log(result);
  return res.json(result);
});

app.get("/menus/:positionAlias", (req, res) => {
  const { positionAlias } = req.params;
  let position = null;

  for (const row of menuPositions) {
    if (positionAlias == row.alias) {
      position = row;
      break;
    }
  }

  if (!position) return res.status(400).json("Position not found");

  const result = menus.filter((menu) => {
    return menu.positionId === position.id;
  });
  return res.json(result);
});

app.post("/menus", jsonParser, (req, res) => {
  const { name, link, newTab, positionId, ordering } = req.body;
  const newMenu = { id: nextMenuId, name, link, newTab, positionId, ordering };
  menus = [...menus, newMenu];
  fs.writeFileSync("menus.json", JSON.stringify(menus));
  return res.json(newMenu);
});

app.delete("/menus/:id", (req, res) => {
  const { id } = req.params;
  menus = menus.filter((row) => row.id !== Number(id));
  fs.writeFileSync("menus.json", JSON.stringify(menus));
  res.json(id);
});

//APP.LISTEN!!!
app.listen(port, () => {
  console.log("http://localhost:" + port);
});

const express = require("express");

const app = express();
const cors = require("cors");
const fs = require("fs");
const bodyParser = require("body-parser");
const { request } = require("http");
const { response } = require("express");
const jsonParser = bodyParser.json();
const port = 8000;
app.use(cors());
let categories = JSON.parse(fs.readFileSync("categoryData.json", "utf-8"));
let articles = JSON.parse(fs.readFileSync("articleData.json", "utf-8"));

const updateCategoriesFile = () => {
  fs.writeFileSync("categoryData.json", JSON.stringify(categories));
};

const updateArticlesFile = () => {
  fs.writeFileSync("articleData.json", JSON.stringify(articles));
};

let nextCatId = categories.length + 1;
let nextArtId = articles.length + 1;

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
  categories.push(newCategory);
  updateCategoriesFile();
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

// !!!ARTICLES!!!

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

//Create a new article
app.post("/articles", jsonParser, (request, response) => {
  const { name } = request.body;
  const { description } = request.body;
  const { imageUrl } = request.body;
  const newArticle = { id: nextArtId++, name, description, imageUrl };
  articles.push(newArticle);
  updateArticlesFile();
  response.send(newArticle);
});

//Update single article by its id
app.patch("articles/:id", jsonParser, (request, response) => {
  let { id } = request.params;
  id = Number(id);
  const { name, description, imageUrl } = request.body;
  articles = articles.map((article) => {
    if (article.id === id) {
      return { id, name, description, imageUrl };
    }
  });
});
//Delete an article by id

app.delete("/articles/:id", (request, response) => {
  const { id } = request.params;
  articles = articles.filter((row) => row.id !== Number(id));
  updateArticlesFile();
  response.json(id);
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

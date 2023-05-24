"use strict";

const express = require("express");

const router = express.Router();
const middlewares = require("../middleware/middlewares");
const tableauController = require("../controllers/tableauController");


// POST => /tableaux
router.post("/tableaux",middlewares.verifierConnexion, tableauController.createTableau);

// GET => /tableaux 
router.get("/tableaux", middlewares.verifierConnexion, tableauController.getTableaux);

// GET => /tableaux/:tableauId

router.get("/tableaux/:tableauId", middlewares.verifierConnexion, tableauController.getTableau);
// PUT => /tableaux/:tableauId
router.put("/tableaux/:tableauId", middlewares.verifierConnexion, tableauController.updateTableau);

// DELETE => /tableaux/:tableauId
router.delete("/tableaux/:tableauId", middlewares.verifierConnexion, tableauController.deleteTableau);

module.exports = router;


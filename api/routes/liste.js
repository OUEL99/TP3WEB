"use strict";

const express = require("express");

const router = express.Router();
const middlewares = require("../middleware/middlewares")
const listeController = require("../controllers/listeController");


// GET /tableaux/:tableauId/liste
router.get("/tableaux/:tableauId/listes", middlewares.verifierConnexion, listeController.getListes);

// POST /tableaux/:tableauId/liste
router.post("/tableaux/:tableauId/listes", middlewares.verifierConnexion, listeController.createListe);

// GET /tableaux/:tableauId/liste/listeId
router.get("/tableaux/:tableauId/listes/:listeId",middlewares.verifierConnexion, listeController.getListe);

// PUT /tableaux/:tableauId/liste/:listeId
router.put("/tableaux/:tableauId/listes/:listeId",middlewares.verifierConnexion, listeController.updateListe);

// DELETE /tableaux/:tableauId/liste/:listeId
router.delete("/tableaux/:tableauId/listes/:listeId",middlewares.verifierConnexion, listeController.deleteListe);

module.exports = router;


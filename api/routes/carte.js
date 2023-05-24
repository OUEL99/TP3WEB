const express = require("express");
const router = express.Router();
const carteController = require("../controllers/carteController");
const middlewares = require("../middleware/middlewares");

// POST => /tableaux/:tableauId/listes/:listeId/cartes
router.post("/tableaux/:tableauId/listes/:listeId/cartes", middlewares.verifierConnexion, carteController.createCarte);

// GET => /tableaux/:tableauId/listes/:listeId/cartes
router.get("/tableaux/:tableauId/listes/:listeId/cartes", middlewares.verifierConnexion, carteController.getCartes);

// GET => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.get("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", middlewares.verifierConnexion, middlewares.verifierProprioCarte, carteController.getCarte);

// PUT => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.put("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", middlewares.verifierConnexion, carteController.updateCarte);

// DELETE => /tableaux/:tableauId/listes/:listeId/cartes/:carteId
router.delete("/tableaux/:tableauId/listes/:listeId/cartes/:carteId", middlewares.verifierConnexion, carteController.deleteCarte);

module.exports = router;

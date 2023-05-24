"use strict";

const express = require("express");

const router = express.Router();
const middlewares = require("../middleware/middlewares");
const utilisateurController = require("../controllers/utilisateurController");


// POST => /utilisateurs
router.post("/utilisateurs" ,utilisateurController.createUtilisateur);


// GET => /utilisateurs/:utilisateurId
router.get("/utilisateurs/:utilisateurId", utilisateurController.getUtilisateur);

router.get("/validerEmail", utilisateurController.validateEmail);

module.exports = router;


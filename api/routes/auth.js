"use strict";

const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

// POST => /connexion
router.post("/connexion", authController.connexion);

module.exports = router;

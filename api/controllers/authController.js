"use strict";


const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
const url_base = process.env.URL + ":" + process.env.PORT;

const Utilisateur = require("../models/utilisateur");
/**
 * Permet la connexion d'un utilisateur
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @param {String} req.body.courriel - Courriel de l'utilisateur
 * @param {String} req.body.motDePasse - Mot de passe de l'utilisateur
 */
exports.connexion = (req, res, next) => {
    const courriel = req.body.courriel;
    const motDePasse = req.body.motDePasse;
    Utilisateur.findOne({ courriel: courriel })
    .then(utilisateur => {
        if (!utilisateur) {
            const error = new Error("Utilisateur non trouvé");
            error.statusCode = 404;
            throw error;
        }
        if (utilisateur.motDePasse !== motDePasse) {
            const error = new Error("Mot de passe incorrect");
            error.statusCode = 401;
            throw error;
        }
        req.utilisateurId = utilisateur._id;
        const token = jwt.sign({utilisateurId: utilisateur._id}, process.env.SECRET_JWT, {expiresIn: "24h"})
        res.status(200).json({utilisateur: utilisateur, jwt: token});
    })
    .catch(error => {
        next(error);
    });
};


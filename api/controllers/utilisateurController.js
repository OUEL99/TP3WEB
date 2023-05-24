"use strict";

const Utilisateur = require("../models/utilisateur");
const dotenv = require("dotenv");
dotenv.config();

const url_base = process.env.URL + ":" + process.env.PORT;

/**
 * Permet de créer un utilisateur
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @body {String} req.body.nom - Nom de l'utilisateur
 * @body {String} req.body.courriel - Courriel de l'utilisateur
 * @body {String} req.body.motDePasse - Mot de passe de l'utilisateur 
 */
exports.createUtilisateur = async(req, res, next) => {
    const nom = req.body.nom;
    const courriel = req.body.courriel;
    const motDePasse = req.body.motDePasse;
    const utilisateur = new Utilisateur({
        nom: nom,
        courriel: courriel,
        motDePasse: motDePasse
    });
    utilisateur
        .save()
        .then(result => {
            res.status(201).json({
                message: "Utilisateur créé"});
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet de récupérer tous les utilisateurs
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {Utilisateur[]} - Tableau d'utilisateurs
 */
exports.getUtilisateurs = (req, res, next) => {
    Utilisateur.find()
        .then(utilisateurs => {
            res.status(200).json(utilisateurs);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet de récupérer un utilisateur
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @param {String} req.params.id - Id de l'utilisateur
 * @returns {Utilisateur} - Utilisateur
 */
exports.getUtilisateur = async (req, res, next) => {
    const utilisateurId = req.params.id;
    
    Utilisateur.findById(utilisateurId)
        .then(utilisateur => {
            if (!utilisateur) {
                const error = new Error("Utilisateur non trouvé");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(utilisateur);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });  
};

/**
 * Permet de valider si un courriel est déjà utilisé
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @query {String} req.query.courriel - Courriel de l'utilisateur 
 */
exports.validateEmail = async (req, res, next) => {
    const { courriel } = req.query;
    Utilisateur.findOne({ courriel: courriel })
        .then(utilisateur => {
            if (utilisateur) {
                res.status(200).json({exists: true, message: "Courriel déjà utilisé" });
            } else {
                res.status(200).json({ exists:false, message: "Courriel disponible" });
            }
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};








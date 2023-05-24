"use strict";

const Utilisateur = require("../models/utilisateur");
const dotenv = require("dotenv");
dotenv.config();

const url_base = process.env.URL + ":" + process.env.PORT;

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








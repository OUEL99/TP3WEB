"use strict";

const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");
const dotenv = require("dotenv");
dotenv.config();

const url_base = process.env.URL + ":" + process.env.PORT;

/**
 * Permet la création d'une carte
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.listeId - Id de la liste
 * @body {String} req.body.titre - Titre de la carte
 * @body {String} req.body.description - Description de la carte
 * @returns {Object} - Objet contenant les informations de la carte créée
 */
exports.createCarte = (req, res, next) => {
    const titre = req.body.titre;
    const description = req.body.description;
    const listeId = req.params.listeId;
    const carte = new Carte({
        titre: titre,
        description: description,
        liste: listeId,
        date: Date.now()
    });
    carte
        .save()
        .then(result => {
            res.setHeader("Location", url_base + "/cartes/" + carte._id);
            res.status(201).json(result);
            console.log('carte créée')
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });			
};

/**
 * Permet d'obtenir toutes les cartes d'une liste précise
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.listeId - Id de la liste
 * @returns {Array} - Tableau contenant toutes les cartes de la liste
 */
exports.getCartes = (req, res, next) => {
    const listId = req.params.listeId;
	Carte.find({liste: listId})
        .then(cartes => {
            res.status(200).json(cartes);
        })
        .catch(error => {   
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });  
};

/**
 * Permet d'obtenir une carte précise
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @param {String} req.params.id - Id de la carte
 * @returns {Object} - Objet contenant les informations de la carte 
 */
exports.getCarte = (req, res, next) => {
	const carteId = req.params.id;
    Carte.findById(carteId)
        .then(carte => {
            if (!carte) {
                const error = new Error("Carte non trouvée");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(carte);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet de modifier une carte
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.carteId - Id de la carte
 * @body {String} req.body.titre - Titre de la carte
 * @body {String} req.body.description - Description de la carte
 * @body {String} req.params.listeId - Id de la liste
 * @body {Date} req.body.date - Date de la carte
 */
exports.updateCarte = (req, res, next) => {
    const carteId = req.params.carteId;
    const titre = req.body.titre;
    const description = req.body.description;
    const listeId = req.params.listeId;
    const date = req.body.date;

    Carte.findById(carteId)
        .then(carte => {
            if (!carte) {
                const error = new Error("Carte non trouvée");
                error.statusCode = 404;
                throw error;
            }
            carte.titre = titre;
            carte.description = description;
            carte.liste = listeId;
            carte.date = date;
            return carte.save();
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            next(error);
        });
};

/**
 * Permet la suppression d'une carte
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.carteId - Id de la carte
 * @returns {Object} - Objet contenant les informations de la carte supprimée
 */
exports.deleteCarte = (req, res, next) => {
	const carteId = req.params.carteId;
    Carte.findByIdAndRemove(carteId)
        .then(result => {
            res.status(204).json({ message: "Carte supprimée" });
        })
        .catch(error => {
            next(error);
        });
};









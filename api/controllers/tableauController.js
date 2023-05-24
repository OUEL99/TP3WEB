"use strict";

const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");
const Utilisateur = require("../models/utilisateur");
const dotenv = require("dotenv");

dotenv.config();

const url_base = process.env.URL + ":" + process.env.PORT;

/**
 * Permet la création d'un tableau
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @body {String} req.body.titre - Titre du tableau
 * @body {String} req.body.proprietaire - Id du propriétaire du tableau
 * @body {Array} req.body.listes - Tableau contenant les listes du tableau
 * @returns {Object} - Objet contenant les informations du tableau créé
 */
exports.createTableau = (req, res, next) => {
    console.log(req.body.proprietaire)
    const titre = req.body.titre;
    const proprioId = req.body.proprietaire;
    const listes = req.body.listes;
    
    const tableau = new Tableau({
        titre: titre,
        proprietaire: proprioId,
        listes: listes,
    });
    tableau
        .save()
        .then(result => {
            res.setHeader("Location", url_base + "/tableaux/" + tableau.id);
            res.status(201).json(result);
            console.log('tableau créé')
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet d'obtenir la liste des tableaux
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns {Array} - Tableau contenant les tableaux
 */
exports.getTableaux = (req, res, next) => {

    Tableau.find()
        .then(tableaux => {
            res.status(200).json(tableaux);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet d'obtenir un tableau précis
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.tableauId - Id du tableau
 * @returns {Object} - Objet contenant les informations du tableau
 */
exports.getTableau = (req, res, next) => {
    const tableauId = req.params.tableauId;
    Tableau.findById(tableauId)
        .populate({
            path: 'listes',
            populate: {
                path: 'cartes',
            }
        })
        .then(tableau => {
            if (!tableau) {
                const error = new Error("Tableau non trouvé");
                error.statusCode = 404;
                throw error;
            }
            console.log('tableau trouvé')
            res.status(200).json(tableau);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet de modifier un tableau
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.tableauId - Id du tableau
 * @body {String} req.body.titre - Titre du tableau
 * @returns {Object} - Objet contenant les informations du tableau modifié
 */
exports.updateTableau = (req, res, next) => {
	const tableauId = req.params.tableauId;
    const titre = req.body.titre;
    Tableau.findById(tableauId)
        .then(tableau => {
            if (!tableau) {
                const error = new Error("Tableau non trouvé");
                error.statusCode = 404;
                throw error;
            }
            tableau.titre = titre;
            tableau.proprietaire = tableau.proprietaire;
            tableau.listes = tableau.listes;
            return tableau.save();
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

/**
 * Permet de supprimer un tableau
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.tableauId - Id du tableau
 * @returns {Object} - Objet contenant les informations du tableau supprimé
 */
exports.deleteTableau = (req, res, next) => {
	const tableauId = req.params.tableauId;
    Tableau.findByIdAndRemove(tableauId)
        .then(result => {
            res.status(204).json({
                message: "Tableau supprimé"
            });
        })
        .catch(error => {
            next(error);
        });
};







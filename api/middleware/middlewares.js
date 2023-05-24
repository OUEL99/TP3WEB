const jwt = require("jsonwebtoken");
const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const Carte = require("../models/carte");

/**
 * Permet de vérifier si l'utilisateur est connecté
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
exports.verifierConnexion = (req, res, next) => {
    const token = req.headers.authorization.split(" ")[1];
    try{
        const decodedToken = jwt.verify(token, process.env.SECRET_JWT);
        req.utilisateurId = decodedToken.utilisateurId;
        next();
    } catch(error) {
            return res.status(401).json({
                message: "Vous n'êtes pas authentifié"
            });
    }
};

/**
 * Permet de vérifier si l'utilisateur est propriétaire du tableau
 * @param {*} req 
 * @param {*} res 
 * @param {*} next
 * @param {String} req.params.id - Id du tableau 
 */
exports.verifierProprioTableau = (req, res, next) =>{
    const tableauId = req.params.id;
    Tableau.findById(tableauId)
        .then(tableau => {
            if (!tableau) {
                const error = new Error("Tableau non trouvé");
                error.statusCode = 404;
                throw error;
            }
            if (tableau.proprietaire !== req.utilisateurId) {
                const error = new Error("Non autorisé");
                error.statusCode = 403;
                throw error;
            }
            Tableau.find({ proprietaire: req.utilisateurId })
                .then(tableaux => {
                    req.tableaux = tableaux;
                    next();
                })
                .catch(error => {
                    next(error);
                });
        })
        .catch(error => {
            next(error);
        });
};

/**
 * Permet de vérifier si l'utilisateur est propriétaire de la liste
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.id - Id de la liste
 */
exports.verifierProprioListe =(req,res, next) =>{
    const listeId = req.params.id;
    Liste.findById(listeId)
    .then(liste => {
        if (!liste) {
            const error = new Error("Liste non trouvée");
            error.statusCode = 404;
            throw error;
        }
        if (liste.tableau.proprietaire !== req.utilisateurId) {
            const error = new Error("Non autorisé");
            error.statusCode = 403;
            throw error;
        }
        next();
    })
    .catch(error => {
        next(error);
    });
}

/**
 * Permet de vérifier si l'utilisateur est propriétaire de la carte
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {String} req.params.id - Id de la carte
 */
exports.verifierProprioCarte = (req,res, next) =>{
    const carteId = req.params.id;
    Carte.findById(carteId)
    .then(carte => {
        if (!carte) {
            const error = new Error("Carte non trouvée");
            error.statusCode = 404;
            throw error;
        }
        if (carte.liste.Tableau.proprietaire !== req.utilisateurId) {
            const error = new Error("Non autorisé");
            error.statusCode = 403;
            throw error;
        }
        next();
    })
    .catch(error => {
        next(error);
    });
}
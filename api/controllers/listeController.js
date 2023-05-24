"use strict";

const Tableau = require("../models/tableau");
const Liste = require("../models/liste");
const dotenv = require("dotenv");
dotenv.config();

const url_base = process.env.URL + ":" + process.env.PORT;


exports.createListe = (req, res, next) => {
   

   const tableauId = req.params.tableauId;
    const liste = new Liste({
        titre: req.body.titre,
        cartes: [],
        tableau: tableauId,
    });
    liste
        .save()
        .then(result => {
            res.setHeader("Location", url_base + "/listes/" + liste._id);
            res.status(201).json(result);
            console.log('liste créée')
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getListes = (req, res, next) => {
    const tableauId = req.params.tableauId;
	Liste.find({tableau: tableauId})
        .populate('cartes')
        .then(listes => {
            res.status(200).json(listes);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.getListe = (req, res, next) => {
	const listeId = req.params.id;
    Liste.findById(listeId)
        .then(liste => {
            if (!liste) {
                const error = new Error("Liste non trouvée");
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json(liste);
        })
        .catch(error => {
            if (!error.statusCode) {
                error.statusCode = 500;
            }
            next(error);
        });
};

exports.updateListe = (req, res, next) => {
    const listeId = req.params.listeId;
    const titre = req.body.titre;
    const tableauId = req.params.tableauId;
    Liste.findById(listeId)
        .then(liste => {
            if (!liste) {
                const error = new Error("Liste non trouvée");
                error.statusCode = 404;
                throw error;
            }
            liste.titre = titre;
            liste.tableau = tableauId;
            return liste.save();
        })
        .then(result => {
            res.status(200).json(result);
        })
        .catch(error => {
            next(error);
        });
};

exports.deleteListe = (req, res, next) => {
    const listId = req.params.listeId;
    Liste.findByIdAndRemove(listId)
        .then(result => {
            res.status(204).json({ message: "Liste supprimée" });
        })
        .catch(error => {
            next(error);
        });
};









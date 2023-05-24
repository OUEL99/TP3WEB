"use strict";

const express = require("express");
const mongoose = require("mongoose");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const app = express();
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// parse application/json
app.use(express.json());  


app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"OPTIONS, GET, POST, PUT, PATCH, DELETE"
	);
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
	next();
});


// Importe les routes
const authRoutes = require("./routes/auth");
const utilisateurRoutes = require("./routes/utilisateur");
const tableauRoutes = require("./routes/tableau");
const listeRoutes = require("./routes/liste");
const carteRoutes = require("./routes/carte");

// Utilisation des routes en tant que middleware
app.use(authRoutes);
app.use(utilisateurRoutes);
app.use(tableauRoutes);
app.use(listeRoutes);
app.use(carteRoutes);

// Gestion des erreurs
// "Attrappe" les erreurs envoyé par "throw"
app.use(function (err, req, res, next) {
	
	console.log("err", err);
	if (!err.statusCode){
		err.statusCode = 500;
	} 

	res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode });
});	


const PORT = 3000;
mongoose
	.connect(process.env.DATA_BASE)
	.then(() => {
		app.listen(3000, () => {
			console.log("Node.js est à l'écoute sur http://localhost:%s ", PORT);
		});
	})
	.catch(err => console.log(err));


<script setup>
import tableau from "../components/TableauComponent.vue";
</script>
<template>
    <h1>Vos Tableaux</h1>
    <div class="row">
        <div v-if="tableaux">
            <div class="col-4 card" v-for="tableau in tableaux" :key="tableau.id">
                <div class="card-title" :to="{name: 'tableau', params:{id : tableau._id}}">
                    <RouterLink :to="{name: 'tableau', params:{id: tableau._id}}">{{ tableau.titre }}</RouterLink>
                    <tableau :tableau="tableau" @delete="deleteTableau(tableau._id)"/>
                </div>
            </div>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-body">
                    <div v-if="nouveau">
                        <input v-model="titreNouveau" type="text" class="form-control" placeholder="Nom du tableau">
                        <button @click="ajouterNouveau" class="btn btn-primary">Ajouter</button>
                        <button class="btn btn-secondary" @click="cacherFormNouveau">Annuler</button>
                    </div>
                    <button class="btn btn-primary" @click="afficherFormNouveau" v-if="!nouveau">Ajouter un tableau</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return{
                tableaux :[],
                nouveau: false,
                titreNouveau: ""
            }
        },
        methods:{
            // Récupère les tableaux de l'utilisateur
            recupererTableaux(){
                fetch('http://localhost:3000/tableaux',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(response => response.json())
                .then(data => {
                    for(let i = 0; i < data.length; i++){
                        if(data[i].proprietaire == localStorage.getItem('userId')){
                            this.tableaux.push(data[i]);
                        }
                    }
                })
                .catch(error => console.log(error)
                );
            },
            // Affiche le formulaire d'ajout d'un nouveau tableau
            afficherFormNouveau(){
                console.log("Valeur actuelle de nouveau avant la modification :", this.nouveau);
                this.nouveau = true;
                console.log("Valeur actuelle de nouveau après la modification :", this.nouveau);
            },
            // Cache le formulaire d'ajout d'un nouveau tableau
            cacherFormNouveau(){
                this.nouveau = false;
            },
            // Ajoute un nouveau tableau
            ajouterNouveau(){
                const proprietaire = localStorage.getItem('userId');
                if (!proprietaire) {
                    console.error('ID du propriétaire non trouvé.');
                    return;
                }
                else{
                    console.log("ID du propriétaire :", proprietaire);
                }
                fetch('http://localhost:3000/tableaux', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    },
                    body: JSON.stringify({
                        titre: this.titreNouveau,
                        proprietaire: proprietaire,
                        listes: [],
                    })
                })
                .then(response => {
                    if(response.ok){
                        this.recupererTableaux();
                        this.cacherFormNouveau();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .catch(error => console.log(error)
                );
            },
            // Supprime un tableau
            deleteTableau(id){

                this.tableaux = this.tableaux.filter(tableau => tableau._id !== id);
                fetch('http://localhost:3000/tableaux/' + id,{
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(response =>{
                    if(response.ok){
                        console.log("Tableau supprimé");
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
            }

        },
        created(){
            console.log(localStorage.getItem('token'));
            this.recupererTableaux();
        },

    }
</script>
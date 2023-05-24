import liste from "@/components/ListeComponent.vue";
import tableau from "@/components/TableauComponent.vue";
<template>
    
    <a @click="afficherModif" v-if="!modifTableau" class="h1">{{ tableau.titre }}</a>
    <div v-if="modifTableau">
        <input v-model="titreModif" type="text" class="form-control" placeholder="Nom du tableau">
        <button @click="modifierTableau" class="btn btn-primary">Modifier</button>
        <button @click="retirerModif" class="btn btn-danger">Annuler</button>
    </div>
    

    <div class="row">
        <div class="col-4 " v-for="liste in listes" :key="liste.id">
            <liste :liste="liste" @delete="deleteList(liste._id)"/>
        </div>
        <div class="col-4">
            <div class="card">
                <div class="card-body">
                    <div>
                        <input v-model="titreNouveau" type="text" class="form-control" placeholder="Nom de la liste">
                        <button @click="ajouterNouveau" class="btn btn-primary">Ajouter</button>
                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import listeComponent from "@/components/ListeComponent.vue";
    export default{
        components:{
            liste: listeComponent,
        },
        data(){
            return{
                tableau: Object,
                listes: [],
                //nouveau: false,
                titreNouveau: "",
                modifTableau: false,
                titreModif: "",
            }
        },
        methods:{
            // Récupère les tableaux de l'utilisateur
            recupererTableau(){
                fetch('http://localhost:3000/tableaux/' + this.$route.params.id,{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    if(response.ok){
                        console.log("api ok")
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .then(data => {
                    this.tableau = data;
                })
                .catch(error => console.log(error)
                );
            },
            // Récupère les listes du tableau
            recupererListes(){;
                const tableauId = this.$route.params.id;
                fetch('http://localhost:3000/tableaux/' + tableauId +'/listes',{
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .then(data => {
                    if(data.length > 0){
                        this.listes = data;
                    }
                })
                .catch(error => console.log(error)
                );
            },
            //Affiche le formulaire pour ajouter une liste
            afficherFormNouveau(){
                this.nouveau = true;
            },
            //Cache le formulaire pour ajouter une liste
            cacherFormNouveau(){
                this.nouveau = false;
            },
            //Ajoute une liste au tableau
            ajouterNouveau(){
                const tableauId = this.$route.params.id;
                console.log(this.titreNouveau);
                fetch('http://localhost:3000/tableaux/' + tableauId +'/listes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        titre: this.titreNouveau
                    })
                })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .then(data => {
                    this.listes.push(data);
                    this.titreNouveau = "";
                })
                .catch(error => console.log(error)
                );
            },
            //Affiche le formulaire pour modifier le tableau
            afficherModif(){
                this.modifTableau = true;
            },
            //Cache le formulaire pour modifier le tableau
            retirerModif(){
                this.modifTableau = false;
            },
            //Modifie le tableau
            modifierTableau(){
                //api modif tableau
                const tableauId = this.$route.params.id;
                fetch('http://localhost:3000/tableaux/' + tableauId,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        titre: this.titreModif
                    })
                })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .then(data => {
                    this.tableau = data;
                    this.titreModif = "";
                    this.modifTableau = false;
                })
            },
            //Supprime une liste
            deleteList(id){
                this.listes = this.listes.filter(liste => liste._id !== id);
                fetch('http://localhost:3000/tableaux/' + this.$route.params.id + '/listes/' + id,{
                    method: 'DELETE',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                })
                .then(response =>{
                    if(response.ok){
                        console.log("liste supprimé");
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
            }


        },
        created(){
            this.recupererTableau();
            this.recupererListes();
        },
    }
</script>
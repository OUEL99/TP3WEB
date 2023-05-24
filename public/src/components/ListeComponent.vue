import carte from './CarteComponent.vue';
<template>
    <div class="drop-zone" 
    @drop="onDrop($event, liste.id)" 
    @click="AfficherModifListe"
    @dragenter.prevent
    @dragover.prevent>
        <div v-if="!modif" class="card-title">{{ liste.titre }}</div>
        <button class="btn btn-primary modifbtn" @click="afficherModifListe" v-if="!modif">Modifier titre</button>
        <input v-if="modif" type="text" @keyup.enter="modifierListe" @focusout="RetirerModifListe" v-model="nomModif" placeholder="{{ liste.titre }}"/>
        <button v-if="modif" class="btn btn-primary" @click="modifierListe">modif</button>
        <button v-if="modif" class="btn btn-danger" @click="retirerModifListe">annuler modif</button>
        <div class="card-body">
            <div v-for="carte in cartes" class="drag-el" :carte="carte" :key="carte.id" draggable="true" @dragstart="startDrag($event, carte)" @delete="handleCarteDeleted">
                <carte :carte="carte"/>
            </div>
            <div>
                <button class="btn btn-primary" @click="afficherFormNouveau" v-if="!nouveau">Ajouter une carte</button>
                <div v-if="nouveau">
                    <input v-model="titreNouveau" type="text" class="form-control" placeholder="Nom de la carte">
                    <input v-model="descrNouveau" type="text" class="form-control" placeholder="description">
                    <button @click="ajouterNouveau" class="btn btn-primary">Ajouter</button>
                    <button class="btn btn-secondary" @click="cacherFormNouveau">Annuler</button>
                    
                </div>
            </div>
            <button class="btn btn-danger" @click="$emit('delete', id)">Supprimer la liste</button>
        </div>
    </div>

</template>

<script>
import carteComponent from './CarteComponent.vue';
    export default {
        name: "ListeComponent",
        components: {
            carte: carteComponent
        },
        props: {
            liste: {
                type: Object,
                required: true
            },
        },
        data() {
            return {
                nouveau: false,
                titreNouveau: "",
                descrNouveau: "",
                modif: false,
                cartes: [],
            }
        },
        $emit: {
            
            delete: function (id) {
                this.$emit('delete', id)
            }
        },
        methods:{
            //Élimine la carte supprimée de la vue
            handleCarteDeleted(id){
                this.cartes = this.cartes.filter(carte => carte.id !== id);
            },
            //Affiche le formulaire d'ajout de carte
            afficherFormNouveau(){
                this.nouveau = true;
            },
            //Cache le formulaire d'ajout de carte
            cacherFormNouveau(){
                this.nouveau = false;
            },
            //Ajoute une carte à la liste
            ajouterNouveau(){
                const tableauId = this.$route.params.id;
                const listeId = this.liste._id;
                fetch('http://localhost:3000/tableaux/' + tableauId + '/listes/' + listeId+'/cartes', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        titre: this.titreNouveau,
                        description: this.descrNouveau,
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
                    this.cartes.push(data);
                    this.cacherFormNouveau();
                })
                .catch(error => console.log(error)
                );
            },
            //Supprime la liste
            supprimerListe(){
                const {tableauId} = this.$route.params.tableauId;
                const {listeId} = this.liste.id;
                fetch('http://localhost:3000/api/tableaux/${tableauId}/listes/${listeId}', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        tableauId: this.tableau.id,
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
                    this.listes.remove(data);
                    this.cacherFormNouveau();
                })
                .catch(error => console.log(error)
                );
            },
            //Affiche le formulaire de modification de liste
            afficherModifListe(){
                this.modif = true;
            },
            //Cache le formulaire de modification de liste
            retirerModifListe(){
                this.modif = false;
            },
            //Modifie la liste
            modifierListe(){
                //Api modifierListe
                const tableauId = this.$route.params.id;
                const listeId = this.liste._id;
                fetch('http://localhost:3000/tableaux/' + tableauId + '/listes/' +listeId, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        titre: this.nomModif,
                    })
                })
                .then(response => {
                    if(response.ok){
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                }).then(data => {
                    this.liste.titre = data.titre;
                    this.retirerModifListe();
                })
                
            },
            //Permet de déplacer une carte d'une liste à une autre
            startDrag(event, item){
                event.dataTransfer.dropEffect = "move";
                event.dataTransfer.effectAllowed = "move";
                event.dataTransfer.setData("itemId", item.id);
            },
            //Permet de déplacer une carte d'une liste à une autre
            onDrop(event, liste){
                //API update
                const itemId = event.dataTransfer.getData("itemId");
                const item = this.cartes.find(item => item.id === itemId);
                item.liste = liste.id;
                const tableauId = this.$route.params.id;
                const listeId = liste._id;
                fetch('http://localhost:3000/tableaux/' + tableauId + 'listes' +  listeId + '/cartes' + itemId,{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                    body: JSON.stringify({
                        titre : item.titre,
                        liste: liste.id,
                        description: item.description,
                        date : item.date,
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
                    item.liste = data.liste;
                })
                .catch(error => console.log(error)
                );
            },
            //Récupère les cartes de la liste
            recupererCartes(){
                const tableauId = this.$route.params.id;
                const listeId = this.liste._id;
                fetch('http://localhost:3000/tableaux/' + tableauId +'/listes/'+listeId+'/cartes', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                })
                .then(response => {
                    if(response.ok){
                        console.log('api ok')
                        return response.json();
                    }
                    else{
                        throw new Error("Une erreur est survenue");
                    }
                })
                .then(data => {
                    this.cartes = data;
                    console.log(data);
                })
                .catch(error => console.log(error)
                );
            },
            
        },
        created(){
            this.recupererCartes();
        }
    }
</script>

<style>
.drop-zone{
    width: 50%;
    margin: 50px auto;
    background-color: gray;
    padding: 10px;
    min-height: 10px;
}

.drop-el{
    background-color:aqua;
    color: white;
    padding: 5px;
    margin-bottom: 10px;

}
.modifbtn{
    margin-bottom: 10px;
}
</style>
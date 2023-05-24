<template>
    <div class="card">
        <a class="card-body">
            <h5 @click="afficherModifCarte">{{ carte.titre }}</h5>
            <a @click="supprimerCarte" class="btn btn-primary">Supprimer</a>
        </a>
        
        <div v-if="modif">
            <h2>Modification Carte</h2>
            <form>
                <div>
                    <label for="titre">Titre :</label>
                    <input type="text" id="titre" v-model="carteModifiee.titre" required>
                </div>
                <div>
                    <label for="description">Description :</label>
                    <textarea id="description" v-model="carteModifiee.description"></textarea>
                </div>
                <div>
                    <label for="dateLimite">Date limite :</label>
                    <input type="date" id="dateLimite" v-model="carteModifiee.dateLimite">
                </div>
                <button type="button" @click="modifierCarte">Enregistrer</button>
                <button type="button" @click="cacherModifCarte">Annuler</button>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: "CarteComponent",
    props: {
        carte: {
            type: Object,
            required: true
        }
    },
    $emit: ['delete'],
    data(){
        return{
            modif: false,
            titreModif: "",
            carteModifiee: {
                titre: "",
                description: "",
                dateLimite: null
            }
        }
    },
    methods:{
        afficherModifCarte(){
            this.modif = true;
        },
        cacherModifCarte(){
            this.modif = false;
        },
        modifierCarte(){
            
            const titre = this.carteModifiee.titre;
            const description = this.carteModifiee.description;
            const dateLimite = this.carteModifiee.dateLimite;
            const tableauId = this.$route.params.id;
            const listeId = this.carte.liste;
            const carteId = this.carte._id;
            console.log(listeId)
            fetch('http://localhost:3000/tableaux/' + tableauId + '/listes/' + listeId+'/cartes/' + carteId, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify({
                    titre: titre,
                    liste: listeId,
                    description: description,
                    dateLimite: dateLimite
                })
            })
            .then(response => response.json())
            .then(data => {
                this.carte.titre = data.titre;
                this.carte.description = data.description;
                this.carte.dateLimite = data.dateLimite;
                this.modif = false;
            })
            .catch(error => console.log(error));
            
        },
        supprimerCarte(){
            const tableauId = this.$route.params.id;
            const listeId = this.carte.liste;
            const carteId = this.carte._id;
            fetch('http://localhost:3000/tableaux/' + tableauId + '/listes/' + listeId+'/cartes/' + carteId,{
                method: 'DELETE',
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            })
            .then(response => {
                if(response.ok || response.status === 204){
                    this.$emit('delete', this.carte._id);
                   console.log("Carte supprimée");
                }else{
                    throw new Error('Requête échouée');
                }
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => console.log(error));
        }
    }

}
</script>

<style>
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 9999;
    /* Autres styles personnalisés pour centrer la fenêtre modale, etc. */
}

</style>
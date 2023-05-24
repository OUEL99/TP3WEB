<template>
    <h1>Inscription</h1>
    <form class="formulaire"  v-on:submit.prevent="inscription">
        <div class="form-group">
            <label for="nom">Nom</label>
            <input v-model="nom" @focusout="removeErrorsNom" @input="validateNom" class="form-control" id="nom" type="text"  placeholder="Entrez votre nom">
            <p class="erreur" v-if="nomErreur">{{ nomErreur }}</p>
        </div>
        
        <div class="form-group">
            <label for="courriel">Courriel</label>
            <input v-model="email" @focusout="removeErrorsEmail" @input="validateEmail" class="form-control" id="courriel" type="text" placeholder="Entrez votre courriel">
            <p class="erreur" v-if="emailErreur">{{ emailErreur }}</p>
            <p class="ok" v-if="emailOk">{{ emailOk }}</p>
        </div>
        
        <div class="form-group">
            <label for="password1">Mot de passe</label>
            <input v-model="mdp" @focusout="removeErrorsMdp" @input ="validateMdp" class="form-control" placeholder="Entrez votre mot de passe" id="password1" type="password">
            <p class="erreur" v-if="mdpErreur">{{ mdpErreur }}</p>
        </div>
        
        <div class="form-group">
            <label for="password2">Confirmation du mot de passe</label>
            <input v-model="mdp2" @focusout="validateMdp2" class="form-control" type="password"  id="password2" placeholder="Confirmez votre mot de passe">
            <p class="erreur" v-if="mdp2Erreur">{{ mdp2Erreur }}</p>
        </div>
        <div class="form-group">
            
        </div>
        <button class="btn btn-primary" :disabled="formIsInvalid" type="submit">Créer le compte</button>
    </form>
</template>

<script>
    export default {
        data(){
            return{
                nom:"",
                nomErreur:"",
                nomIsValid: false,

                email:"",
                emailErreur:"",
                emailOk:"",
                emailIsValid: false,

                mdp:"",
                mdpErreur:"",
                mdpIsValid: false,

                mdp2:"",
                mdp2Erreur:"",
                mdp2IsValid: false,
            }
        },
        methods:{
            // Validation du formulaire Nom
            validateNom(){
                this.nomIsValid = true;
                if (this.nom === "") {
                    this.nomErreur = 'Le nom est requis';
                    this.nomIsValid = false;
                }
                else if(this.nom.length < 3){
                    this.nomErreur = 'Le nom doit contenir au moins 3 caractères';
                    this.nomIsValid = false;
                }
                else if(this.nom.length > 50){
                    this.nomErreur = 'Le nom doit contenir moins de 50 caractères';
                    this.nomIsValid = false;
                }
                else{
                    this.nomErreur = "";
                }
            },
            //Retire les messages d'erreur si l'utilisateur efface le champ
            removeErrorsNom(){
                if(this.nom === ""){
                    this.nomErreur = "";
                }
                
            },
            //Retire les messages d'erreur si l'utilisateur efface le champ
            removeErrorsEmail(){
                if(this.email === ""){
                    this.emailErreur = "";
                }
                
                
            },
            //Retire les messages d'erreur si l'utilisateur efface le champ
            removeErrorsMdp(){
                if(this.mdp === ""){
                    this.mdpErreur = "";
                }
                
            },
            //Valide le Email
            validateEmail(){
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                this.emailIsValid = true;
                if (this.email === "") {
                    this.emailErreur = 'Le email est requis';
                    this.emailIsValid = false;
                    this.emailOk = "";
                }
                else if(emailRegex.test(this.email) === false){
                    this.emailErreur = 'Le email doit être dans un format valide';
                    this.emailIsValid = false;
                    this.emailOk = "";
                }
                else if(this.email.length > 50){
                    this.emailErreur = 'Le email doit contenir moins de 50 caractères';
                    this.emailIsValid = false;
                    this.emailOk = "";
                }
                //vérifier si le email est déjà utilisé dans la BD4
                else if(this.validateIfEmailIsUsed() === true){
                    this.emailErreur = 'Le email est déjà utilisé';
                    this.emailIsValid = false;
                    this.emailOk = "";
                }
                else{
                    this.emailErreur = "";
                    this.emailOk = "Le courriel est valide et disponible"
                }
            },
            //Vérifie si le email est déjà utilisé dans la BD
            async validateIfEmailIsUsed(){
                try{
                    const response = await fetch('http://localhost:3000/validerEmail?courriel=${this.email}', {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                        });
                    if(response.exists === true){
                        return true;
                    }else{
                        return false;
                    }
                }
                catch(error){
                    console.log(error);
                }
            },
            //Valide le mot de passe
            validateMdp(){
                this.mdpIsValid = true;
                if (this.mdp === "") {
                    this.mdpErreur = 'Le mot de passe est requis';
                    this.mdpIsValid = false;
                }
                else if(this.mdp.length < 6){
                    this.mdpErreur = 'Le mot de passe doit contenir au moins 6 caractères';
                    this.mdpIsValid = false;
                }
                else{
                    this.mdpErreur = "";
                }
            },

            //Valide la confirmation du mot de passe
            validateMdp2(){
                this.mdp2IsValid = true;
                if (this.mdp2 === "") {
                    this.mdp2Erreur = 'La confirmation du mot de passe est requise';
                    this.mdp2IsValid = false;
                }
                else if(this.mdp2 !== this.mdp){
                    this.mdp2Erreur = 'La confirmation du mot de passe doit être identique au mot de passe';
                    this.mdp2IsValid = false;
                }
                else{
                    this.mdp2Erreur = "";
                }
            },
            //Inscription de l'utilisateur
            async inscription(){
                if(this.formIsInvalid == false){
                    try{
                        const response = await fetch('http://localhost:3000/utilisateurs', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                nom: this.nom,
                                courriel: this.email,
                                motDePasse: this.mdp
                            })
                        });
                        if(response.ok){
                            console.log("Utilisateur ajouté");
                            this.$router.push('/connexion');
                        }
                        else{
                            console.log("Utilisateur non ajouté");
                        }
                    }
                    catch(error){
                        console.log(error);
                    }
                }
            }

            
        },
        computed:{
            formIsInvalid(){
                return !(this.nomIsValid && this.emailIsValid && this.mdpIsValid && this.mdp2IsValid);
            },


        }
    }
</script>

<style>
.erreur{
    color: red;
}
.ok{
    color: green;
}
</style>
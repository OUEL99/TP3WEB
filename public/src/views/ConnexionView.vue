<template>
    <h1>Connexion</h1>
    <p v-if="errorMessage" class="alert alert-danger">{{ errorMessage }}</p>
    <form class="formulaire" v-on:submit.prevent="connexion">
        <div class="from-group">
            <label for="email">Email:</label>
            <input v-model="email" @focusout="validateEmail" class="form-control" type="email" id="email" >
            <p class="erreur" v-if="emailErreur">{{ emailErreur }}</p>
        </div>
        
        <div class="form-group">
            <label for="password">Mot de passe:</label>
            <input v-model="mdp" @focusout="validateMdp" class="form-control" type="password" id="password">
            <p class="erreur" v-if="mdpErreur">{{ mdpErreur }}</p>
        </div>
        <button class="btn btn-primary" :disabled="formIsInvalid" type="submit">Se connecter</button>
    </form>
</template>

<script>
import jwt_decode from 'jwt-decode';
export default {
    Data(){
        return{
            email:"",
            emailErreur:"",
            emailIsValid: false,

            mdp:"",
            mdpErreur:"",
            mdpIsValid: false,

            errorMessage: ""
        }
    },
    methods:{
        validateEmail(){
            
            this.emailIsValid = true;
            if (this.email === "") {
                this.emailErreur = 'Le email est requis';
                this.emailIsValid = false;
            }
            else{
                this.emailErreur = "";
            }
        },
        validateMdp(){
            this.mdpIsValid = true;
            if (this.mdp === "") {
                this.mdpErreur = 'Le mot de passe est requis';
                this.mdpIsValid = false;
            }
            else{
                this.mdpErreur = "";
            }
        },
        connexion(){
            if(this.emailIsValid && this.mdpIsValid){
                //api validation
                fetch('http://localhost:3000/connexion', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        courriel: this.email,
                        motDePasse: this.mdp
                    })
                })
                .then(response => {
                    
                    if (response.ok){
                        console.log(response);
                        return response.json();
                    }
                    else{
                        throw new Error("Erreur de connexion");
                    }
                })
                .then(data => {
                    console.log("Sauvegarde du token")
                    console.log(data)
                    const token = data.jwt;
                    const decodedToken = jwt_decode(token);
                    console.log("decodedToken")
                    const userId = decodedToken.utilisateurId;
                    console.log("userId")
                    localStorage.setItem('token', data.jwt);
                    localStorage.setItem('userId', userId);
                    console.log("localStorage")
                    this.$router.push('/');
                })
                .catch(error => {
                    this.errorMessage = error.message;
                })

            }
        }
        
    },
    computed:{
        formIsInvalid(){
            if(this.emailIsValid && this.mdpIsValid == false){
                return true;
            }
            else{
                return false;
            }
        }
    }
}
</script>

<style>

.form-group {
    margin: 20px 0;
}
.form-control {
    width: 300px;
}
.formulaire{
    margin: 0 auto;
    width: 300px;
    align-items: center;
}
h1{
    text-align: center;
}
</style>
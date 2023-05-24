import {RouterLink} from "vue-router";

<template>
    <button class="btn btn-danger" @click="$emit('delete', tableau.id)">Supprimer</button>
</template>

<script>


export default{
    name: "TableauComponent",
    props: {
        tableau: {
            type: Object,
            required: true
        }
    },
    $emits: ['delete'],

}
</script>
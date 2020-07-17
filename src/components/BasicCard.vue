<template>
    <v-card
            color="accent"
            :href="item.document.url" target="_blank"
            class="products_card ma-5"
    >
        <v-img
                :src="item.document.image"
                height="200px"
        ></v-img>
        <v-card-subtitle class="font-weight-bold">
            {{item.document.title}}
        </v-card-subtitle>
        <v-card-subtitle class="font-weight-bold text-center">
            {{item.document.price}} €
        </v-card-subtitle>
    </v-card>
</template>

<script>
    export default {
        name: "BasicCard",
        props: {
            item : {
                type: Object,
                required: true,
            }
        },
    }
</script>

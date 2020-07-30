<template>
    <v-card
            color="accent"
            :href="item.document.url" target="_blank"
            class="basic-product-card ma-5"
    >
        <v-img
                class="basic-product-card_image"
                :src="item.document.image"
                height="200px"
        ></v-img>
        <v-card-subtitle class="basic-product-card_title font-weight-bold">
            {{item.document.title}}
        </v-card-subtitle>
        <v-card-subtitle class="basic-product-card_price font-weight-bold text-center">
            {{item.document.price}} €
        </v-card-subtitle>
    </v-card>
</template>

<script>
    export default {
        name: "BasicProductCard",
        props: {
            item : {
                type: Object,
                required: true,
            }
        },
    }
</script>

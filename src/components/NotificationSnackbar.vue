<template>
    <v-snackbar :timeout="time"
                v-model="show"
                :color="color">
        {{ message }}
        <v-btn text @click="show = false">Close</v-btn>
    </v-snackbar>
</template>

<script>
    export default {
        name: 'notification-snackbar',
        data() {
            return {
                show: false,
                time: -1,
                message: '',
                color: ''
            }
        },

        created() {
            this.$store.subscribe((mutation, state) => {
                if (mutation.type === 'SET_NOTIFICATION') {
                    this.message = state.notification.content;
                    this.color = state.notification.color;
                    this.time = state.notification.time;
                    this.show = true;

                    console.log('state notifi', state.notification);
                }
            })
        }
    }
</script>

<style scoped>

</style>

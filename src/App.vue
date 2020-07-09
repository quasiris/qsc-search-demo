<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    export default {
        name: 'App',
    };
</script>
<style type="text/css">
    :root {
        --primary-color: #2f3033;
        --secondary-color: #fcfcfc;
        --danger-color: #b71c1c;
    }

    .v-application--wrap {
        background-color: #eeeeee;
    }

    a {

        text-decoration: none;
    }

    a:hover {
        text-decoration: none;
    }

    .w-100 {
        width: 100%;
    }

    /*  CARD STYLES*/
    .v-card:hover {
        cursor: pointer;
        box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.2), 0 1px 1px 0 rgba(0, 0, 0, 0.14), 0 2px 1px -1px rgba(0, 0, 0, 0.12)
    }

    .tools-view-card {
        min-height: 80vh;
    }

    .card-title {
        color: var(--primary-color);;
    }

    /*GRID*/
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
        grid-gap: 1rem;

    }

    /*EXPANSION PANEL*/
    .expansion-panel-content {
        overflow: auto;
        max-height: 400px;
        word-wrap: break-word;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      grid-gap: 1rem;
    }

</style>

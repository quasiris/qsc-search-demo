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
    .card-title {
        color: var(--primary-color);;
    }

    /*GRID*/
    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    }

    /*EXPANSION PANEL*/
    .expansion-panel-content {
        overflow: auto;
        max-height: 400px;
        word-wrap: break-word;
    }


</style>

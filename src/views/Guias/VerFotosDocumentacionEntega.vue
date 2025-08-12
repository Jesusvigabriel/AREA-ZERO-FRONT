<template>
  
</template>

<script>

import guias from "../../store/guias"
import store from "../../store"

export default {
    name: "VerFotosDocumentacionEntrega",

    methods: { 
    },

    created() {
        const idGuia=this.$route.params.idGuia
        guias.getFotosDocumentacionEntrega(idGuia)
          .then(response => {
            
            if (response.length>0) {
             
              response.forEach(imagen => {
               const URL = `https://a54-choferes-fotos-documentacion-entrega.s3.amazonaws.com/a54_cfde_${imagen.IdGuia}_${imagen.Hash}`
               window.open(URL, '_blank');
              });
              
            } else {
              store.dispatch("snackbar/mostrar", "Documentación inexistente para la guía seleccionada")
            }

          })
          .catch( error => {
            console.log(error);
          })
    },
}
</script>


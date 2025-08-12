<template>
</template>

<script>


import guiasRendiciones from '../../store/guiasRendiciones'
export default {
    name: "ImprimirUnaRendicion",

    methods: {
        getRendicion(idRendicion) {
            guiasRendiciones.getOneByIdRendicion(idRendicion)
                .then(response => {
                    // console.log(response)
                    this.generarRendicionEnPDF(response)
                })
                .catch(error => {
                    console.log("Error", error)                
                })
        },
        async generarRendicionEnPDF(rendicion) {
            // console.log(rendicion)
            const pdf=await guiasRendiciones.generarRendicionEnPDF(rendicion)
            // console.log("El PDF", pdf)
            pdf.save(`rendicion_${rendicion.Id}.pdf`)
        }
    },

    created() {
        const idRendicion=this.$route.params.idRendicion
        // console.log("IdRendicion", idRendicion)
        this.getRendicion(idRendicion)
    },
}
</script>
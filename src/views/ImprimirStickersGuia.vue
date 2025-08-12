<template>
</template>

<script>

import guias from "@/store/guias"
import store from "@/store"

export default {
    name: "ImprimirStickersGuia",

    methods: { 
        async getGuias(idsGuias) {
            const ids=idsGuias.split("|")
            const guiasAImprimir=[]
            for (const unaId of ids) {
                const guia=await guias.getById(Number(unaId))
                console.log("Una guia a imprimir", guia)
                guiasAImprimir.push(guia)
            }
            const pdf=await guias.imprimirStickers(guiasAImprimir)
            pdf.save("guias.pdf")
        }
    },

    mounted() {
        console.log("sjf")
    },

    created() {
        const ids=this.$route.params.idsGuias
        this.getGuias(ids)
        console.log("aefsf")
    },
}
</script>
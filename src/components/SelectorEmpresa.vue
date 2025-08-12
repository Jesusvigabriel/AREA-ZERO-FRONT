<template>
    <v-autocomplete
        v-model="IdEmpresaSeleccionada"
        dense
        prepend-inner-icon="mdi-factory"
        @change="onEmpresaChange"
        @blur="touched = true"
        :rules="empresaRules"
        :chips="false"
        :items="listaEmpresas"
        item-value="Id"
        item-text="Nombre"
        label="Seleccione empresa"
        class="my-0 py-0"
        id="SelectorEmpresa"
        :search-input.sync="searchTerm"
        return-object
        clearable
    >
    </v-autocomplete>
</template>

<script>

import {mapState, mapActions} from 'vuex'

export default {
    name: 'SelectorEmpresa',
    data() {
        return {
            IdEmpresaSeleccionada: null,
            searchTerm: '',
            touched: false,
            empresaRules: [v => !!v || 'Seleccione una empresa']
        }
    },
    props: {
        idEmpresaInicialmenteSeleccionada: Number
    },
    computed: {
        listaEmpresas() {
            return this.$store.state.empresas.listaEmpresas
        }
    },
    methods: {
        onEmpresaChange(empresa) {
            // Solo emitir si se seleccionó una empresa válida
            if (empresa && empresa.Id) {
                this.$emit('eligioEmpresa', empresa.Id);
            } else if (empresa === null || empresa === undefined) {
                // Si se limpió el selector, marcamos como tocado para mostrar el error
                this.touched = true;
            }
        }
    },
    created() {
        this.IdEmpresaSeleccionada=this.idEmpresaInicialmenteSeleccionada
    }
}
</script>
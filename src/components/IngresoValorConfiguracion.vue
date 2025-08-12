<template>
  <v-container>
    <v-card class="rounded-card">
      <v-card-title class="py-0 my-2">
        {{titulo}}
      </v-card-title>
      <v-card-text class="py-0 my-0">
        <v-row  class="py-0 my-0">
          <v-col  class="py-0 my-0">
            <v-select 
              v-model="variableSeleccionada" 
              dense 
              :disabled="!ingresoHabilitado"
              prepend-inner-icon="mdi-calculator"
              @change="emitirCambios()" 
              :chips="false" 
              :items="variablesConfiguracion" 
              label="Variable"
              class="my-1 py-1"
              id="SelectorEmpresa"
            >
            </v-select>
          </v-col>
          <v-col  class="py-0 my-0">
            <v-text-field v-model="valor" label="Valor" @input="emitirCambios()" type="number" class="my-0 py-0" :disabled="!ingresoHabilitado"></v-text-field>
          </v-col>
          <v-col  class="py-0 my-0">
            <v-text-field v-model="minimo" label="Mínimo" @input="emitirCambios()" type="number" class="my-0 py-0" :disabled="!ingresoHabilitado"></v-text-field>
          </v-col>
        </v-row>
        <v-row class="py-0 my-0" >
          <v-col  class="py-0 my-0">
            <v-checkbox label="Activo" v-model="activo" @change="clickEnActivo"  class="py-0 my-0"></v-checkbox>                
          </v-col>
          <v-col class="py-0 my-0" >
            <v-checkbox label="Prederminado" v-model="predeterminado" @change="emitirCambios()" :disabled="!ingresoHabilitado"  class="py-0 my-0"></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-container>

</template>
<script>

export default {
    name: 'IngresoValorConfiguracion',
    data() {
        return {
          valor: null,
          minimo: null,
          activo: null,
          predeterminado: null,
          variablesConfiguracion: ["M3", "Kg", "Unidades", "%VD", "Bultos", "Pallets"],
          variableSeleccionada: null,
          ingresoHabilitado: true,
          ingresoValorHabilitado: true,
          ingresoMinimoHabilitado: true,
        }
    },
    props: {
      titulo: String,
      valorInicial: Object,
      variablesDisponibles: String,
    },
    mounted() {
      this.variableSeleccionada=this.valorInicial.Variable
      this.valor=this.valorInicial.Valor
      this.minimo=this.valorInicial.Minimo
      this.activo=this.valorInicial.Activo
      this.predeterminado=this.valorInicial.Predeterminado
      this.ingresoHabilitado=this.activo
      this.predeterminado=this.valorInicial.Predeterminado
      if (typeof this.variablesDisponibles != "undefined") {
        this.variablesConfiguracion=this.variablesDisponibles.split("|")
      }
    },
    methods: {      
      clickEnActivo() {
        this.ingresoHabilitado=this.activo
        if (this.activo) {
          this.variableSeleccionada=""
        } else {
          this.variableSeleccionada="---"
          this.valor=0
          this.minimo=0
          this.predeterminado=false
        }
        this.emitirCambios()
      }, 
      emitirCambios() {
        this.$emit("huboIngresoDeDatos", {Variable: this.variableSeleccionada, Valor: this.valor, Minimo: this.minimo, Activo: this.activo, Predeterminado: this.predeterminado})
      },
    }
}
</script>
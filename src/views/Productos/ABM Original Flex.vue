<template>
    <v-container>
        <v-row v-if="selectorDeposito.mostrar">
            <v-col>
                <v-select
                v-model="selectorDeposito.dato"
                dense
                prepend-inner-icon="mdi-account-outline"
                @change="selectorDepositoChange"
                :chips="false"
                :items="listaDepositos"
                item-value="Id"
                item-text="Nombre"
                label="Seleccione depósito"
                class="my-0 py-0"
                id="selectorDeposito"
                >
                </v-select>
            </v-col>
        </v-row>

        <v-data-table v-if="selectorDeposito.dato != null" :headers="cabecerasCRUD" :items="listaPosiciones" class="elevation-1" show-select v-model="posicionesSeleccionadas" item-key="Id">
            <template v-slot:top>
                <v-toolbar flat class="header-menubar">
                    <v-toolbar-title class="white--text">Posiciones</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="mostrarEdicion" max-width="600px">
                        <template v-slot:activator="{on, attrs}">
                            <v-btn color="warning" dark class="mb-2 ml-1" @click="eliminarPosiciones()" >Eliminar posiciones</v-btn>
                            <v-btn class="action-button mb-2" v-bind="attrs" v-on="on">Crear posiciones</v-btn>
                        </template>
                        <v-card class="rounded-card">
                            <v-card-title ><span class="headline">Crear nuevas posiciones</span></v-card-title>
                            <v-card-text  class="my-0 py-0">
                                <v-container>
                                    <v-form ref="form"  v-model="formularioValido">
                                        <v-row dense>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido]" maxlength="2" v-model="itemEditado.Piso"  ref="Piso" label="Piso"/></v-col>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido]" maxlength="2" v-model="itemEditado.Pasillo" label="Pasillo"/></v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.ModuloDesde" label="Módulo desde"/></v-col>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.ModuloHasta" label="Módulo hasta"/></v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.EstanteDesde" label="Estante desde"/></v-col>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.EstanteHasta" label="Estante hasta"/></v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.PosicionDesde" label="Posición desde"/></v-col>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido, reglas.maximo]" min="1" max="10" type="number" v-model.number="itemEditado.PosicionHasta" label="Posición hasta"/></v-col>
                                        </v-row>
                                        <v-row dense>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido]" type="number" min="1" v-model.number="itemEditado.PesoMaximo" label="Peso máximo"/></v-col>
                                            <v-col class="my-0 py-0"><v-text-field :rules="[reglas.requerido]" type="number" min="1" v-model.number="itemEditado.VolumenMaximo" label="Volumen máximo"/></v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="gray" text @click="cerrar">Cancelar</v-btn>
                                <v-btn color="success" text @click="guardar">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
        </v-data-table>
    </v-container>
</template>

<script>

import store from '@/store'
import productos from '@/store/productosV3'

export default {
    name: "ProductosABM",
    data() {
        return {
            selectorDeposito: { mostrar: false, dato: null },
            listaDepositos: [],
            listaPosiciones: [],
            formularioValido: null,
            posicionesSeleccionadas: [],
            reglas: {
                requerido: value => !!value || 'Valor requerido',
                largo2: value => (value.length>=1 && value.length<=2) || '1 o 2 caracteres',
                maximo: value => value<=10 || 'Valor máximo: 10'
            },            
        
            itemEditado: {  Piso: '',
                            Pasillo: '', 
                            ModuloDesde: 1,
                            ModuloHasta: 1,
                            EstanteDesde: 1,
                            EstanteHasta: 1,
                            PosicionDesde: 1,
                            PosicionHasta: 1,
                            PesoMaximo: 1,
                            VolumenMaximo: 1,
                            Id: 0
                        },
            posicionSeleccionada: {},
            cabecerasCRUD: [{text: 'Nombre', value: 'Nombre'}],
            mostrarEdicion: false,
        }
    },
    methods: {
        selectorDepositoChange() {
            posiciones.actions.getAllByIdDeposito(this.selectorDeposito.dato)
                .then((dato) => {
                    this.listaPosiciones=dato
                    this.posicionesSeleccionadas=[]
                })
                .catch((puteada) => {this.mostrarError(puteada)})
        },
        eliminarPosiciones() {
            if (this.posicionesSeleccionadas.length>0) {
                store.dispatch("alertDialogMostrar", { titulo: 'Advertencia', botonPrimario: "Confirmar", botonSecundario: "Cancelar", mensaje: '<h3><b>Confirma la eliminación de las '+ this.posicionesSeleccionadas.length +' posiciones seleccionadas?</h3></b>',
                        callback: botonApretado => {
                            if (botonApretado === "Confirmar") {
                                let IdsPosicionesABorrar=''
                                this.posicionesSeleccionadas.forEach((element) => {
                                    IdsPosicionesABorrar += element.Id+','
                                })
                                IdsPosicionesABorrar=IdsPosicionesABorrar.slice(0, -1)
                                posiciones.actions.delete(IdsPosicionesABorrar)
                                    .then(() => {this.selectorDepositoChange()})
                                    .catch((puteada) => {this.mostrarError(puteada)})                                                                
                            }
                        }
                    }
                );
            } else {
                this.mostrarError("No se ha seleccionado ninguna posición para eliminar")
            }
        },

        guardar () {
            this.validar()
            if (this.formularioValido) {
                this.cerrar()
                let cantidad=(this.itemEditado.ModuloHasta - this.itemEditado.ModuloDesde) + 1
                cantidad *= (this.itemEditado.EstanteHasta - this.itemEditado.EstanteDesde) + 1
                cantidad *= (this.itemEditado.PosicionHasta - this.itemEditado.PosicionDesde) + 1

                store.dispatch("alertDialogMostrar", { titulo: 'Advertencia', botonPrimario: "Confirmar", botonSecundario: "Cancelar", mensaje: '<h3><b>Confirma la creación de las '+ cantidad +' nuevas posiciones?</h3></b>',
                        callback: botonApretado => {
                            if (botonApretado === "Confirmar") {
                                posiciones.actions.create(this.selectorDeposito.dato, this.itemEditado.Piso, this.itemEditado.Pasillo, this.itemEditado.ModuloDesde, this.itemEditado.ModuloHasta, this.itemEditado.EstanteDesde, this.itemEditado.EstanteHasta, this.itemEditado.PosicionDesde, this.itemEditado.PosicionHasta, this.itemEditado.PesoMaximo, this.itemEditado.VolumenMaximo)
                                .then((dato) => {this.selectorDepositoChange()})
                                .catch((puteada) => {this.mostrarError(puteada)})
                            }
                        }
                    }
                );
            }
        },
        validar() {
            this.$refs.form.validate()
        },

        cerrar () {
            this.mostrarEdicion = false;
            this.$nextTick(() => {
                //this.itemEditado = Object.assign({}, this.defaultItem);
            })
        },
        mostrarError(puteada) {
            store.dispatch("snackbarMostrar", puteada)
        }
    },
    mounted() {
        depositos.actions.getAll()
            .then((lista) => {
                this.listaDepositos = lista;
                this.selectorDeposito.mostrar = true;
            })
            .catch((puteada) => {this.mostrarError(puteada)})

    }
}
</script>
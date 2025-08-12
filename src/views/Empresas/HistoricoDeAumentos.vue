<template>
    <v-container>
        <v-row class="py-2">
            <v-col>
                <SelectorEmpresa @eligioEmpresa="eligioEmpresa($event)" ></SelectorEmpresa>
            </v-col>            
        </v-row>

        <v-row justify="center">
      <v-col cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Desde" v-model="fechaDesde" dense></v-text-field>
      </v-col>
      <v-col  cols="3">
        <v-text-field prepend-inner-icon="mdi-calendar" type="date" label="Hasta" v-model="fechaHasta" dense></v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col class="py-0" cols="3">
          <v-btn @click="obtenerInformacion()" color="success" block>Obtener información<v-icon>mdi-refresh</v-icon></v-btn>
      </v-col>
    </v-row>

        <v-row class="py-2">
            <v-expansion-panels multiple >
                <v-expansion-panel @click="traeTarifa(item.Fecha)"
                    v-for="(item,i) in this.configuracion"
                    :key="i"
                    >
                    <v-expansion-panel-header color="primary"> 
                        <!-- <h5 class="white--text">Tarifas al {{item.Fecha.substring(0, 10)}}</h5> -->
                        <h5 class="white--text">Tarifas al {{formatDate(item.Fecha)}}</h5>
                    </v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <!-- In -->
                        <v-expansion-panel >
                            <v-expansion-panel-header><h3 class='capitalize-words'>Almacen - Ingreso</h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                In
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadIn" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorIn" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoIn" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        

                           <!-- Out -->
                        <v-expansion-panel>
                            <v-expansion-panel-header><h3 class='capitalize-words'>Almacen - Egreso</h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Out
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadOut" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorOut" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoOut" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                           <!-- Almacenaje -->
                        <v-expansion-panel>
                            <v-expansion-panel-header><h3 class='capitalize-words'>Almacen - Almacenaje</h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Almacenaje - PostPago
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadAlmacenaje" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorAlmacenaje" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoAlmacenaje" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Almacenaje - Prepago
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadPrepago" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="importePrepago" label="Prepago"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoPrepago" label="Minimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Almacenaje - Seguro
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadSeguro" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="importeSeguro" label="Seguro"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoSeguro" label="Minimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                         <!-- Entrega - B2B -->
                         <v-expansion-panel>
                            <v-expansion-panel-header><h3 class='capitalize-words'>Entrega - B2B </h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Guia
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadB2BGuia" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorB2BGuia" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoB2BGuia" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Seguro
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadB2BSeguro" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorB2BSeguro" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoB2BSeguro" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                CTR
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadB2BCTR" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorB2BCTR" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoB2BCTR" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                PickingCD
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadB2BPickingCD" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorB2BPickingCD" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoB2BPickingCD" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Complemento
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadB2BComplemento" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorB2BComplemento" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoB2BComplemento" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- Entrega - HD -->
                        <v-expansion-panel>
                            <v-expansion-panel-header><h3>Entrega - HD </h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Guia
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadHdGuia" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorHdGuia" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoHdGuia" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Seguro
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadHdSeguro" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorHdSeguro" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoHdSeguro" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                PickingCD
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadHdPickingCD" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorHdPickingCD" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoHdPickingCD" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Complemento
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadHdComplemento" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorHdComplemento" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoHdComplemento" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- Entrega - CND -->
                        <v-expansion-panel>
                            <v-expansion-panel-header><h3>Entrega - CND </h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Guia
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadCndGuia" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorCndGuia" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoCndGuia" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Seguro
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadCndSeguro" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorCndSeguro" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoCndSeguro" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                PickingCD
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadCndPickingCD" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorCndPickingCD" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoCndPickingCD" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Complemento
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadCndComplemento" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorCndComplemento" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoCndComplemento" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>

                        <!-- Entrega - Supermercado -->
                        <v-expansion-panel>
                            <v-expansion-panel-header><h3>Entrega - Supermercado </h3></v-expansion-panel-header>
                            <v-expansion-panel-content>
                                <v-card>
                            <v-card-title class="py-0 my-2">
                                Guia
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadSupermercadoGuia" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorSupermercadoGuia" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoSupermercadoGuia" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Seguro
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadSupermercadoSeguro" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorSupermercadoSeguro" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoSupermercadoSeguro" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                PickingCD
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadSupermercadoPickingCD" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorSupermercadoPickingCD" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoSupermercadoPickingCD" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            <v-card>
                            <v-card-title class="py-0 my-2">
                                Complemento
                            </v-card-title>
                            <v-card-text class="py-0 my-0">
                                <v-row  class="py-0 my-0">
                                <v-col  class="py-0 my-0">
                                    <v-select 
                                    v-model="unidadSupermercadoComplemento" 
                                    dense 
                                    prepend-inner-icon="mdi-calculator"
                                    :chips="false" 
                                    label="Variable"
                                    class="my-1 py-1"
                                    :items="variables"
                                   
                                    >
                                    </v-select>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="valorSupermercadoComplemento" label="Valor"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                <v-col  class="py-0 my-0">
                                    <v-text-field v-model="minimoSupermercadoComplemento" label="Mínimo"  type="number" class="my-0 py-0" ></v-text-field>
                                </v-col>
                                </v-row>
                            </v-card-text>
                            </v-card>
                            </v-expansion-panel-content>
                        </v-expansion-panel>
                        
                       
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-row>
    
    </v-container>
</template>


<script>

import SelectorEmpresa from '@/components/SelectorEmpresa.vue'

import store from '@/store'
import empresas from '@/store/empresasV3'



export default {
    name: "HistoricoDeAumentos",

    data() {
        return {
            datosValidos: false,
            idEmpresa: null,
            configuracion: [],
            empresa: {},
            hoy : new Date(),
            unidadOut:'',
            valorOut:0,
            minimoOut:0,
            unidadIn:'',
            valorIn:0,
            minimoIn:0,
            unidadAlmacenaje:'',
            valorAlmacenaje:0,
            minimoAlmacenaje:0,
            importeSeguro:0,
            unidadSeguro:'',
            minimoSeguro:0,
            importePrepago:0,
            unidadPrepago:'',
            minimoPrepago:0,
            variables:['M3','Kilos','Unidades','Palets','%VD','Fijo','Bultos'],
            fechaDesde:'2023-01-01',
            fechaHasta:'2024-03-15',
            unidadB2BGuia:'',
            unidadB2BSeguro:'',
            unidadB2BCTR:'',
            unidadB2BPickingCD:'',
            unidadB2BComplemento:'',
            valorB2BGuia:0,
            valorB2BSeguro:0,
            valorB2BPickingCD:0,
            valorB2BComplemento:0,
            valorB2BCTR:0,
            minimoB2BGuia:0,
            minimoB2BSeguro:0,
            minimoB2BPickingCD:0,
            minimoB2BCTR:0,
            minimoB2BComplemento:0,
            unidadHdGuia:'',
            unidadHdSeguro:'',
            unidadHdPickingCD:'',
            unidadHdComplemento:'',
            valorHdGuia:0,
            valorHdSeguro:0,
            valorHdPickingCD:0,
            valorHdComplemento:0,
            minimoHdGuia:0,
            minimoHdSeguro:0,
            minimoHdPickingCD:0,
            minimoHdComplemento:0,
            unidadCndGuia:'',
            unidadCndSeguro:'',
            unidadCndPickingCD:'',
            unidadCndComplemento:'',
            valorCndGuia:0,
            valorCndSeguro:0,
            valorCndPickingCD:0,
            valorCndComplemento:0,
            minimoCndGuia:0,
            minimoCndSeguro:0,
            minimoCndPickingCD:0,
            minimoCndComplemento:0,
            unidadSupermercadoGuia:'',
            unidadSupermercadoSeguro:'',
            unidadSupermercadoPickingCD:'',
            unidadSupermercadoComplemento:'',
            valorSupermercadoGuia:0,
            valorSupermercadoSeguro:0,
            valorSupermercadoPickingCD:0,
            valorSupermercadoComplemento:0,
            minimoSupermercadoGuia:0,
            minimoSupermercadoSeguro:0,
            minimoSupermercadoPickingCD:0,
            minimoSupermercadoComplemento:0,

            
      
    }

},

methods: {
    formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}-${month}-${year}`;
    },

    traeTarifa(item){
        this.configuracion.forEach(c => {
            
            if(c.Fecha === item){

                if(c.AlmacenEgresoOut.split("|")[3]==="true"){

                    this.unidadOut=c.AlmacenEgresoOut.split("|")[0]
                    this.valorOut=Number(c.AlmacenEgresoOut.split("|")[1])
                    this.minimoOut=Number(c.AlmacenEgresoOut.split("|")[2])
                }

                if(c.AlmacenIngresoIn.split("|")[3]==="true"){

                    this.unidadIn=c.AlmacenIngresoIn.split("|")[0]
                    this.valorIn=Number(c.AlmacenIngresoIn.split("|")[1])
                    this.minimoIn=Number(c.AlmacenIngresoIn.split("|")[2])
                }

                if(c.AlmacenPostpago.split("|")[3]==="true"){

                    this.unidadAlmacenaje=c.AlmacenPostpago.split("|")[0]
                    this.valorAlmacenaje=Number(c.AlmacenPostpago.split("|")[1])
                    this.minimoAlmacenaje=Number(c.AlmacenPostpago.split("|")[2])
                }

                if (c.AlmacenSeguro.split("|")[3]==="true") {
                        this.unidadSeguro = c.AlmacenSeguro.split("|")[0]
                        this.importeSeguro=Number(c.AlmacenSeguro.split("|")[1])
                        this.minimoSeguro=Number(c.AlmacenSeguro.split("|")[2])
                } else {
                    this.importeSeguro=0
                }

                if (c.AlmacenPrepago.split("|")[3]==="true") {
                    this.unidadPrepago = c.AlmacenPrepago.split("|")[0]
                    this.importePrepago=Number(c.AlmacenPrepago.split("|")[1])
                    this.minimoPrepago=Number(c.AlmacenPrepago.split("|")[2])
                } else {
                    this.importePrepago=0
                }

                
                if(c.EntregaRegularB2BGuia.split("|")[3]==="true"){

                    this.unidadB2BGuia=c.EntregaRegularB2BGuia.split("|")[0]
                    this.valorB2BGuia=Number(c.EntregaRegularB2BGuia.split("|")[1])
                    this.minimoB2BGuia=Number(c.EntregaRegularB2BGuia.split("|")[2])
                }

                if(c.EntregaRegularB2BSeguro.split("|")[3]==="true"){

                    this.unidadB2BSeguro=c.EntregaRegularB2BSeguro.split("|")[0]
                    this.valorB2BSeguro=Number(c.EntregaRegularB2BSeguro.split("|")[1])
                    this.minimoB2BSeguro=Number(c.EntregaRegularB2BSeguro.split("|")[2])
                }

                if(c.EntregaRegularB2BCTR.split("|")[3]==="true"){

                    this.unidadB2BCTR=c.EntregaRegularB2BCTR.split("|")[0]
                    this.valorB2BCTR=Number(c.EntregaRegularB2BCTR.split("|")[1])
                    this.minimoB2BCTR=Number(c.EntregaRegularB2BCTR.split("|")[2])
                }

                if(c.EntregaRegularB2BPickingCD.split("|")[3]==="true"){

                    this.unidadB2BPickingCD=c.EntregaRegularB2BPickingCD.split("|")[0]
                    this.valorB2BPickingCD=Number(c.EntregaRegularB2BPickingCD.split("|")[1])
                    this.minimoB2BPickingCD=Number(c.EntregaRegularB2BPickingCD.split("|")[2])
                }

                if(c.EntregaRegularB2BComplemento.split("|")[3]==="true"){

                    this.unidadB2BComplemento=c.EntregaRegularB2BComplemento.split("|")[0]
                    this.valorB2BComplemento=Number(c.EntregaRegularB2BComplemento.split("|")[1])
                    this.minimoB2BComplemento=Number(c.EntregaRegularB2BComplemento.split("|")[2])
                }

                if(c.EntregaRegularHDGuia.split("|")[3]==="true"){

                    this.unidadHdGuia=c.EntregaRegularHDGuia.split("|")[0]
                    this.valorHdGuia=Number(c.EntregaRegularHDGuia.split("|")[1])
                    this.minimoHdGuia=Number(c.EntregaRegularHDGuia.split("|")[2])
                }

                if(c.EntregaRegularHDSeguro.split("|")[3]==="true"){

                    this.unidadHdSeguro=c.EntregaRegularHDSeguro.split("|")[0]
                    this.valorHdSeguro=Number(c.EntregaRegularHDSeguro.split("|")[1])
                    this.minimoHdSeguro=Number(c.EntregaRegularHDSeguro.split("|")[2])
                }

                if(c.EntregaRegularHDPickingCD.split("|")[3]==="true"){

                    this.unidadHdPickingCD=c.EntregaRegularHDPickingCD.split("|")[0]
                    this.valorHdPickingCD=Number(c.EntregaRegularHDPickingCD.split("|")[1])
                    this.minimoHdPickingCD=Number(c.EntregaRegularHDPickingCD.split("|")[2])
                }

                if(c.EntregaRegularHDComplemento.split("|")[3]==="true"){

                    this.unidadHdComplemento=c.EntregaRegularHDComplemento.split("|")[0]
                    this.valorHdComplemento=Number(c.EntregaRegularHDComplemento.split("|")[1])
                    this.minimoHdComplemento=Number(c.EntregaRegularHDComplemento.split("|")[2])
                }

                if(c.EntregaRegularCNDGuia.split("|")[3]==="true"){

                    this.unidadCndGuia=c.EntregaRegularCNDGuia.split("|")[0]
                    this.valorCndGuia=Number(c.EntregaRegularCNDGuia.split("|")[1])
                    this.minimoCndGuia=Number(c.EntregaRegularCNDGuia.split("|")[2])
                }

                if(c.EntregaRegularCNDSeguro.split("|")[3]==="true"){

                    this.unidadCndSeguro=c.EntregaRegularCNDSeguro.split("|")[0]
                    this.valorCndSeguro=Number(c.EntregaRegularCNDSeguro.split("|")[1])
                    this.minimoCndSeguro=Number(c.EntregaRegularCNDSeguro.split("|")[2])
                }

                if(c.EntregaRegularCNDPickingCD.split("|")[3]==="true"){

                    this.unidadCndPickingCD=c.EntregaRegularCNDPickingCD.split("|")[0]
                    this.valorCndPickingCD=Number(c.EntregaRegularCNDPickingCD.split("|")[1])
                    this.minimoCndPickingCD=Number(c.EntregaRegularCNDPickingCD.split("|")[2])
                }

                if(c.EntregaRegularCNDComplemento.split("|")[3]==="true"){

                    this.unidadCndComplemento=c.EntregaRegularCNDComplemento.split("|")[0]
                    this.valorCndComplemento=Number(c.EntregaRegularCNDComplemento.split("|")[1])
                    this.minimoCndComplemento=Number(c.EntregaRegularCNDComplemento.split("|")[2])
                }

                if(c.EntregaRegularSupermercadoGuia.split("|")[3]==="true"){

                    this.unidadSupermercadoGuia=c.EntregaRegularSupermercadoGuia.split("|")[0]
                    this.valorSupermercadoGuia=Number(c.EntregaRegularSupermercadoGuia.split("|")[1])
                    this.minimoSupermercadoGuia=Number(c.EntregaRegularSupermercadoGuia.split("|")[2])
                }

                if(c.EntregaRegularSupermercadoSeguro.split("|")[3]==="true"){

                    this.unidadSupermercadoSeguro=c.EntregaRegularSupermercadoSeguro.split("|")[0]
                    this.valorSupermercadoSeguro=Number(c.EntregaRegularSupermercadoSeguro.split("|")[1])
                    this.minimoSupermercadoSeguro=Number(c.EntregaRegularSupermercadoSeguro.split("|")[2])
                }

                if(c.EntregaRegularSupermercadoPickingCD.split("|")[3]==="true"){

                    this.unidadSupermercadoPickingCD=c.EntregaRegularSupermercadoPickingCD.split("|")[0]
                    this.valorSupermercadoPickingCD=Number(c.EntregaRegularSupermercadoPickingCD.split("|")[1])
                    this.minimoSupermercadoPickingCD=Number(c.EntregaRegularSupermercadoPickingCD.split("|")[2])
                }

                if(c.EntregaRegularSupermercadoComplemento.split("|")[3]==="true"){

                    this.unidadSupermercadoComplemento=c.EntregaRegularSupermercadoComplemento.split("|")[0]
                    this.valorSupermercadoComplemento=Number(c.EntregaRegularSupermercadoComplemento.split("|")[1])
                    this.minimoSupermercadoComplemento=Number(c.EntregaRegularSupermercadoComplemento.split("|")[2])
                }
            }
        })        
    },

    eligioEmpresa(idEmpresaElegida) {
        this.idEmpresa=idEmpresaElegida
      },

    obtenerInformacion()
    {
        this.configuracion=[]
        if(this.idEmpresa){
            empresas.getConfiguracionesEmpresa(this.idEmpresa,this.fechaDesde,this.fechaHasta)
                .then(response => {
                    this.configuracion=response
                })
                .catch(error => {
                    console.log("Error", error)
                    this.mostrarError(error)
                })

        } else {
                this.mostrarError("Debe seleccionar empresa")
        }
    },

    mostrarError(mensaje) {
        store.dispatch("snackbar/mostrar", mensaje)
    },
},

    components: {
        SelectorEmpresa
    },

    created() {
        store.dispatch('actualizarTituloPrincipal', 'Historico de Aumentos')
        store.dispatch('empresas/cargarListaEmpresas', "SoloActivas")

        
    }

}

</script>
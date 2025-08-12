<template>
  <v-container class="remito-container">

    <!-- TÍTULO -->
    <v-btn icon class="mb-2" @click="$router.back()">
      <v-icon class="icono-atras-negro">mdi-arrow-left</v-icon>
    </v-btn>
    <h2 class="remito-titulo">ORDEN DE SALIDA</h2>

    <!-- CABECERA -->
    <div class="remito-box">
      <div class="remito-header">
        <div><strong>EMPRESA:</strong> {{ empresaNombre }}</div>
        <div><strong>N.º DE ORDEN:</strong> {{ numeroOrden }}</div>
      </div>
      <div class="remito-header">
        <div><strong>FECHA:</strong> {{ fecha }}</div>
        <div><strong>USUARIO:</strong> {{ usuario }}</div>
      </div>
    </div>

    <!-- LECTOR DE BARCODES -->
    <v-row class="mt-4">
      <!-- Campo para el código de barras -->
      <v-col cols="6">
        <v-text-field
          ref="barcodeArticulo"
          v-model="barcodeArticulo"
          :label="'Barcode ' + (empresaConfig.PART ? '(1/3)' : '')"
          prepend-inner-icon="mdi-barcode-scan"
          @keydown.enter.prevent="barcodeEnter"
          dense
          :disabled="mostrandoCampoPartida || mostrandoCampoCantidad"
        />
      </v-col>

      <!-- Campo para la partida (solo si es necesario) -->
      <v-col cols="4" v-if="mostrandoCampoPartida">
        <v-text-field
          ref="partidaArticulo"
          v-model="partidaArticulo"
          label="Partida (2/3)"
          prepend-inner-icon="mdi-tag"
          @keydown.enter.prevent="partidaEnter"
          dense
        />
      </v-col>

      <!-- Campo para la cantidad -->
      <v-col cols="4" v-if="mostrandoCampoCantidad">
        <v-text-field
          ref="cantidadArticulo"
          v-model.number="cantidadArticulo"
          :label="'Cantidad' + (empresaConfig.PART ? ' (3/3)' : '')"
          type="number"
          @keydown.enter.prevent="cantidadEnter"
          dense
        />
      </v-col>
    </v-row>

    <!-- TABLA DE PRODUCTOS -->
    <v-simple-table class="remito-table">
      <thead>
        <tr>
          <th>Producto</th>
          <th>Barcode</th>
          <th v-if="empresaConfig.PART">Partida</th>
          <th v-if="tieneLote">Lote</th>
          <th>Posición</th>
          <th>Unidades</th>
          <th>Cant. Salida</th>
          <th>Estado</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, index) in detalle"
          :key="index"
          :class="rowClass(item)"
        >
          <td>{{ item.NombreProducto }}</td>
          <td>{{ item.Barcode || item.CodeEmpresa }}</td>
          <td v-if="empresaConfig.PART">
            <v-chip v-if="item.Partida" small color="info">
              {{ item.Partida }}
            </v-chip>
          </td>
          <td v-if="tieneLote">{{ item.Lote || '-' }}</td>
          <td>
            <v-tooltip bottom v-if="item.Posiciones && item.Posiciones.length">
              <template v-slot:activator="{ on, attrs }">
                <v-chip 
                  small 
                  color="primary" 
                  v-bind="attrs"
                  v-on="on"
                >
                  {{ item.Posiciones[0].Posicion || 'Sin posición' }}
                </v-chip>
              </template>
              <span v-if="item.Posiciones[0].Cantidad">
                Cantidad: {{ item.Posiciones[0].Cantidad }}
              </span>
            </v-tooltip>
            <span v-else>-</span>
          </td>
          <td>{{ item.Unidades }}</td>
          <td class="text-center">
            <v-edit-dialog
              :return-value.sync="item.CantidadSalida"
              @save="actualizarValidacion(item)"
            >
              <div class="d-flex align-center">
                {{ item.CantidadSalida }}
                <v-icon small class="ml-1">mdi-pencil</v-icon>
              </div>
              <template v-slot:input>
                <v-text-field v-model.number="item.CantidadSalida" type="number" autofocus></v-text-field>
              </template>
            </v-edit-dialog>
          </td>
          <td>
            <v-chip :color="chipColor(item)" dark small>{{ item.CantidadSalida }}</v-chip>
          </td>
        </tr>
      </tbody>
    </v-simple-table>


    <!-- BOTONES -->
    <div class="remito-actions no-print" v-if="todoValidado && !pedirCantidadBultos">
      <v-btn color="primary" @click="pedirCantidadBultos = true">
        Finalizar e ingresar cantidad de bultos
      </v-btn>
      <v-btn class="ml-2" outlined @click="$router.back()">
        <v-icon left>mdi-arrow-left</v-icon>
        Volver
      </v-btn>
      <v-btn class="ml-2" outlined color="success" @click="descargarExcel">
        Descargar Excel
      </v-btn>
    </div>
    <div class="remito-actions no-print" v-if="todoValidado && pedirCantidadBultos">
      <v-text-field
        class="mr-2"
        type="number"
        prepend-inner-icon="mdi-calculator"
        label="Cantidad de bultos"
        v-model.number="cantidadBultos"
        dense
      />
      <v-btn color="primary" @click="procesarOrden">
        Finalizar y registrar
      </v-btn>
    </div>

    <!-- Diálogo de confirmación de orden -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>Confirmar</v-card-title>
        <v-card-text>¿Está seguro que desea procesar la orden?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialog = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="procesarOrden">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Diálogo para selección de partidas -->
    <v-dialog v-model="dialogoPartidas.mostrar" max-width="600px">
      <v-card>
        <v-card-title>{{ dialogoPartidas.titulo }}</v-card-title>
        <v-card-text>
          <p>{{ dialogoPartidas.mensaje }}</p>
          <v-radio-group v-model="dialogoPartidas.seleccionado">
            <v-radio
              v-for="item in dialogoPartidas.items"
              :key="item.IdOrdendetalle"
              :label="`${item.NombreProducto || 'Producto sin nombre'} - Partida: ${item.Partida} (Disponible: ${item.Unidades} ${item.esPartida ? 'de partida' : ''})`"
              :value="item.IdOrdendetalle"
            ></v-radio>
          </v-radio-group>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="dialogoPartidas.mostrar = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" text @click="confirmarSeleccionPartida">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import atrasIcono from '@/assets/icons/atrasicono.svg'

import ordenesV3 from '@/store/ordenesV3'
import ordenes from '@/store/ordenes'
import empresasV3 from '@/store/empresasV3'
import store from '@/store'
import fechas from 'vue-lsi-util/fechas'
import excel from 'exceljs'
import { saveAs } from 'file-saver'
import { normalizeOrderItem, normalizeSearchValue } from '../../utils/normalize'

export default {
  name: 'PrepararOrden',
  data () {
    return {
      idOrden: this.$route.params.idOrden,
      numeroOrden: '',
      empresaId: 0,
      empresaNombre: '',
      usuario: store.state.usuarios.usuarioActual.Nombre,
      fecha: fechas.getHoy(),
      barcodeArticulo: '',
      partidaArticulo: '',
      cantidadArticulo: 1,
      mostrandoCampoPartida: false,
      mostrandoCampoCantidad: false,
      selectedItem: null,
      dialogoPartidas: {
        mostrar: false,
        titulo: '',
        mensaje: '',
        items: [],
        seleccionado: null
      },
      detalle: [],
      pedirCantidadBultos: false,
      cantidadBultos: 0,
      dialog: false,
      empresaConfig: {},
      textil: false,
      stockPosicionado: false,
      tieneLote: false
    }
  },
  computed: {
    todoValidado () {
      return this.detalle.every(d => d.CantidadSalida === d.Unidades)
    }
  },
    created () {
      this.cargarDatos()
    },
    methods: {
      async cargarDatos () {
        console.log('Cargando datos para la orden', this.idOrden)

        const orden = await ordenesV3.getById(this.idOrden)
        this.numeroOrden = orden.Numero || orden.numero
        this.empresaId = orden.IdEmpresa || orden.id_empresa
        const emp = orden.Empresa
        this.empresaNombre = emp?.RazonSocial || emp?.Nombre || 'Empresa desconocida'

        try {
          this.empresaConfig = await empresasV3.getOneById(this.empresaId)
          this.textil = !!this.empresaConfig.ClienteTextil
          this.stockPosicionado = !!this.empresaConfig.StockPosicionado
          this.tieneLote = !!this.empresaConfig.LOTE
        } catch (e) {
          console.error('Error obteniendo configuración de empresa', e)
          this.empresaConfig = {}
        }

        let respuestaDetalle = []
        if (this.empresaConfig.PART) {
          respuestaDetalle = await ordenesV3.getDetalleOrdenAndProductoPartidaById(this.idOrden)
        } else {
          respuestaDetalle = await ordenesV3.getDetalleOrdenAndProductoById(this.idOrden)
        }

        console.log('Detalle recibido', respuestaDetalle)
        
        // Aplicar normalización y mapeo de datos
        this.detalle = respuestaDetalle.map(item => {
          // Normalizar primero el item
          const normalizedItem = normalizeOrderItem(item);
          const posiciones = normalizedItem.posiciones || [];
          
          return {
            ...normalizedItem,
            validado: false,
            CantidadSalida: 0,
            NombreProducto: normalizedItem.Producto?.Nombre || 
                           normalizedItem.NombreProducto || 
                           normalizedItem.Nombre ||
                           normalizedItem.Descripcion || 
                           normalizedItem.Productos || 
                           'Sin nombre',
            Barcode: normalizedItem.Barcode || normalizedItem.CodeEmpresa,
            CodeEmpresa: normalizedItem.CodeEmpresa,
            Lote: normalizedItem.Lote || normalizedItem.lote || null,
            loteCompleto: normalizedItem.loteCompleto || normalizedItem.LoteCompleto || false,
            posiciones: posiciones,
            Posicion: posiciones.length > 0 ? posiciones[0].descripcion : null
          };
        });

        this.$nextTick(() => this.$refs.barcodeArticulo && this.$refs.barcodeArticulo.focus())
      },

      async procesarOrden () {
        // Generar el detalle según lo que espera el backend
        console.log('INICIO procesarOrden:');
console.log('Configuración empresa:', this.empresaConfig);
console.log('Detalle de la orden:', this.detalle);
let detallePayload = [];
        if (this.empresaConfig.PART && this.stockPosicionado) {
  console.log('La orden usa PARTIDA y STOCK POSICIONADO');
          // Para cada artículo, generar un objeto por cada posición
          this.detalle.forEach(item => {
            if (item.posiciones && item.posiciones.length > 0) {
              item.posiciones.forEach(pos => {
                detallePayload.push({
                  IdProducto: item.IdProducto,
                  Cantidad: item.CantidadSalida,
                  Barcode: item.Barcode || item.CodeEmpresa,
                  Lote: item.Lote || item.lote || null,
                  idPartida: item.IdPartida || item.Partida || item.partida,
                  partida: item.Partida || item.partida, // Asegurarse de enviar el número de partida
                  IdPosicion: pos.idPosicion
                });
              });
            } else {
              // Si no tiene posiciones, igual agregar el ítem (por si acaso)
              detallePayload.push({
                IdProducto: item.IdProducto,
                Cantidad: item.CantidadSalida,
                Barcode: item.Barcode || item.CodeEmpresa,
                Lote: item.Lote || item.lote || null,
                idPartida: item.IdPartida || item.Partida || item.partida,
                Partida: item.Partida || item.partida, // Asegurarse de enviar el número de partida
                IdPosicion: null
              });
            }
          });
        } else if (this.stockPosicionado) {
          // Lógica para órdenes con SOLO stock posicionado (sin partidas)
          this.detalle.forEach(item => {
            if (item.Posiciones && item.Posiciones.length > 0) {
              item.Posiciones.forEach(pos => {
                detallePayload.push({
                  IdProducto: item.IdProducto,
                  Cantidad: item.CantidadSalida,
                  Barcode: item.Barcode || item.CodeEmpresa,
                  Lote: item.Lote || item.lote || null,
                  idPartida: null,
                  partida: null,
                  IdPosicion: pos.IdPosicion
                });
              });
            } else {
              // Si no tiene posiciones, agregar sin IdPosicion
              detallePayload.push({
                IdProducto: item.IdProducto,
                Cantidad: item.CantidadSalida,
                Barcode: item.Barcode || item.CodeEmpresa,
                Lote: item.Lote || item.lote || null,
                idPartida: null,
                partida: null,
                IdPosicion: null
              });
            }
          });
        } else {
          // Lógica para órdenes sin partida ni stock posicionado
          detallePayload = this.detalle.map(i => ({
            IdProducto: i.IdProducto,
            Cantidad: i.CantidadSalida,
            Barcode: i.Barcode || i.CodeEmpresa,
            Lote: i.Lote || i.lote || null,
            idPartida: i.IdPartida || i.Partida || i.partida || null,
            partida: i.Partida || i.partida || null
          }));
        }

        console.log('Payload detallePayload generado:', detallePayload);
// Construir el objeto Cabeceras completo
        const Cabeceras = {
          IdOrden: this.idOrden,
          IdEmpresa: this.empresaId,
          Comprobante: this.numeroOrden,
          Usuario: this.usuario,
          Detalle: detallePayload,
          Textil: this.textil,
          StockPosicionado: this.stockPosicionado,
          TieneLote: this.tieneLote,
          TienePART: !!this.empresaConfig.PART,
          Fecha: this.fecha
        }

        console.log('Cabeceras a enviar:', Cabeceras);
console.log('Payload FINAL enviado a saleOrder:', JSON.stringify({ Cabeceras }, null, 2));

        try {
          if (this.cantidadBultos <= 0) {
            store.dispatch('snackbar/mostrar', 'Debe ingresar cantidad de bultos')
            return
          }
          console.log('Enviando saleOrder (remito y/o guía según configuración empresa)')
          await ordenesV3.saleOrder(this.empresaId, { Cabeceras })
          console.log('saleOrder exitosa, la orden fue procesada en backend')
          await ordenesV3.setCantidadBultos(this.idOrden, this.empresaId, this.cantidadBultos)

          try {
            const datosOrden = await ordenesV3.getById(this.idOrden)
console.log('Datos de la orden recibidos para PDF:', datosOrden);
const ordenActualizada = await ordenes.actions.getDatosOrden(datosOrden)
console.log('Datos de la orden procesados para PDF:', ordenActualizada);
const pdfEtiqueta = await ordenes.generarOrdenEtiquetaEnPDFChicaUnaPorHoja(ordenActualizada)
console.log('PDF de etiqueta generado:', pdfEtiqueta);
pdfEtiqueta.save(`etiqueta_${ordenActualizada[0].Orden.Numero}.pdf`)
console.log('Etiqueta PDF descargada');
          } catch (e) {
            store.dispatch('snackbar/mostrar', 'Error al obtener la orden')
          }

          store.dispatch('snackbar/mostrar', 'Orden procesada correctamente')
          this.resetearEstado()
          this.$router.push('/Ordenes/OrdenesPendientes')
        } catch (e) {
          console.error('Error en saleOrder', e)
console.log('Payload que causó el error:', { detallePayload, Cabeceras });
          store.dispatch('snackbar/mostrar', 'Error al procesar la orden')
        }
      },
    async descargarExcel () {
      const workbook = new excel.Workbook()
      const sheet = workbook.addWorksheet('Orden')
      sheet.columns = [
        { header: 'Producto', key: 'producto', width: 30 },
        { header: 'Barcode', key: 'barcode', width: 20 },
        { header: 'Posicion', key: 'posicion', width: 15 },
        { header: 'Unidades', key: 'unidades', width: 10 },
        { header: 'Cant. Salida', key: 'salida', width: 12 }
      ]
      this.detalle.forEach(d => {
        sheet.addRow({
          producto: d.NombreProducto,
          barcode: d.Barcode,
          posicion: d.Posicion || '',
          unidades: d.Unidades,
          salida: d.CantidadSalida
        })
      })
      const buf = await workbook.xlsx.writeBuffer()
      saveAs(new Blob([buf]), `orden_${this.numeroOrden}.xlsx`)
    },


    barcodeEnter () {
      const codigo = this.barcodeArticulo.trim()
      if (!codigo) return
      console.log('Barcode ingresado:', codigo)

      const searchCode = normalizeSearchValue(codigo)
      this.itemsEncontrados = []

      // Buscar coincidencias en el detalle
      this.detalle.forEach(d => {
        // Buscar en las partidas del ítem si es necesario
        if (this.empresaConfig.PART && d.Partidas && d.Partidas.length > 0) {
          d.Partidas.forEach(partida => {
            if (normalizeSearchValue(partida.Barcode) === searchCode ||
                normalizeSearchValue(partida.CodeEmpresa) === searchCode ||
                normalizeSearchValue(partida.NumeroParte) === searchCode) {
              this.itemsEncontrados.push({
                ...d,
                ...partida,
                NombreProducto: d.NombreProducto,
                Unidades: partida.Cantidad || d.Unidades,
                CantidadSalida: 0,
                esPartida: true
              })
            }
          })
        }
        
        // Buscar en el ítem principal
        if (normalizeSearchValue(d.Barcode) === searchCode || 
            normalizeSearchValue(d.CodeEmpresa) === searchCode) {
          this.itemsEncontrados.push({
            ...d,
            CantidadSalida: 0,
            esPartida: false
          })
        }
      })

      if (this.itemsEncontrados.length === 0) {
        console.log('Barcode no encontrado:', codigo)
        store.dispatch('snackbar/mostrar', `${codigo}: Barcode no encontrado`, { color: 'error' })
        this.cancelarIngreso()
        return
      }

      // Si es una orden con partidas, mostrar campo para ingresar partida
      if (this.empresaConfig.PART) {
        this.mostrandoCampoPartida = true
        this.$nextTick(() => this.$refs.partidaArticulo?.focus())
      } else {
        // Si no hay partidas y solo hay un ítem encontrado, seleccionarlo automáticamente
        if (this.itemsEncontrados.length === 1) {
          this.seleccionarItem(this.itemsEncontrados[0])
        } else if (this.itemsEncontrados.length > 1) {
          // Si hay múltiples ítems, mostrar selector
          this.mostrarSelectorPartida(this.itemsEncontrados, codigo)
        }
      }
    },

    partidaEnter() {
      const partida = this.partidaArticulo.trim()
      if (!partida) return
      console.log('Partida ingresada:', partida)

      // Buscar el ítem que coincida con el barcode y la partida
      const itemEncontrado = this.itemsEncontrados.find(item => 
        normalizeSearchValue(item.Partida) === normalizeSearchValue(partida)
      )

      if (!itemEncontrado) {
        store.dispatch('snackbar/mostrar', `No se encontró la partida ${partida} para el código escaneado`, { color: 'error' })
        this.partidaArticulo = ''
        return
      }

      this.selectedItem = itemEncontrado
      this.mostrandoCampoPartida = false
      this.mostrandoCampoCantidad = true
      this.$nextTick(() => this.$refs.cantidadArticulo?.focus())
    },

    cantidadEnter () {
      if (!this.selectedItem) return
      let cantidad = Number(this.cantidadArticulo)
      if (!cantidad || cantidad < 0) cantidad = 1
      
      // Encontrar el índice del ítem en el array detalle
      const itemIndex = this.detalle.findIndex(item => {
        if (this.selectedItem.esPartida) {
          // Si es una partida, buscar por IdOrdendetalle y Partida
          return item.IdOrdendetalle === this.selectedItem.IdOrdendetalle &&
                 item.Partida === this.selectedItem.Partida
        } else {
          // Si no es una partida, buscar solo por IdOrdendetalle
          return item.IdOrdendetalle === this.selectedItem.IdOrdendetalle
        }
      })

      if (itemIndex === -1) {
        store.dispatch('snackbar/mostrar', 'Error: Ítem no encontrado en el detalle', { color: 'error' })
        this.cancelarIngreso()
        return
      }

      // Actualizar la cantidad en el ítem seleccionado
      const nuevaCantidad = this.selectedItem.CantidadSalida + cantidad
      
      if (nuevaCantidad <= this.selectedItem.Unidades) {
        // Actualizar el ítem en el array detalle
        if (this.selectedItem.esPartida) {
          // Si es una partida, actualizar en el array de partidas
          this.detalle = this.detalle.map(item => {
            if (item.IdOrdendetalle === this.selectedItem.IdOrdendetalle) {
              const partidasActualizadas = item.Partidas.map(p => 
                p.Partida === this.selectedItem.Partida 
                  ? { ...p, CantidadSalida: nuevaCantidad }
                  : p
              )
              return { ...item, Partidas: partidasActualizadas }
            }
            return item
          })
        } else {
          // Si no es una partida, actualizar directamente
          this.detalle = this.detalle.map((item, index) => 
            index === itemIndex 
              ? { ...item, CantidadSalida: nuevaCantidad }
              : item
          )
        }
        
        // Actualizar validación
        this.actualizarValidacion(this.detalle[itemIndex])
      } else {
        store.dispatch('snackbar/mostrar', 'Cantidad excedida', { color: 'error' })
      }
      
      this.cancelarIngreso()
    },

    // Muestra un diálogo para seleccionar entre múltiples partidas
    mostrarSelectorPartida (items, searchCode) {
      this.dialogoPartidas = {
        mostrar: true,
        titulo: 'Seleccione una partida',
        mensaje: `Se encontraron ${items.length} partidas para el código ${searchCode}`,
        items: items,
        seleccionado: null
      }
    },

    // Maneja la selección de una partida del diálogo
    confirmarSeleccionPartida () {
      if (!this.dialogoPartidas.seleccionado) {
        store.dispatch('snackbar/mostrar', 'Debe seleccionar una partida', { color: 'warning' })
        return
      }
      
      const itemSeleccionado = this.dialogoPartidas.items.find(
        item => item.IdOrdendetalle === this.dialogoPartidas.seleccionado
      )
      
      if (itemSeleccionado) {
        this.seleccionarItem(itemSeleccionado)
      }
      
      this.dialogoPartidas.mostrar = false
    },
    
    // Maneja la selección de un ítem
    seleccionarItem (item) {
      console.log('Item seleccionado:', item)
      this.selectedItem = item
      this.mostrandoCampoCantidad = true
      this.cantidadArticulo = 1
      this.$nextTick(() => this.$refs.cantidadArticulo?.focus())
    },

    cancelarIngreso () {
      this.mostrandoCampoPartida = false
      this.mostrandoCampoCantidad = false
      this.selectedItem = null
      this.barcodeArticulo = ''
      this.partidaArticulo = ''
      this.cantidadArticulo = 1
      this.itemsEncontrados = []
      this.$nextTick(() => this.$refs.barcodeArticulo?.focus())
    },
    actualizarValidacion (item) {
      item.validado = item.CantidadSalida === item.Unidades
    },
    chipColor (item) {
      return item.CantidadSalida === item.Unidades ? 'green' : 'red'
    },
    rowClass (item) {
      return item.CantidadSalida === item.Unidades ? 'correct-row' : 'incorrect-row'
    },
    resetearEstado () {
      this.pedirCantidadBultos = false
      this.cantidadBultos = 0
    }
  }
}
</script>

<style scoped>
.icono-atras-negro {
  color: #191919 !important;
}

.remito-container {
  font-family: 'DM Sans', sans-serif;
  font-size: 14px;
  padding: 32px;
  background-color: #fff;
  color: #333;
}

.remito-titulo {
  text-align: center;
  font-size: 20px;
  margin-bottom: 24px;
  font-weight: bold;
  letter-spacing: 1px;
}

.remito-box {
  border: 1px solid #ccc;
  padding: 20px 24px;
  margin-bottom: 30px;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.remito-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  font-weight: 500;
}

.remito-table {
  width: 100%;
  border: 1px solid #aaa;
  border-radius: 4px;
  overflow: hidden;
}

.remito-table th {
  background-color: #efefef;
  font-weight: 600;
  text-transform: uppercase;
}

.remito-table th,
.remito-table td {
  border: 1px solid #ccc;
  padding: 8px 12px;
  text-align: left;
}
.correct-row {
  background-color: #e8f5e9;
}
.incorrect-row {
  background-color: #ffebee;
}

.remito-actions {
  margin-top: 28px;
  display: flex;
  gap: 12px;
}


@media print {
  .no-print {
    display: none !important;
  }

  .remito-container {
    padding: 0;
    color: #000;
    background: white;
    font-size: 12pt;
  }

  .remito-box {
    border: none;
    box-shadow: none;
    padding: 0 0 16px 0;
  }

  .remito-table {
    page-break-inside: auto;
  }

}
</style>

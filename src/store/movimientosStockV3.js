import API from 'vue-lsi-util/APIAccesoV2'

const movimientosStockV3 ={


    async conciliarMovimientosStock(id, modalidad) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/conciliarStock/${id}/${modalidad}`, Metodo: "Post"})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async eliminarMovimientoStock(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/eliminarMovimientoStock/${id}`, Metodo: "Post"})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                })
            }
        )            
    },
    
    async getMovimientoByOrdenBarcodeAndEmpresa(id, orden,barcode) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/movimientos/getMovimientoByOrdenBarcodeAndEmpresa/${id}/${orden}/${barcode}`})
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                })
            }
        )            
    },
    async createMovimientoStock(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: '/movimientos/crearMovimiento',
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Movimiento de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async validaMovimientoStock(idOrden, idEmpresa, barrcodes) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/movimientos/validaMovimiento/${idOrden}/${idEmpresa}/${barrcodes}`,
                    Metodo: "POST",
                    Cartel: "Validando Movimientos de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async validarMovimientos(comprobante, idEmpresa, barrcodes) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/movimientos/validarMovimientos/${comprobante}/${idEmpresa}/${barrcodes}`,
                    Metodo: "POST",
                    Cartel: "Validando Movimientos de Stock"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) 
                console.log(puteada)})
            }
        )            
    },

    async informarIngresoStock(payload) {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/movimientos/informarIngresoStock`, Metodo: "Put", Cartel: "Enviando E-Mail al Cliente", Body: payload})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      },

    /**
     * Crea un movimiento de stock por partida
     *
     * CONTRATO:
     * - Retorna: respuesta (objeto con status, mensaje, data)
     * - Éxito: respuesta.status === "SUCCESS" → resolve(respuesta)
     * - Error: respuesta.status === "ERROR" → reject con mensaje de negocio
     * - Error técnico: sin respuesta del backend → reject con error técnico
     *
     * ESTRUCTURA DE RESPUESTA EXITOSA:
     * {
     *   status: "SUCCESS",
     *   mensaje: "Stock actualizado para partida...",
     *   data: {
     *     movimiento: { Id: 1009293, ... },
     *     partida: { Id: 39, Partida: "2615---jesus6", Stock: 576 }
     *   }
     * }
     * 
     * ESTRUCTURA DE RESPUESTA DE ERROR:
     * {
     *   status: "ERROR",
     *   error: "PRODUCTO_NO_EXISTE",
     *   mensaje: "El producto con barcode ... no existe",
     *   data: null
     * }
     */
    async createMovimientoStockPartida(payload) {
        console.group('📦 Ingreso Stock por Partida');
        console.log('Endpoint:', 'POST /apiv3/movimientos/ingresoStockPartida');
        console.log('Payload enviado:', JSON.stringify(payload, null, 2));
        console.groupEnd();
        
        return new Promise((resolve, reject) => {
            API.acceder({
                Ruta: '/movimientos/ingresoStockPartida',
                Metodo: "POST",
                Body: payload,
                Cartel: "Creando Ingreso de Stock por Partida"
            })
            .then(respuesta => {
                console.group('✅ Respuesta del Backend');
                console.log('Status:', respuesta?.status);
                console.log('Mensaje:', respuesta?.mensaje);
                console.log('Data:', respuesta?.data);
                console.groupEnd();

                if (respuesta?.status === 'SUCCESS') {
                    console.log('✅ Operación exitosa:', respuesta?.mensaje);
                    resolve(respuesta);
                    return;
                }

                const businessError = new Error(respuesta?.mensaje || 'Error de negocio desconocido');
                businessError.type = 'BUSINESS_ERROR';
                businessError.error = respuesta?.error;
                businessError.data = respuesta;
                console.log('❌ Error de negocio:', businessError.message);
                reject(businessError);
            })
            .catch(error => {
                console.group('❌ Error HTTP');
                console.log('Error completo:', error);

                if (!(error && error.response)) {
                    console.log('Error sin respuesta del servidor');
                    console.groupEnd();
                    const technicalError = new Error('Error técnico');
                    technicalError.type = 'TECHNICAL_ERROR';
                    technicalError.originalError = error;
                    reject(technicalError);
                    return;
                }

                console.log('Status HTTP:', error.response.status);
                console.log('Response data:', error.response.data);
                console.groupEnd();

                const backendData = error.response.data;

                if (backendData?.status === 'ERROR') {
                    const errorMessage = error.response.data.mensaje || 'Error de negocio desconocido';
                    const businessError = new Error(errorMessage);
                    businessError.type = 'BUSINESS_ERROR';
                    businessError.error = backendData?.error;
                    businessError.data = backendData;

                    console.log('❌ Error de negocio:', errorMessage);
                    reject(businessError);
                    return;
                }

                reject(error);
            });
        });
    },

}

export default  movimientosStockV3 

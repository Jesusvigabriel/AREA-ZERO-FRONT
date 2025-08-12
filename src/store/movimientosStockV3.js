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
     * - Retorna: response.data (objeto con status, mensaje, data)
     * - Éxito: HTTP 2xx → resolve(response.data)
     * - Error: error.response.data.status === "ERROR" → reject con mensaje de negocio
     * - Error técnico: sin respuesta estructurada del backend → reject con error técnico
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
            .then(response => {
                console.group('✅ Respuesta del Backend');
                console.log('HTTP Status:', response?.status);
                console.log('Data:', response?.data);
                console.groupEnd();

                // Éxito HTTP: resolver con data
                if (response?.status >= 200 && response?.status < 300) {
                    console.log('✅ Operación exitosa:', response?.data?.mensaje);
                    resolve(response?.data);
                    return;
                }

                // Cualquier otro status HTTP se considera error técnico
                const technicalError = new Error('Error técnico en la comunicación');
                technicalError.type = 'TECHNICAL_ERROR';
                technicalError.originalResponse = response;
                technicalError.status = response?.status;
                console.log('❌ Error técnico: Respuesta inesperada');
                reject(technicalError);
            })
            .catch(error => {
                console.group('❌ Error HTTP');
                console.log('Error completo:', error);
                console.log('Status HTTP:', error?.response?.status);
                console.log('Response data:', error?.response?.data);
                console.groupEnd();

                const backendData = error?.response?.data;

                if (backendData?.status === 'ERROR') {
                    const errorMessage = backendData?.mensaje || 'Error de negocio desconocido';
                    const businessError = new Error(errorMessage);
                    businessError.type = 'BUSINESS_ERROR';
                    businessError.error = backendData?.error;
                    businessError.data = backendData;

                    console.log('❌ Error de negocio:', errorMessage);
                    reject(businessError);
                    return;
                }

                // Sin respuesta estructurada del backend → Error técnico
                const technicalError = new Error('Error técnico en la comunicación');
                technicalError.type = 'TECHNICAL_ERROR';
                technicalError.originalError = error;
                technicalError.status = error?.response?.status;
                console.log('❌ Error técnico');
                reject(technicalError);
            });
        });
    },

}

export default  movimientosStockV3 

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
     * - Éxito: response.data.status === "SUCCESS" → resolve(response.data)
     * - Error: response.data.status === "ERROR" → reject con mensaje de negocio
     * - Error HTTP: problemas de red/servidor → reject con error técnico
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
                console.log('Response.data:', response.data);
                console.log('Status lógico:', response.data?.status);
                console.groupEnd();
                
                // CONTRATO: Verificar status lógico del backend
                if (response.data && response.data.status === 'ERROR') {
                    // Error de negocio - rechazar con mensaje del backend
                    const errorMessage = response.data.mensaje || 'Error de negocio desconocido';
                    const businessError = new Error(errorMessage);
                    businessError.type = 'BUSINESS_ERROR';
                    businessError.error = response.data.error;
                    businessError.data = response.data;
                    
                    console.log('❌ Error de negocio:', errorMessage);
                    reject(businessError);
                    return;
                }
                
                if (response.data && response.data.status === 'SUCCESS') {
                    // Éxito - resolver con response.data
                    console.log('✅ Operación exitosa:', response.data.mensaje);
                    resolve(response.data);
                    return;
                }
                
                // Si no tiene status, tratar como warning pero continuar
                console.warn('⚠️ Respuesta sin status definido, asumiendo éxito');
                resolve(response.data || {});
            })
            .catch(error => {
                console.group('❌ Error HTTP');
                console.log('Error completo:', error);
                console.log('Status HTTP:', error?.response?.status);
                console.log('Response data:', error?.response?.data);
                console.groupEnd();

                // Primero, verificar si el backend respondió con un error estructurado
                const backendStatus = error?.response?.data?.status;
                if (backendStatus === 'ERROR') {
                    const errorMessage = error?.response?.data?.mensaje || 'Error de negocio desconocido';
                    const businessError = new Error(errorMessage);
                    businessError.type = 'BUSINESS_ERROR';
                    businessError.error = error?.response?.data?.error;
                    businessError.data = error?.response?.data;

                    console.log('❌ Error de negocio:', errorMessage);
                    reject(businessError);
                    return;
                }

                const httpStatus = error?.response?.status;

                // Cualquier status HTTP >= 400 se considera error técnico si no hay error de negocio
                if (httpStatus >= 400) {
                    const technicalError = new Error('Error técnico en la comunicación');
                    technicalError.type = 'TECHNICAL_ERROR';
                    technicalError.originalError = error;
                    technicalError.status = httpStatus;

                    console.log(`❌ Error técnico (${httpStatus}): Problema de comunicación`);
                    reject(technicalError);
                    return;
                }

                // Errores sin status HTTP (problemas de red, etc.)
                const technicalError = new Error('Error técnico en la comunicación');
                technicalError.type = 'TECHNICAL_ERROR';
                technicalError.originalError = error;
                technicalError.status = httpStatus;

                console.log('❌ Error técnico: Problema de comunicación');
                reject(technicalError);
            });
        });
    },

}

export default  movimientosStockV3 

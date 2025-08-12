import API from 'vue-lsi-util/APIAccesoV2'

const facturacion = {
    async generarNueva(idEmpresa, importeAFacturar, hashExcel, tipoServicio, periodoFacturado, guias=[]) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/facturas/generarNueva`,
                    Metodo: "POST",
                    Body: {idEmpresa, importeAFacturar, hashExcel, tipoServicio, periodoFacturado, guias},
                    Cartel: "Registrando orden de facturación"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },
}

export default facturacion
import API from 'vue-lsi-util/APIAccesoV2'

const destinos= {
    async getOneById(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({Ruta: `/destinos/getOneById/${id}`, Cartel: `Obteniendo destino de la orden ${id}...`})
                .then(data => {
                    resolve(data)
                })
                .catch(puteada => { 
                    reject(puteada) 
                })
            }
        )            
    },
}

export default destinos
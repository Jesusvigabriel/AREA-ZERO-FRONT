import API from 'vue-lsi-util/APIAccesoV2'

const roles = {
 

    async getAll() {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/roles/getAll`, Cartel: "Obteniendo Roles"})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      }, 
      
      

      async saveRol(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/rol/newOne`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Rol"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },




    async editRol(id, payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/rol/editOneById/${id}`,
                    Metodo: "PATCH",
                    Body: payload,
                    Cartel: "Editando Rol"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
      },



      async saveUserRol(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/usersrol/newOne`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Rol de Usuario"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getUserRolesById(id) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/usersrol/getUserRolesById/${id}`,
                    Metodo: "GET",
                    Cartel: "Obteniendo Roles de Usuario"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async deleteRol(idUsuario, idRol) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/usersrol/eliminarRol/${idUsuario}/${idRol}`
                API.acceder({Ruta, Metodo: "DELETE"})
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },



    async getAllMenu() {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/opcionesmenu/getAll`, Cartel: "Obteniendo Opciones de Menu"})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      },


      async deleteMenuRol(idRol) {
        return new Promise (
            function (resolve, reject) {
                const Ruta=`/menurol/eliminarMenuRoles/${idRol}`
                API.acceder({Ruta, Metodo: "DELETE"})
                .then(data => {resolve(data)})
                .catch(puteada => {reject(puteada)})
            }
        )            
    },


    async saveMenuRol(payload) {
        return new Promise (
            function (resolve, reject) {
                API.acceder({
                    Ruta: `/menurol/newOne`,
                    Metodo: "PUT",
                    Body: payload,
                    Cartel: "Creando Menu para el Rol"
                })
                .then(data => {resolve(data)})
                .catch(puteada => { reject(puteada) })
            }
        )            
    },

    async getAllMenuRol(idRol) {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/menuroles/getAllMenuRol/${idRol}`, Cartel: "Obteniendo Opciones de Menu para el Rol"})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      },


      async getAllMenuUser(idUsuario) {
        return new Promise (
          function (resolve, reject) {
            API.acceder({Ruta: `/menuser/getAllMenuUser/${idUsuario}`, Cartel: "Obteniendo Opciones de Menu para el Usuario"})
            .then(response => {resolve(response)})
            .catch(puteada => {reject(puteada)})
          }
        )            
      },
           
  }
    

export default roles
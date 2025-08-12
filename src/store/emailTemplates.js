import API from 'vue-lsi-util/APIAccesoV2'

const emailTemplates = {
    async getAll() {
        const logPrefix = '[GET] emailTemplates';
        const start = Date.now();
        console.group(logPrefix);
        try {
            // GET /emailTemplates/byEmpresa/:idEmpresa (plural para listados)
            const url = '/emailTemplates/byEmpresa/0'; // 0 o el ID de empresa si está disponible
            console.log('📡 URL:', url);
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            
            // Manejar la respuesta del servidor
            let result = [];
            if (response && typeof response === 'object') {
                // Si la respuesta tiene un campo 'data' (formato {status, data, errors})
                if (Array.isArray(response.data)) {
                    result = response.data;
                } 
                // Si la respuesta es directamente un array
                else if (Array.isArray(response)) {
                    result = response;
                }
            }
            
            console.log(`✅ ${result.length} plantillas (${Date.now() - start}ms)`, result);
            console.groupEnd();
            return result;
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
            console.groupEnd();
            throw error;
        }
    },

    async getByType(tipo) {
        const logPrefix = `[GET] emailTemplate/${tipo}`;
        const start = Date.now();
        console.group(logPrefix);
        try {
            const url = `/emailTemplate/${tipo}`;
            console.log('🔍 Buscando plantilla...');
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            
            // Manejar la respuesta del servidor
            let result = null;
            if (response && typeof response === 'object') {
                // Si la respuesta tiene un campo 'data' (formato {status, data, errors})
                if (response.data && typeof response.data === 'object') {
                    result = response.data;
                } 
                // Si la respuesta es directamente el objeto de plantilla
                else if (response.Id) {
                    result = response;
                }
            }
            
            const status = result ? '✅ Encontrada' : '⚠️ No encontrada';
            console.log(`${status} (${Date.now() - start}ms)`, result);
            console.groupEnd();
            return result;
        } catch (error) {
            console.error('❌ Error:', error.response?.data || error.message);
            console.groupEnd();
            if (error.response?.status === 404) return null;
            throw error;
        }
    },

    getByCode(codigo) {
        console.log(`[emailTemplates] [getByCode] Redirigiendo a getByType:`, codigo);
        return this.getByType(codigo);
    },

    async getByEmpresa(idEmpresa) {
        const logPrefix = `[GET] emailTemplates/empresa/${idEmpresa}`;
        const start = Date.now();
        console.group(logPrefix);
        try {
            // GET /emailTemplates/byEmpresa/:idEmpresa (plural para listados)
            const url = `/emailTemplates/byEmpresa/${idEmpresa}`;
            console.log('🏢 Buscando plantillas...');
            const response = await API.acceder({ Ruta: url, Metodo: 'GET' });
            
            // Manejar la respuesta del servidor
            let result = [];
            if (response && typeof response === 'object') {
                // Si la respuesta tiene un campo 'data' (formato {status, data, errors})
                if (Array.isArray(response.data)) {
                    result = response.data;
                } 
                // Si la respuesta es directamente un array
                else if (Array.isArray(response)) {
                    result = response;
                }
            }
            
            console.log(`✅ ${result.length} plantillas (${Date.now() - start}ms)`, result);
            console.groupEnd();
            return result;
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            if (error.response?.status === 404) return [];
            throw error;
        }
    },

    async save(template) {
        const isUpdate = !!template.Id;
        const logPrefix = `[emailTemplates] [${isUpdate ? 'update' : 'create'}]`;
        console.group(logPrefix);
        try {
            const url = `/emailTemplates${isUpdate ? `/${template.Id}` : ''}`;
            const method = isUpdate ? 'PATCH' : 'POST';
            const requestData = {
                Tipo: template.Tipo,
                Titulo: template.Titulo,
                Cuerpo: template.Cuerpo,
                Activo: template.Activo !== false
            };
            
            console.log(`${logPrefix} ${method}:`, url);
            console.log(`${logPrefix} Data:`, { ...requestData, Cuerpo: '...' });
            
            const response = await API.acceder({
                Ruta: url,
                Metodo: method,
                Body: requestData
            });
            
            const result = response?.data || response;
            console.log(`${logPrefix} OK:`, { id: result.Id, tipo: result.Tipo });
            console.groupEnd();
            return result;
            
        } catch (error) {
            console.error(`${logPrefix} Error:`, error.response?.data || error.message);
            console.groupEnd();
            throw error;
        }
    },

    async setActive(id, activo) {
        const log = `[emailTemplates] [setActive] ${activo ? 'Activando' : 'Desactivando'} ${id}`;
        console.log(log);
        const response = await API.acceder({
                // PUT /emailTemplate/activate/:id/:activo
                Ruta: `/emailTemplates/activate/${id}/${activo}`,
            Metodo: 'PATCH'
        });
        return response?.data || response;
    },

    async delete(id) {
        console.log(`[emailTemplates] [delete] Eliminando ${id}`);
        await API.acceder({
                Ruta: `/emailTemplates/${id}`,
            Metodo: 'DELETE'
        });
        return true;
    },

    async uploadImage(file) {
        const log = `[emailTemplates] [uploadImage] ${file.name} (${(file.size / 1024).toFixed(1)}KB)`;
        console.log(log);
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await API.acceder({
            Ruta: '/upload',
            Metodo: 'POST',
            Body: formData,
            Headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        const url = response?.data?.url || response?.url;
        console.log(`${log} - OK:`, url?.substring(0, 50) + '...');
        return url;
    }
};

export default { ...emailTemplates };

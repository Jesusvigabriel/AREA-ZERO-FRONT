#!/bin/bash

# Actualizar los tres botones de Excel en el archivo AlmacenajePorPeriodo.vue
sed -i 's/<v-icon>mdi-microsoft-excel<\/v-icon>/<excel-icon style="width: 20px; height: 20px; margin-left: 8px;" \/>/g' "/home/jvigabriel/PROYECTOS AREATECH/dev-areatech/DEMO-AREATECH-FRONTEND/src/views/Informes/AlmacenajePorPeriodo.vue"

echo "Los íconos de Excel han sido actualizados correctamente."

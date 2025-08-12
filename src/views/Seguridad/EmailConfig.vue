<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6">
        <SelectorEmpresa 
          ref="empresaSelector"
          @eligioEmpresa="onEmpresaSelected" 
          :idEmpresaInicialmenteSeleccionada="selectedEmpresa"
        />
      </v-col>
    </v-row>
    <v-form ref="form">
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Nombre" label="Nombre" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Host" label="Host" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Puerto" label="Puerto" type="number" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Usuario" label="Usuario" />
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="emailServer.Password" label="Password" type="password" />
        </v-col>
        <v-col cols="12" md="4">
          <v-checkbox v-model="emailServer.SSL" label="Usar SSL/TLS" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field v-model="emailServer.EmailDesde" label="Email Desde" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field v-model="emailServer.NombreDesde" label="Nombre Desde" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="d-flex">
          <v-btn color="primary" class="mr-2" @click="saveServer">Guardar</v-btn>
          <v-btn color="error" class="mr-2" @click="deleteServer">Eliminar</v-btn>
          <v-btn color="success" @click="testServer">Probar</v-btn>
        </v-col>
      </v-row>
    </v-form>

    <v-row class="mt-8">
      <v-col cols="12">
        <v-card class="elevation-3">
          <v-card-title class="d-flex align-center">
            <span>Plantillas de Correo</span>
            <v-spacer></v-spacer>
            <v-btn 
              color="primary" 
              @click="createTemplate"
              class="ml-2"
              :disabled="!selectedEmpresa"
            >
              <v-icon left>mdi-plus</v-icon>
              Nueva Plantilla
            </v-btn>
          </v-card-title>
          
          <v-card-text>
            <v-row>
              <v-col cols="12" md="8">
                <v-select
                  v-model="selectedTemplate"
                  :items="templates"
                  item-text="Titulo"
                  item-value="Id"
                  label="Seleccionar Plantilla"
                  :loading="loadingTemplates"
                  :disabled="!templates.length"
                  return-object
                  outlined
                  dense
                  clearable
                  hide-details
                  @change="onTemplateSelected"
                >
                  <template v-slot:selection="{ item }">
                    <v-list-item class="pa-0">
                      <v-list-item-content class="py-0">
                        <v-list-item-title>{{ item.Titulo }}</v-list-item-title>
                        <v-list-item-subtitle class="caption">
                          {{ item.Tipo }} • {{ item.Activo ? 'Activa' : 'Inactiva' }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </template>
                  
                  <template v-slot:item="{ item }">
                    <v-list-item-content>
                      <v-list-item-title>{{ item.Titulo }}</v-list-item-title>
                      <v-list-item-subtitle class="caption">
                        {{ item.Tipo }} • {{ item.Activo ? 'Activa' : 'Inactiva' }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-icon @click.stop="editTemplate(item)">mdi-pencil</v-icon>
                    </v-list-item-action>
                  </template>
                </v-select>
              </v-col>
              
              <v-col cols="12" md="4" class="d-flex align-center">
                <v-btn 
                  color="primary" 
                  outlined 
                  class="mr-2" 
                  :disabled="!selectedTemplate"
                  @click="editTemplate(selectedTemplate)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  Editar
                </v-btn>
                <v-btn 
                  color="primary" 
                  outlined 
                  :disabled="!selectedTemplate"
                  @click.stop="previewTemplate()"
                  :loading="loadingPreview"
                >
                  <v-icon left>mdi-eye</v-icon>
                  Vista Previa
                </v-btn>
              </v-col>
            </v-row>
            
            <v-alert
              v-if="!loadingTemplates && !templates.length"
              type="info"
              class="mt-4"
              outlined
              dense
            >
              No hay plantillas disponibles para esta empresa. Crea una nueva plantilla para comenzar.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="templateDialog" max-width="1200px" fullscreen hide-overlay transition="dialog-bottom-transition" persistent>
      <v-card>
        <v-toolbar dark color="primary">
          <v-toolbar-title>
            <v-icon left>mdi-email-edit</v-icon>
            {{ template.Id ? 'Editar' : 'Nueva' }} Plantilla de Email
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon dark v-bind="attrs" v-on="on" @click="toggleHtmlView" class="mr-1">
                  <v-icon>{{ showHtmlView ? 'mdi-eye-off' : 'mdi-code-tags' }}</v-icon>
                </v-btn>
              </template>
              <span>{{ showHtmlView ? 'Ocultar código HTML' : 'Ver código HTML' }}</span>
            </v-tooltip>
            
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon dark v-bind="attrs" v-on="on" @click="previewTemplate" class="mr-1">
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </template>
              <span>Vista previa</span>
            </v-tooltip>
            
            <v-divider vertical class="mx-2" style="border-color: rgba(255,255,255,0.2)"></v-divider>
            
            <v-tooltip top>
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon dark v-bind="attrs" v-on="on" @click="closeTemplate">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </template>
              <span>Cerrar</span>
            </v-tooltip>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field 
                v-model="template.Tipo" 
                label="Tipo" 
                outlined
                dense
                class="mb-4"
              />
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field 
                v-model="template.Titulo" 
                label="Título" 
                outlined
                dense
                class="mb-4"
              />
            </v-col>
          </v-row>

          <v-tabs v-model="activeTab" grow>
            <v-tab>Editor</v-tab>
            <v-tab>Vista Previa</v-tab>
            <v-tab>Variables</v-tab>
          </v-tabs>

          <v-tabs-items v-model="activeTab">
            <v-tab-item>
              <quill-editor
                v-if="!showHtmlView"
                ref="editor"
                v-model="template.Cuerpo"
                :options="editorOptions"
                class="mt-4"
              />
              <v-textarea
                v-else
                v-model="template.Cuerpo"
                label="HTML"
                outlined
                auto-grow
                rows="20"
                class="mt-4"
              ></v-textarea>
            </v-tab-item>
            
            <v-tab-item>
              <v-card flat class="mt-4 pa-4" style="min-height: 300px; border: 1px solid #e0e0e0;">
                <div v-html="previewContent"></div>
              </v-card>
            </v-tab-item>
            
            <v-tab-item>
              <v-card flat class="mt-4">
                <v-list>
                  <v-subheader>Variables Disponibles</v-subheader>
                  <v-list-item v-for="(desc, variable) in availableVariables" :key="variable">
                    <v-list-item-content>
                      <v-list-item-title>{{ variable }}</v-list-item-title>
                      <v-list-item-subtitle>{{ desc }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn 
                        small 
                        text 
                        color="primary" 
                        @click="insertVariable(variable)"
                      >
                        Insertar
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-tab-item>
          </v-tabs-items>

          <v-alert 
            v-if="showHtmlView"
            type="info" 
            text 
            dense
            class="mt-4"
          >
            Modo HTML activado. Puedes editar directamente el código HTML aquí.
          </v-alert>
          
          <small class="d-block mt-2">
            <v-icon small color="primary" class="mr-1">mdi-information</v-icon>
            Puede usar variables como {{ nombreDestino }}, {{ fecha }}, etc. Estas variables serán reemplazadas dinámicamente.
          </small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeTemplate">
            <v-icon left>mdi-close</v-icon> Cancelar
          </v-btn>
          <v-btn color="primary" @click="saveTemplate" :loading="savingTemplate">
            <v-icon left>mdi-content-save</v-icon> Guardar Plantilla
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Sección de reglas automáticas -->
    <EmailProcesoConfigSection
      v-if="selectedEmpresa"
      :id-empresa="selectedEmpresa"
      :servidores="emailServer && emailServer.Id ? [emailServer] : []"
      :plantillas="templates"
      :procesos="procesosPredefinidos"
      class="mt-8"
    />
  </v-container>
</template>

<script>
import SelectorEmpresa from '@/components/SelectorEmpresa.vue'
import EmailProcesoConfigSection from '@/components/EmailProcesoConfigSection.vue'
import emailServers from '@/store/emailServers'
import emailTemplates from '@/store/emailTemplates'
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.snow.css'
import { mapGetters } from 'vuex'

// Configuración por defecto del servidor de correo
const defaultEmailServerConfig = () => ({
  Nombre: '',
  Host: '',
  Puerto: '587', // Puerto SMTP por defecto
  Usuario: '',
  Password: '',
  SSL: false,
  EmailDesde: '',
  NombreDesde: ''
})

export default {
  name: 'EmailConfig',
  components: { 
    SelectorEmpresa, 
    EmailProcesoConfigSection,
    quillEditor,
    // Asegúrate de que LSIDialog esté importado y registrado correctamente
    // LSIDialog: () => import('@/components/LSIDialog.vue')
  },
  data () {
    return {
      procesosPredefinidos: [
        { text: 'ENVIO_REMITO', value: 'ENVIO_REMITO' },
        { text: 'GUIA_TRACKING', value: 'GUIA_TRACKING' },
        { text: 'ORDEN_ETIQUETA', value: 'ORDEN_ETIQUETA' },
        { text: 'INGRESO_STOCK', value: 'INGRESO_STOCK' },
      ],
      selectedEmpresa: null,
      selectedTemplate: null,
      loadingTemplates: false,
      previewContent: '', // Nueva propiedad reactiva para la vista previa
      fecha: new Date().toLocaleDateString(),
      nombreDestino: 'Usuario',
      emailServer: defaultEmailServerConfig(),
      templates: [],
      templateHeaders: [
        { text: 'Código', value: 'Codigo' },
        { text: 'Asunto', value: 'Asunto' },
        { text: 'Activo', value: 'Activo' },
        { text: '', value: 'acciones' }
      ],
      templateDialog: false,
      savingTemplate: false,
      loadingTemplates: false,
      loadingPreview: false,
      activeTab: 0,
      showHtmlView: false,
      template: {
        Id: null,
        Tipo: '',       // Reemplaza a Codigo
        Titulo: '',     // Reemplaza a Asunto
        Cuerpo: '',     // Contenido HTML
        CuerpoHtml: '', // Compatibilidad con versiones previas
        Activo: true
      },
      availableVariables: {
        '{{nombreCliente}}': 'Nombre completo del cliente',
        '{{emailCliente}}': 'Correo electrónico del cliente',
        '{{fechaActual}}': 'Fecha actual en formato local',
        '{{numeroPedido}}': 'Número de pedido',
        '{{totalPedido}}': 'Total del pedido',
        '{{listaProductos}}': 'Lista de productos en formato tabla',
        '{{enlaceSeguimiento}}': 'Enlace para seguimiento del envío',
        '{{direccionEnvio}}': 'Dirección de envío completa'
      },
      editorOptions: {
        modules: {
          toolbar: {
            container: [
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'font': [] }],
              [{ 'align': [] }],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'indent': '-1'}, { 'indent': '+1' }],
              ['link', 'image', 'video'],
              ['clean'],
              ['code-block'],
              ['html']
            ],
            handlers: {
              image: function() {
                const self = this;
                const input = document.createElement('input');
                input.setAttribute('type', 'file');
                input.setAttribute('accept', 'image/*');
                input.click();
                
                input.onchange = async function() {
                  const file = input.files[0];
                  if (!file) return;

                  try {
                    const url = await emailTemplates.uploadImage(file);
                    const quill = self.$refs.editor.quill;
                    const range = quill.getSelection(true);
                    quill.insertEmbed(range.index, 'image', url, 'user');
                  } catch (e) {
                    console.error('Error al subir la imagen:', e);
                    self.$toast.error('Error al subir la imagen');
                  }
                };
              },
              html: function() {
                this.showHtmlView = !this.showHtmlView
              }.bind(this)
            }
          },
          clipboard: {
            matchVisual: false
          }
        },
        placeholder: 'Escribe el contenido del correo aquí...',
        theme: 'snow',
        formats: [
          'header', 'font', 'size',
          'bold', 'italic', 'underline', 'strike', 'blockquote',
          'list', 'bullet', 'indent',
          'link', 'image', 'video',
          'code-block', 'color', 'background', 'align'
        ]
      }
    }
  },
  computed: {
    previewContent() {
      // Reemplazar variables de ejemplo con datos reales para la vista previa
      let content = this.template.Cuerpo || ''
      const previewData = {
        '{{nombreCliente}}': 'Juan Pérez',
        '{{emailCliente}}': 'juan.perez@ejemplo.com',
        '{{fechaActual}}': new Date().toLocaleDateString(),
        '{{numeroPedido}}': 'PED-' + Math.floor(1000 + Math.random() * 9000),
        '{{totalPedido}}': '$1,234.56',
        '{{listaProductos}}': `
          <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
            <tr style="background-color: #f5f5f5;">
              <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
              <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Cantidad</th>
              <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Precio</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ddd;">Producto de Ejemplo</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">2</td>
              <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$500.00</td>
            </tr>
          </table>
        `,
        '{{enlaceSeguimiento}}': '<a href="#" style="color: #1976d2; text-decoration: none;">Seguir mi pedido</a>',
        '{{direccionEnvio}}': 'Av. Siempreviva 123, Piso 4, CABA, Argentina'
      }
      
      Object.entries(previewData).forEach(([key, value]) => {
        content = content.replace(new RegExp(this.escapeRegExp(key), 'g'), value)
      })
      
      return content
    }
  },
  methods: {
    escapeRegExp(string) {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    },
    
    getDefaultEmailServerConfig() {
      return defaultEmailServerConfig()
    },
    
    toggleHtmlView() {
      this.showHtmlView = !this.showHtmlView
    },
    
    async previewTemplate(templateToPreview = null) {
      console.log('=== previewTemplate ===');
      console.log('templateToPreview:', templateToPreview);
      
      try {
        this.loadingPreview = true;
        
        // Si no hay plantilla para previsualizar y no hay una seleccionada, mostrar error
        if (!templateToPreview && !this.selectedTemplate) {
          this.$toast.warning('No hay plantilla seleccionada para previsualizar');
          return;
        }
        
        // Obtener la plantilla a previsualizar
        const template = templateToPreview || this.selectedTemplate;
        
        if (!template) {
          console.warn('No hay plantilla disponible para previsualizar');
          this.$toast.warning('No se pudo cargar la plantilla para previsualizar');
          return;
        }
        
        console.log('Usando plantilla para vista previa:', { 
          id: template.Id, 
          titulo: template.Titulo,
          tieneCuerpo: !!template.Cuerpo,
          tieneCuerpoHtml: !!template.CuerpoHtml
        });
        
        // Copiar la plantilla al template de edición
        this.template = { ...template };
        
        // Abrir el diálogo si no está abierto
        if (!this.templateDialog) {
          this.templateDialog = true;
          // Esperar a que el diálogo se abra completamente
          await this.$nextTick();
        }
        
        // Obtener el contenido para la vista previa
        let content = template.Cuerpo || template.CuerpoHtml || '';
        
        // Reemplazar variables en el contenido
        const previewData = {
          '{{nombreCliente}}': 'Juan Pérez',
          '{{emailCliente}}': 'juan.perez@ejemplo.com',
          '{{fechaActual}}': new Date().toLocaleDateString(),
          '{{numeroPedido}}': 'PED-' + Math.floor(1000 + Math.random() * 9000),
          '{{totalPedido}}': '$1,234.56',
          '{{listaProductos}}': `
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr style="background-color: #f5f5f5;">
                <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Producto</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Cantidad</th>
                <th style="padding: 8px; text-align: right; border: 1px solid #ddd;">Precio</th>
              </tr>
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">Producto de Ejemplo</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">2</td>
                <td style="padding: 8px; text-align: right; border: 1px solid #ddd;">$500.00</td>
              </tr>
            </table>
          `,
          '{{enlaceSeguimiento}}': '<a href="#" style="color: #1976d2; text-decoration: none;">Seguir mi pedido</a>',
          '{{direccionEnvio}}': 'Av. Siempreviva 123, Piso 4, CABA, Argentina'
        };
        
        Object.entries(previewData).forEach(([key, value]) => {
          const regex = new RegExp(this.escapeRegExp(key), 'g');
          content = content.replace(regex, value);
        });
        
        console.log('Contenido procesado para vista previa:', content.substring(0, 100) + '...');
        
        // Actualizar el contenido de la vista previa
        this.previewContent = content;
        
        // Cambiar a la pestaña de vista previa
        this.activeTab = 1;
        console.log('Vista previa actualizada, activeTab:', this.activeTab);
        
        // Forzar actualización del componente de pestañas
        await this.$nextTick();
        
      } catch (error) {
        console.error('Error al generar la vista previa:', error);
        this.$toast.error('Error al generar la vista previa');
      } finally {
        this.loadingPreview = false;
      }
    },
    
    insertVariable(variable) {
      if (this.showHtmlView) {
        // Insertar en modo HTML
        const textarea = this.$el.querySelector('textarea')
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const before = text.substring(0, start)
        const after = text.substring(end, text.length)
        
        this.template.Cuerpo = before + variable + after
        
        // Mover el cursor después de la variable insertada
        this.$nextTick(() => {
          const newPos = start + variable.length
          textarea.setSelectionRange(newPos, newPos)
          textarea.focus()
        })
      } else {
        // Insertar en el editor Quill
        const quill = this.$refs.editor.quill
        const range = quill.getSelection()
        if (range) {
          quill.insertText(range.index, variable)
        } else {
          quill.insertText(0, variable)
        }
        quill.focus()
      }
      
      // Volver a la pestaña del editor
      this.activeTab = 0
    },
    
    async loadTemplates() {
      console.log('=== loadTemplates ===');
      
      if (!this.selectedEmpresa) {
        console.log('No hay empresa seleccionada');
        this.templates = [];
        this.selectedTemplate = null;
        this.previewContent = '';
        return;
      }
      
      try {
        this.loadingTemplates = true;
        console.log('Cargando plantillas para la empresa:', this.selectedEmpresa);
        
        const response = await emailTemplates.getByEmpresa(this.selectedEmpresa);
        console.log('Plantillas recibidas del servidor:', response);
        
        // Asegurarse de que response es un array
        this.templates = Array.isArray(response) ? response : [];
        
        // Si hay plantillas, seleccionar la primera por defecto
        if (this.templates.length > 0) {
          console.log(`Se encontraron ${this.templates.length} plantillas`);
          this.selectedTemplate = this.templates[0];
          console.log('Primera plantilla seleccionada:', this.selectedTemplate.Titulo);
          
          // Llamar a previewTemplate para procesar la vista previa
          this.previewTemplate(this.selectedTemplate);
        } else {
          console.log('No se encontraron plantillas');
          this.selectedTemplate = null;
          this.previewContent = '';
        }
        
      } catch (error) {
        console.error('Error al cargar plantillas:', error);
        this.$toast.error('Error al cargar las plantillas');
        this.templates = [];
        this.selectedTemplate = null;
        this.previewContent = '';
      } finally {
        this.loadingTemplates = false;
      }
    },
    
    onTemplateSelected(template) {
      console.log('=== onTemplateSelected ===');
      console.log('Plantilla seleccionada:', template);
      
      if (template) {
        this.selectedTemplate = template;
        this.previewTemplate(template);
      } else {
        this.selectedTemplate = null;
        this.previewContent = '';
      }
    },
    
    async toggleTemplateStatus(template) {
      try {
        await emailTemplates.setActive(template.Id, !template.Activo)
        // Actualizar el estado local
        const index = this.templates.findIndex(t => t.Id === template.Id)
        if (index !== -1) {
          this.templates[index].Activo = !template.Activo
        }
        this.$toast.success(`Plantilla ${!template.Activo ? 'activada' : 'desactivada'} correctamente`)
      } catch (error) {
        console.error('Error al cambiar el estado de la plantilla:', error)
        this.$toast.error('Error al actualizar la plantilla')
      }
    },
    
    confirmDeleteTemplate(template) {
      this.$swal({
        title: '¿Estás seguro?',
        text: `¿Deseas eliminar la plantilla "${template.Titulo}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      }).then(async (result) => {
        if (result.isConfirmed) {
          await this.deleteTemplate(template)
        }
      })
    },
    
    async deleteTemplate(template) {
      try {
        await emailTemplates.delete(template.Id)
        // Eliminar del array local
        this.templates = this.templates.filter(t => t.Id !== template.Id)
        this.$toast.success('Plantilla eliminada correctamente')
      } catch (error) {
        console.error('Error al eliminar la plantilla:', error)
        this.$toast.error('Error al eliminar la plantilla')
      }
    },
    
    closeTemplate() {
      this.templateDialog = false
      this.activeTab = 0
      this.showHtmlView = false
      // Resetear el formulario
      this.template = {
        Id: null,
        IdEmpresa: null,
        Tipo: '',
        Titulo: '',
        Cuerpo: '',
        CuerpoHtml: '',
        Activo: true
      }
    },
    
    createTemplate() {
      if (!this.selectedEmpresa) {
        this.$toast.warning('Por favor, seleccione una empresa primero');
        return;
      }
      
      this.template = {
        Id: null,
        IdEmpresa: this.selectedEmpresa,
        Tipo: '',
        Titulo: '',
        Cuerpo: '',
        CuerpoHtml: '',
        Activo: true
      };
      this.templateDialog = true;
      this.activeTab = 0; // Mostrar el editor por defecto
    },
    
    editTemplate(template) {
      if (!template) return;
      
      this.template = { ...template };
      this.templateDialog = true;
      this.activeTab = 0; // Mostrar el editor por defecto
      
      // Si la plantilla tiene CuerpoHtml pero no Cuerpo, usamos CuerpoHtml
      if (this.template.CuerpoHtml && !this.template.Cuerpo) {
        this.template.Cuerpo = this.template.CuerpoHtml;
      }
    },
    
    async saveTemplate() {
      if (!this.template.Tipo || !this.template.Titulo) {
        this.$toast.error('El tipo y el título son obligatorios')
        return
      }
      
      this.savingTemplate = true
      
      try {
        // Preparar los datos según el formato esperado por la API
        const templateData = {
          ...this.template,
          Cuerpo: this.template.Cuerpo || ''
        }
        
        // Guardar la plantilla
        const savedTemplate = await emailTemplates.save(templateData)
        
        // Actualizar la plantilla actual con la respuesta del servidor
        this.template = { ...savedTemplate }
        
        // Actualizar la lista de plantillas
        await this.loadTemplates()
        
        this.$toast.success('Plantilla guardada correctamente')
        this.templateDialog = false
      } catch (error) {
        console.error('Error al guardar la plantilla:', error)
        const errorMessage = error.response?.data?.error?.message || 'Error al guardar la plantilla'
        this.$toast.error(errorMessage)
      } finally {
        this.savingTemplate = false
      }
    },
    
    async onEmpresaSelected(id) {
      console.group('=== onEmpresaSelected ===')
      console.log('ID de empresa seleccionada:', id)
      // Cargar plantillas al seleccionar empresa
      await this.loadTemplates()
      
      if (!id) {
        console.log('No se proporcionó un ID de empresa')
        console.groupEnd()
        return
      }
      
      this.selectedEmpresa = id
      
      try {
        console.log('Obteniendo configuración del servidor...')
        console.time('getOne Server')
        const serverData = await emailServers.getOne(id)
        console.timeEnd('getOne Server')
        
        console.log('Respuesta del servidor (raw):', JSON.parse(JSON.stringify(serverData)))
        
        if (!serverData) {
          console.warn('No se recibió respuesta del servidor')
          this.emailServer = this.getDefaultEmailServerConfig()
          console.groupEnd()
          return
        }
        
        // Mapear las propiedades del servidor al formato esperado por el formulario
        // Para Gmail, si el puerto es 587, forzamos SSL: false ya que usa STARTTLS
        const port = serverData.Port ? parseInt(serverData.Port) : 587
        const useSSL = port === 465 // Solo SSL: true para puerto 465
        
        const mappedConfig = {
          Id: serverData.Id || serverData.ID || 1,
          Nombre: serverData.Nombre || 'Configuración de correo',
          Host: serverData.Host || '',
          Puerto: String(port),
          Usuario: serverData.Username || '',
          Password: serverData.Password || '',
          SSL: useSSL, // Solo true para puerto 465
          EmailDesde: serverData.FromEmail || '',
          NombreDesde: serverData.FromName || ''
        }
        
        console.log('Configuración mapeada:', JSON.parse(JSON.stringify({
          ...mappedConfig,
          Password: mappedConfig.Password ? '***' : ''
        })))
        
        this.emailServer = mappedConfig
        
      } catch (error) {
        console.error('Error al cargar configuración del servidor:', error)
        console.error('Detalles del error:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        })
        
        this.emailServer = this.getDefaultEmailServerConfig()
      }
      
      // Cargar plantillas
      try {
        console.log('Cargando plantillas para la empresa...')
        console.time('getTemplates')
        this.templates = await emailTemplates.getByEmpresa(id)
        console.timeEnd('getTemplates')
        console.log('Plantillas cargadas:', this.templates)
      } catch (error) {
        console.error('Error al cargar plantillas:', error)
        this.templates = []
      }
      
      console.log('Estado final de emailServer:', JSON.parse(JSON.stringify({
        ...this.emailServer,
        Password: this.emailServer.Password ? '***' : ''
      })))
      console.groupEnd()
    },
    async saveServer () {
      if (!this.selectedEmpresa) {
        console.error('No se ha seleccionado ninguna empresa')
        await this.$swal.fire({
          icon: 'warning',
          title: 'Empresa requerida',
          text: 'Por favor, seleccione una empresa antes de guardar.',
          confirmButtonColor: '#1976D2'
        })
        return
      }
      
      console.log('=== PAYLOAD GUARDAR SERVIDOR ===')
      console.log('Empresa ID:', this.selectedEmpresa)
      console.log('Datos del servidor:', JSON.parse(JSON.stringify(this.emailServer)))
      
      // Mostrar loading
      const loading = this.$swal.fire({
        title: 'Guardando configuración...',
        allowOutsideClick: false,
        didOpen: () => {
          this.$swal.showLoading()
        }
      })
      
      try {
        // Preparar los datos en el formato esperado por el backend
        const serverData = {
          Nombre: this.emailServer.Nombre || 'Configuración de correo',
          Host: this.emailServer.Host,
          Port: parseInt(this.emailServer.Puerto) || 587,
          Username: this.emailServer.Usuario,
          Password: this.emailServer.Password,
          Secure: this.emailServer.SSL || false,
          FromEmail: this.emailServer.EmailDesde,
          FromName: this.emailServer.NombreDesde
        }
        
        console.log('Enviando datos al servidor:', serverData)
        const result = await emailServers.save(this.selectedEmpresa, serverData)
        console.log('Respuesta del servidor (saveServer):', result)
        
        // Cerrar loading
        await loading.close()
        
        // Mostrar mensaje de éxito
        await this.$swal.fire({
          icon: 'success',
          title: '¡Guardado exitoso!',
          text: 'La configuración del servidor se ha guardado correctamente.',
          confirmButtonColor: '#4CAF50',
          timer: 3000,
          timerProgressBar: true
        })
        
      } catch (error) {
        console.error('Error al guardar el servidor:', error)
        
        // Cerrar loading si hay error
        if (loading && typeof loading.close === 'function') {
          await loading.close()
        }
        
        // Mostrar mensaje de error detallado
        let errorMessage = 'No se pudo guardar la configuración del servidor.'
        if (error.response) {
          // Si hay una respuesta del servidor con detalles del error
          errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`
          if (error.response.data && error.response.data.message) {
            errorMessage += `\n${error.response.data.message}`
          }
        } else if (error.request) {
          // Si la petición fue hecha pero no hubo respuesta
          errorMessage = 'No se recibió respuesta del servidor. Verifique su conexión a internet.'
        }
        
        await this.$swal.fire({
          icon: 'error',
          title: 'Error al guardar',
          html: errorMessage.replace(/\n/g, '<br>'),
          confirmButtonColor: '#f44336',
          confirmButtonText: 'Entendido'
        })
      }
    },
    async deleteServer () {
      if (!this.selectedEmpresa) {
        console.error('No se ha seleccionado ninguna empresa para eliminar')
        return
      }
      
      console.log('=== SOLICITUD DE ELIMINACIÓN ===')
      console.log('ID Empresa a eliminar:', this.selectedEmpresa)
      
      try {
        const result = await emailServers.delete(this.selectedEmpresa)
        console.log('Respuesta del servidor (deleteServer):', result)
        this.emailServer = {}
        this.$swal.fire({
          icon: 'success',
          title: '¡Eliminado!',
          text: 'La configuración del servidor se ha eliminado correctamente.'
        })
      } catch (error) {
        console.error('Error al eliminar el servidor:', error)
        this.$swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la configuración del servidor.'
        })
      }
    },
    async testServer () {
      console.log('=== INICIO PRUEBA DE CONEXIÓN ===')
      console.log('Empresa ID:', this.selectedEmpresa)
      console.log('Datos de conexión:', JSON.parse(JSON.stringify(this.emailServer)))
      
      if (!this.selectedEmpresa) {
        const errorMsg = 'No se ha seleccionado ninguna empresa'
        console.error(errorMsg)
        await this.$swal.fire({
          icon: 'warning',
          title: 'Seleccione una empresa',
          text: 'Debe seleccionar una empresa antes de probar la conexión.',
          confirmButtonColor: '#1976D2'
        })
        return
      }

      // Solicitar correo de destino para la prueba
      const { value: destinatario, isConfirmed } = await this.$swal.fire({
        title: 'Enviar correo de prueba',
        input: 'text',
        inputLabel: 'Correo(s) electrónico(s) de destino',
        inputPlaceholder: 'Ingrese uno o más correos separados por coma',
        inputValue: this.emailServer.Usuario, // Sugerir el correo del remitente
        showCancelButton: true,
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar al menos un correo electrónico'
          }
          // Validar formato de correos electrónicos
          const emails = value.split(',').map(email => email.trim())
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          const invalidEmails = emails.filter(email => !emailRegex.test(email))
          
          if (invalidEmails.length > 0) {
            return `Los siguientes correos no son válidos: ${invalidEmails.join(', ')}`
          }
          return null
        },
        confirmButtonText: 'Enviar prueba',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#4CAF50',
        cancelButtonColor: '#f44336',
        inputValidator: (value) => {
          if (!value) {
            return 'Debe ingresar un correo electrónico válido'
          }
        }
      })

      if (!isConfirmed || !destinatario) {
        console.log('Usuario canceló el envío de prueba')
        return
      }

      // Procesar múltiples correos electrónicos
      const destinatarios = destinatario.split(',').map(email => email.trim())
      console.log('Correos de prueba a enviar a:', destinatarios)
      
      // Mostrar loading
      const loading = this.$swal.fire({
        title: 'Enviando correo de prueba...',
        html: `Enviando a: ${destinatarios.join(', ')}`,
        allowOutsideClick: false,
        didOpen: () => {
          this.$swal.showLoading()
        }
      })
      
      try {
        // Actualizar la fecha antes de la prueba
        this.fecha = new Date().toLocaleDateString()
        
        console.log('Iniciando prueba de conexión con:', {
          host: this.emailServer.Host,
          port: this.emailServer.Puerto,
          secure: this.emailServer.SSL,
          usuario: this.emailServer.Usuario
        })
        
        // Enviar a cada destinatario individualmente
        const results = await Promise.all(
          destinatarios.map(async (to) => {
            try {
              console.log(`Enviando correo de prueba a: ${to}`)
              const response = await emailServers.test(this.selectedEmpresa, {
                ...this.emailServer,
                to // Incluir el destinatario en el cuerpo de la petición
              })
              
              // Inicializar variables
              let isSuccess = false
              let message = 'Error desconocido al enviar el correo'
              
              console.log(`[DEBUG] Respuesta del servidor para ${to}:`, response)
              
              // Caso 1: Respuesta exitosa del backend (formato JSON)
              if (response && typeof response === 'object' && response.success === true) {
                isSuccess = true
                message = response.message || 'Correo enviado exitosamente'
                
                // Si hay un messageId, lo incluimos en el mensaje
                if (response.data && response.data.messageId) {
                  message += ` (ID: ${response.data.messageId})`
                }
              }
              // Caso 2: Respuesta de error del backend (formato JSON)
              else if (response && typeof response === 'object' && response.success === false) {
                isSuccess = false
                message = response.message || 'Error al enviar el correo'
              }
              // Caso 3: Para compatibilidad con respuestas antiguas (string)
              else if (typeof response === 'string') {
                isSuccess = response.includes('éxito') || response.includes('exitosamente')
                message = response
              }
              // Caso 4: Manejo de errores de red o respuestas inesperadas
              else if (response && response.error) {
                isSuccess = false
                message = response.error.message || response.error || 'Error en la comunicación con el servidor'
              }
              
              console.log(`[DEBUG] Procesado - éxito: ${isSuccess}, mensaje: ${message}`)
              
              return { 
                email: to, 
                success: isSuccess, 
                result: response.data || response,
                message: isSuccess ? message : null,
                error: isSuccess ? null : (message || 'Error desconocido al enviar el correo')
              }
            } catch (error) {
              console.error(`Error enviando a ${to}:`, error)
              return { 
                email: to, 
                success: false, 
                error: error.response?.data?.message || error.message || 'Error desconocido',
                status: error.response?.status
              }
            }
          })
        )
        
        // Cerrar loading
        await loading.close()
        
        // Procesar resultados
        const exitosos = results.filter(r => r.success).length
        const fallidos = results.length - exitosos
        
        console.log('[DEBUG] Resultados del envío:', {
          total: results.length,
          exitosos,
          fallidos,
          resultados: results
        })
        
        // Verificar si hay al menos un envío exitoso
        if (exitosos === 0) {
          throw new Error('No se pudo enviar a ningún destinatario')
        }
        
        // Obtener mensajes de éxito
        const mensajesExitosos = results
          .filter(r => r.success)
          .map(r => {
            let msg = r.message || 'Envío exitoso'
            // Acortar mensajes muy largos
            if (msg.length > 100) {
              msg = msg.substring(0, 100) + '...'
            }
            // Resaltar el ID del mensaje si está presente
            if (r.result?.data?.messageId) {
              const messageId = r.result.data.messageId
              const shortId = messageId.substring(0, 15) + '...'
              msg += ` <small>(ID: ${shortId})</small>`
            }
            return `• ${r.email}: ${msg}`
          })
          .join('<br>')

        if (fallidos === 0) {
          // Todos los envíos fueron exitosos
          await this.$swal.fire({
            icon: 'success',
            title: '¡Envío exitoso!',
            html: `
              <p>Se han enviado correctamente los correos de prueba a ${exitosos} destinatario(s).</p>
              ${mensajesExitosos ? `<div class="mt-3" style="text-align: left; background: #e8f5e9; padding: 10px; border-radius: 4px;">
                <strong>Respuesta del servidor:</strong><br>
                ${mensajesExitosos}
              </div>` : ''}
            `,
            confirmButtonColor: '#4CAF50',
            confirmButtonText: 'Entendido',
            width: 600
          })
        } else if (exitosos > 0) {
          // Algunos envíos fallaron
          const fallidosList = results
            .filter(r => !r.success)
            .map(r => `• ${r.email}: ${r.error || 'Error desconocido'}`)
            .join('<br>')
          
          const exitososList = results
            .filter(r => r.success && r.message)
            .map(r => `• ${r.email}: ${r.message}`)
            .join('<br>')
          
          await this.$swal.fire({
            icon: 'warning',
            title: 'Envío parcialmente exitoso',
            html: `
              <p>Se enviaron ${exitosos} correo(s) correctamente, pero fallaron ${fallidos}.</p>
              
              ${exitosos > 0 ? `
                <div class="mt-3 mb-3" style="text-align: left; background: #fff8e1; padding: 10px; border-radius: 4px; border-right: 4px solid #ffc107;">
                  <strong>Envíos exitosos:</strong><br>
                  ${exitososList}
                </div>
              ` : ''}
              
              <div class="mt-2" style="text-align: left; background: #ffebee; padding: 10px; border-radius: 4px; border-right: 4px solid #f44336;">
                <strong>Errores:</strong><br>
                ${fallidosList}
              </div>
            `,
            confirmButtonColor: '#FFA000',
            confirmButtonText: 'Entendido',
            width: 700
          })
        } else {
          // Todos los envíos fallaron
          throw new Error('No se pudo enviar a ningún destinatario')
        }
      } catch (error) {
        console.error('=== ERROR EN PRUEBA DE CONEXIÓN O ENVÍO ===')
        console.error('Error completo:', error)
        console.error('Mensaje de error:', error.message)
        console.error('Respuesta del servidor:', error.response)
        
        // Cerrar loading si hay error
        if (loading && typeof loading.close === 'function') {
          await loading.close()
        }
        
        // Mostrar mensaje de error detallado
        let errorMessage = 'No se pudo establecer conexión con el servidor SMTP.'
        
        if (error.response) {
          // Si hay una respuesta del servidor con detalles del error
          errorMessage = `Error del servidor: ${error.response.status} - ${error.response.statusText}`
          if (error.response.data && error.response.data.message) {
            errorMessage += `<br>${error.response.data.message}`
          }
        } else if (error.request) {
          // Si la petición fue hecha pero no hubo respuesta
          errorMessage = 'No se recibió respuesta del servidor. Verifique su conexión a internet.'
        } else if (error.message) {
          // Si hay un mensaje de error específico
          errorMessage = error.message
        }

        // Mostrar mensaje de error específico según el tipo de error
        if (error.message) {
          if (error.message.includes('Network Error') || error.request) {
            errorMessage = 'Error de red. Verifique su conexión a internet o la configuración del proxy.'
          } else if (error.message.includes('timeout')) {
            errorMessage = 'Tiempo de espera agotado. El servidor no respondió a tiempo.'
          } else if (error.message.toLowerCase().includes('auth') || error.response?.status === 401) {
            errorMessage = 'Error de autenticación. Verifique el usuario y la contraseña.'
          } else if (error.response?.status === 404) {
            errorMessage = 'No se encontró el recurso solicitado. Verifique la URL del servidor.'
          } else if (error.response?.status >= 500) {
            errorMessage = 'Error interno del servidor. Por favor, intente nuevamente más tarde.'
          } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            errorMessage = 'No se pudo conectar al servidor SMTP. Verifique la dirección del servidor y el puerto.'
          } else if (error.message.includes('auth')) {
            errorMessage = 'Error de autenticación. Verifique el usuario y la contraseña.'
          }
        }

        // Agregar detalles del error si están disponibles
        let errorDetails = ''
        if (error.response) {
          errorDetails = `<br><br><strong>Detalles del error:</strong><br>
                        Código: ${error.response.status} - ${error.response.statusText}`
          
          if (error.response.data) {
            if (error.response.data.message) {
              errorDetails += `<br>Mensaje: ${error.response.data.message}`
            }
            if (error.response.data.error) {
              errorDetails += `<br>Error: ${error.response.data.error}`
            }
          }
        }

        // Mostrar el mensaje de error con los detalles
        await this.$swal.fire({
          icon: 'error',
          title: 'Error en la prueba de envío',
          html: `
            <p>${errorMessage}</p>
            ${errorDetails ? `<div class="text-left mt-3" style="font-size: 0.9em; color: #555; background: #f8f9fa; padding: 12px; border-radius: 4px; max-height: 200px; overflow-y: auto; border-left: 4px solid #f44336;">
              ${errorDetails}
            </div>` : ''}
          `,
          confirmButtonColor: '#f44336',
          confirmButtonText: 'Entendido',
          width: 600
        })
      }
    }
  }
}
</script>

<style scoped>
</style>

<template>
  <!-- El template va envuelto en un único div raíz -->
  <div>
    <!-- ================= BARRA PRINCIPAL (DESKTOP/MOBILE) ================= -->
    <v-app-bar v-if="estaLoggeado" app color="primary" dark height="50" class="app-bar-custom">
      <!-- Ícono hamburguesa SOLO en mobile (<960px) -->
      <v-app-bar-nav-icon
        class="d-md-none"
        @click.stop="drawer = true"
      ></v-app-bar-nav-icon>

      <!-- Logo alineado a la izquierda -->
      <router-link to="/">
        <v-toolbar-title class="logo-container">
          <v-img
            :src="nombreLogo"
            contain
            width="40"
            height="40"
            alt="AreaZero"
            class="ml-2"
          />
        </v-toolbar-title>
      </router-link>

      <!-- Menús horizontales SOLO en desktop (>=960px), compactos -->
      <v-toolbar-items class="ml-4 d-none d-md-flex menu-horizontal-compacta">
        <!-- STOCK SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusStock.length > 0" v-model="menuStock">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <stock-icon class="mr-1" />
                STOCK
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusStock"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- ÓRDENES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusOrdenes.length > 0" v-model="menuOrdenes">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <ordenes-icon class="mr-1" />
                ÓRDENES
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusOrdenes"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- SEGUIMIENTOS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusSeguimientos.length > 0" v-model="menuSeguimientos">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <seguimientos-icon class="mr-1" />
                SEGUIMIENTOS
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusSeguimientos"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- GUIAS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusGuias.length > 0" v-model="menuGuias">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <guias-icon class="mr-1" />
                GUIAS
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusGuias"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- INFORMES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusInformes.length > 0" v-model="menuInformes">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <informes-icon class="mr-1" />
                INFORMES
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusInformes"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- EMPRESAS SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusEmpresas.length > 0" v-model="menuEmpresas">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <empresas-icon class="mr-1" />
                EMPRESAS
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusEmpresas"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- SEGURIDAD SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusSeguridad.length > 0" v-model="menuSeguridad">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <security-icon class="mr-1" />
                SEGURIDAD
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusSeguridad"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <!-- TRANSPORTES SOLO SI HAY ITEMS -->
        <v-menu offset-y v-if="ListaDeMenusTransportes.length > 0" v-model="menuTransportes">
          <template #activator="{ on, attrs }">
            <div class="menu-button-wrapper">
              <v-btn text v-bind="attrs" v-on="on" class="menu-button">
                <transporte-icon class="mr-1" />
                TRANSPORTES
              </v-btn>
            </div>
          </template>
          <v-list>
            <v-list-item
              v-for="menu in ListaDeMenusTransportes"
              :key="menu.ruta"
              :to="menu.ruta"
              link
            >
              <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <v-spacer />

      <!-- ================= SWITCH SOL/LUNA ANIMADO =================== -->
      <div
        class="theme-switch-wide"
        :class="{ 'theme-switch--dark': $vuetify.theme.dark }"
        @click="toggleTheme"
        tabindex="0"
        aria-label="Cambiar tema"
      >
        <div class="theme-switch__circle">
          <!-- Sol -->
          <svg class="theme-switch__icon sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
          </svg>
          <!-- Luna -->
          <svg class="theme-switch__icon moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
          </svg>
        </div>
      </div>
      <!-- =============================================================== -->

          <!-- Menú de perfil con cierre de sesión -->
          <v-menu offset-y v-model="menuUsuario" :close-on-content-click="false">
            <template #activator="{ on, attrs }">
              <div class="d-flex align-center" style="cursor: pointer; height: 100%;" v-bind="attrs" v-on="on">
                <v-icon class="mr-1">mdi-account</v-icon>
                <span class="mr-1">{{ nombreUsuario }}</span>
              </div>
            </template>
            <v-list dense>
              <!-- Opción de Mesa de Ayuda -->
              <v-list-item 
                @click="irAMesaDeAyuda" 
                class="px-2"
              >
                <v-list-item-icon class="mr-2">
                  <v-icon>mdi-help-circle</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Mesa de Ayuda</v-list-item-title>
              </v-list-item>
              <!-- Opción de Cerrar Sesión -->
              <v-list-item @click="cerrarSesion" class="px-2">
                <v-list-item-icon class="mr-2">
                  <v-icon>mdi-logout</v-icon>
                </v-list-item-icon>
                <v-list-item-title>Cerrar Sesión</v-list-item-title>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
    </v-app-bar>

    <!-- =============== DRAWER RESPONSIVE: MOBILE ONLY =============== -->
    <v-navigation-drawer
      v-model="drawer"
      temporary
      app
      class="d-md-none"
      v-if="estaLoggeado"
    >
      <v-list>
        <!-- Encabezado drawer: logo + usuario -->
        <v-list-item>
          <v-img :src="nombreLogo" width="40" class="mr-2"></v-img>
          <v-list-item-title>{{ nombreUsuario }}</v-list-item-title>
        </v-list-item>
        <v-divider></v-divider>
        <!-- Menú lateral: acordéon, solo expande un grupo -->
        <div v-for="(grupo, i) in gruposMobile" :key="grupo.titulo" class="mobile-menu-group">
          <div @click="expandirSoloGrupo(i)" class="menu-item">
            <div class="menu-content">
              <div class="menu-icon-wrapper">
                <component 
                  :is="getIconComponent(grupo.titulo)" 
                  class="menu-icon"
                  style="width: 20px; height: 20px;"
                />
              </div>
              <div class="menu-text">{{ grupo.titulo }}</div>
            </div>
          </div>
          
          <v-expand-transition>
            <div v-if="grupo.expanded" class="submenu-container">
              <v-list-item
                v-for="menu in grupo.items"
                :key="menu.ruta"
                :to="menu.ruta"
                link
                @click="drawer = false"
                class="pl-8"
              >
                <v-list-item-title>{{ menu.nombre }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-expand-transition>
        </div>
        <v-divider></v-divider>
        <!-- Mesa de Ayuda en el drawer -->
        <div class="menu-item" @click="irAMesaDeAyuda">
          <div class="menu-content">
            <div class="menu-icon-wrapper">
              <v-icon small class="mr-2">mdi-help-circle</v-icon>
            </div>
            <div class="menu-text">Mesa de Ayuda</div>
          </div>
        </div>

        <!-- Logout en el drawer -->
        <div class="menu-item" @click="cerrarSesion">
          <div class="menu-content">
            <div class="menu-icon-wrapper">
              <logout-icon style="width: 20px; height: 20px;" />
            </div>
            <div class="menu-text">Cerrar sesión</div>
          </div>
        </div>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script>
// Importa el store global de Vuex y el helper de roles
import store from '@/store'
import StockIcon from '@/components/icons/StockIcon.vue'
import OrdenesIcon from '@/components/icons/OrdenesIcon.vue'
import GuiasIcon from '@/components/icons/GuiasIcon.vue'
import InformesIcon from '@/components/icons/InformesIcon.vue'
import EmpresasIcon from '@/components/icons/EmpresasIcon.vue'
import SecurityIcon from '@/components/icons/SecurityIcon.vue'
import TransporteIcon from '@/components/icons/TransporteIcon.vue'
import SeguimientosIcon from '@/components/icons/SeguimientosIcon.vue'
import PerfilIcon from '@/components/icons/PerfilIcon.vue'
import LogoutIcon from '@/components/icons/LogoutIcon.vue'
import roles from '@/store/roles' // Asegúrate que la ruta a tu store de roles sea correcta

export default {
  name: 'MenuPrincipal',
  data() {
    return {
      drawer: false,
      group: null,
      expanded: [],
      menuStock: false,
      menuOrdenes: false,
      menuGuias: false,
      menuInformes: false,
      menuEmpresas: false,
      menuSeguridad: false,
      menuTransportes: false,
      menuSeguimientos: false,
      menuConfiguracion: false,
      menuSistema: false,
      menuAdmin: false,
      menuUsuario: false,
      ListaDeMenusStock: [],
      ListaDeMenusOrdenes: [],
      ListaDeMenusGuias: [],
      ListaDeMenusInformes: [],
      ListaDeMenusEmpresas: [],
      ListaDeMenusSeguridad: [],
      ListaDeMenusConfiguracion: [],
      ListaDeMenusSistema: [],
      ListaDeMenusAdmin: [],
      ListaDeMenus: [],
      menu: false,
      nombreLogo: require(`@/assets/IsoLogo_${process.env.VUE_APP_Quien_Soy}.png`),
      gruposMobile: [] // Para el Drawer mobile
    }
  },
  computed: {
    // Si está logueado (de Vuex)
    estaLoggeado() {
      return store.state.usuarios.usuarioActual.Loggeado
    },
    nombreUsuario() {
      return store.state.usuarios.usuarioActual.Nombre
    },
    usuarioId() {
      return store.state.usuarios.usuarioActual.Id
    },
    themeIcon() {
      return this.$vuetify.theme.dark
        ? 'mdi-white-balance-sunny'
        : 'mdi-moon-waning-crescent'
    },
    // Evita bugs de carga
    estaLogueadoConId() {
      return this.estaLoggeado && !!this.usuarioId
    }
  },
  watch: {
    // Si cambia el usuario (login), recarga menús
    estaLogueadoConId: {
      immediate: true,
      async handler(val) { // Convertido a async para esperar cargarYAgruparMenus
        console.log('Watcher estaLogueadoConId disparado con valor:', val);
        if (val) {
          await this.cargarYAgruparMenus(); // Esperar a que los menús se carguen
        } else {
          this.limpiarMenus();
        }
      }
    }
  },
  components: {
    StockIcon,
    OrdenesIcon,
    GuiasIcon,
    InformesIcon,
    EmpresasIcon,
    SecurityIcon,
    TransporteIcon,
    SeguimientosIcon,
    PerfilIcon,
    LogoutIcon
  },
  methods: {
    // Cambia tema oscuro/claro y lo guarda en localStorage
    toggleTheme() {
      this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      localStorage.setItem('modoOscuro', this.$vuetify.theme.dark)
    },
    // Limpia todos los menús
    limpiarMenus() {
      this.ListaDeMenusStock = []
      this.ListaDeMenusOrdenes = []
      this.ListaDeMenusSeguimientos = [] // Limpiar la nueva lista
      this.ListaDeMenusGuias = []
      this.ListaDeMenusInformes = []
      this.ListaDeMenusEmpresas = []
      this.ListaDeMenusSeguridad = []
      this.ListaDeMenusTransportes = []
      this.gruposMobile = []
    },
    // Obtiene el componente de ícono según el título del menú
    getIconComponent(titulo) {
      switch(titulo) {
        case 'STOCK': return StockIcon;
        case 'ÓRDENES': return OrdenesIcon;
        case 'SEGUIMIENTOS': return SeguimientosIcon;
        case 'GUÍAS': return GuiasIcon;
        case 'INFORMES': return InformesIcon;
        case 'EMPRESAS': return EmpresasIcon;
        case 'SEGURIDAD': return SecurityIcon;
        case 'TRANSPORTES': return TransporteIcon;
        default: return null;
      }
    },
    // Trae menús y los agrupa según el "modulo"
    async cargarYAgruparMenus() { // Convertido a async
      console.log('Entrando a cargarYAgruparMenus con usuario ID:', this.usuarioId);
      this.limpiarMenus(); // Limpia al inicio de la carga
      if (!this.estaLogueadoConId) return;

      try {
        const menusDelBackend = await roles.getAllMenuUser(this.usuarioId);
        console.log('Menús obtenidos del backend:', menusDelBackend);
        // Limpiar de nuevo aquí puede ser redundante si la primera limpieza es suficiente,
        // pero no daña y asegura un estado limpio si hay llamadas concurrentes o reintentos.
        this.limpiarMenus(); 

        menusDelBackend.forEach(m => {
          if (m.modulo.includes('stock')) this.ListaDeMenusStock.push(m);
          else if (m.modulo.includes('ordenes')) this.ListaDeMenusOrdenes.push(m);
          else if (m.modulo.includes('guias')) this.ListaDeMenusGuias.push(m);
          else if (m.modulo.includes('informes')) this.ListaDeMenusInformes.push(m);
          else if (m.modulo.includes('empresas')) this.ListaDeMenusEmpresas.push(m);
          else if (m.modulo.includes('seguridad')) this.ListaDeMenusSeguridad.push(m);
          else if (m.modulo.includes('transportes')) this.ListaDeMenusTransportes.push(m);
          // Comprobación para el módulo de seguimientos (si viene del backend para algunos roles)
          else if (m.modulo.includes('seguimientos')) this.ListaDeMenusSeguimientos.push(m);
        });
        
        // El menú "Panel de Seguimientos" ahora viene dinámicamente del backend
        // Ya no es necesario agregarlo manualmente

        const emailConfigExists = this.ListaDeMenusSeguridad.some(menu => menu.ruta === '/Seguridad/EmailConfig')
        if (!emailConfigExists) {
          this.ListaDeMenusSeguridad.push({
            nombre: 'Configurar Correos',
            ruta: '/Seguridad/EmailConfig',
            modulo: 'seguridad'
          })
        }

        const todosGrupos = [
          { titulo: "STOCK", items: this.ListaDeMenusStock },
          { titulo: "ÓRDENES", items: this.ListaDeMenusOrdenes },
          { titulo: "SEGUIMIENTOS", items: this.ListaDeMenusSeguimientos }, // Añadido para el menú móvil
          { titulo: "GUÍAS", items: this.ListaDeMenusGuias },
          { titulo: "INFORMES", items: this.ListaDeMenusInformes },
          { titulo: "EMPRESAS", items: this.ListaDeMenusEmpresas },
          { titulo: "SEGURIDAD", items: this.ListaDeMenusSeguridad },
          { titulo: "TRANSPORTES", items: this.ListaDeMenusTransportes }
        ];

        this.gruposMobile = todosGrupos
          .filter(g => g.items.length > 0) // Solo grupos con items
          .map(g => ({ ...g, expanded: false })); // Inicializar como no expandidos

      } catch (error) {
        console.error("Error al cargar y agrupar los menús:", error);
        console.log('Error capturado en cargarYAgruparMenus:', error);
        this.limpiarMenus(); // En caso de error, limpiar menús para evitar estado inconsistente
      }
    },
    // Expande solo un grupo a la vez en mobile
    expandirSoloGrupo(indexClickeado) {
      this.gruposMobile.forEach((grupo, index) => {
        // Si es el grupo clickeado, invierte su estado 'expanded'
        // Si no es el grupo clickeado, ciérralo (setea 'expanded' a false)
        if (index === indexClickeado) {
          grupo.expanded = !grupo.expanded;
        } else {
          grupo.expanded = false;
        }
      });
    },
    
    async cerrarSesion() {
      try {
        // Cerrar sesión en el store de Vuex
        await store.dispatch('usuarios/desloggear');
        // Redirigir a la página de login
        this.$router.push('/login');
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      } finally {
        // Cerrar el menú de usuario
        this.menuUsuario = false;
      }
    },
    irAMesaDeAyuda() {
      // Redirigir a la URL de la mesa de ayuda
      console.log('Redirigiendo a la mesa de ayuda');
      window.open('https://area54.sd.cloud.invgate.net/', '_blank');
    }
  },
  mounted() {
    // Cuando se monta, recupera modo oscuro guardado
    const pref = localStorage.getItem('modoOscuro');
    if (pref !== null) {
      this.$vuetify.theme.dark = pref === 'true';
    }
    // Cargar menús inmediatamente por si la página se recarga
    this.cargarYAgruparMenus();
    // La carga inicial también la maneja el watcher `estaLogueadoConId` como salvaguarda
  }
}
</script>

<style scoped>
.menu-button-wrapper {
  display: flex;
  align-items: center;
  height: 100%;
}

.menu-button {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.4px;
  transition: all 0.3s ease;
  font-size: 13px;
}

.menu-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Estilo para el menú activo */
.v-menu__content {
  margin-top: 0;
  box-shadow: 0 5px 5px -3px rgba(0,0,0,0.2), 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12);
}

/* Estilo para los ítems del menú */
.v-list-item {
  min-height: 40px;
}

.v-list-item__title {
  font-size: 14px;
  font-weight: 500;
}
.logo-container {
  cursor: pointer;
  margin-left: 0 !important;
  padding-left: 0 !important;
}
.user-btn {
  text-transform: none;
  font-weight: 500;
}

/* Barra horizontal súper compacta: nunca hace overflow, los botones se achican */
.menu-horizontal-compacta {
  display: flex !important;
  flex-wrap: nowrap !important;
  overflow-x: auto !important;
  gap: 2px !important;
  align-items: center;
  max-width: 100%;
  height: 100%;
  padding: 0 10px;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.menu-horizontal-compacta::-webkit-scrollbar {
  display: none;
}
.menu-horizontal-compacta > * {
  flex-shrink: 1 !important; /* permite cierto ajuste del ancho de los botones */
}

/* Botones compactos */
.menu-horizontal-compacta .v-btn {
  font-size: clamp(8px, 1vw, 12px) !important; /* reduce el texto en pantallas pequeñas */
  text-transform: none !important;
  padding: 0 7px !important;
  margin: 0 !important;
  min-width: 0 !important;
  min-height: 30px !important;
  height: 30px !important;
  line-height: 30px !important;
  border-radius: 7px !important;
}

/* Fuente y compactado en los dropdowns */
.v-toolbar__content {
  font-size: 13px !important;
  font-family: 'DM Sans', sans-serif;
  letter-spacing: 0;
  line-height: 1.2;
  padding: 0 8px !important;
  height: 50px !important;
}

.app-bar-custom {
  box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12) !important;
}
/* Estilos consistentes para todos los ítems de menú */
.v-list-item__title,
.v-list-item .v-list-item__title,
.v-list-group .v-list-item .v-list-item__title,
.v-list-group--active .v-list-item .v-list-item__title,
.v-list-group--active .v-list-item--active .v-list-item__title,
.v-list-group__items .v-list-item .v-list-item__title,
.v-list-group__items .v-list-item--active .v-list-item__title,
.v-list-group--sub-group .v-list-item .v-list-item__title {
  font-size: 13px !important;
  font-weight: 500 !important; /* Mismo peso para todo */
  font-family: 'DM Sans', sans-serif !important;
  padding: 0 2px !important;
}

/* Estilos para el tema oscuro */
.theme--dark .v-app-bar.v-toolbar.v-sheet {
  background-color: var(--v-menubar-base) !important;
}

/* Asegurar que las flechas de los menús desplegables sean visibles */
.v-menu__content .v-list-item__icon {
  margin-right: 12px !important;
  margin-left: 0 !important;
}

.v-list-item {
  min-height: 40px !important;
}

.v-list-item__title {
  font-size: 0.875rem !important;
  font-weight: 500 !important;
}

.submenu-container {
  background-color: rgba(0, 0, 0, 0.02);
}

.v-list-item {
  min-height: 40px !important;
  padding: 0 16px !important;
}

.v-list-item__content {
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

/* Estilos para el menú móvil */
.mobile-menu-group {
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.mobile-menu-group:last-child {
  border-bottom: none;
}

.menu-item {
  min-height: 48px;
  margin: 0;
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.menu-content {
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.menu-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  width: 24px;
  height: 24px;
}

.menu-icon {
  display: block;
  width: 20px;
  height: 20px;
}

.menu-text {
  font-size: 0.9375rem;
  font-weight: 500;
  line-height: 1.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
}

.v-menu__content .v-list-item__icon .v-icon {
  color: inherit !important;
}

/* Asegurar que los iconos en los botones del menú sean visibles */
.v-toolbar .v-btn .v-icon {
  color: inherit !important;
  opacity: 1 !important;
}

/* Asegurar que las flechas de los menús sean visibles */
.v-menu__activator .v-icon {
  color: inherit !important;
  opacity: 1 !important;
}

/* Estilo específico para las flechas de menú */
.v-menu__activator .v-icon--right {
  margin-left: 4px !important;
  font-size: 20px !important;
}

/* Asegurar que los iconos dentro de los botones del menú tengan el tamaño correcto */
.v-toolbar .v-btn .v-icon {
  font-size: 20px !important;
}

/* Asegurar que los iconos personalizados en los botones tengan el tamaño correcto */
.v-toolbar .v-btn img {
  width: 20px;
  height: 20px;
  object-fit: contain;
}

/* Estilos para la barra de menú superior */
.v-toolbar__content .v-btn {
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif !important;
  text-transform: none !important;
}

/* Asegurar consistencia en los botones de menú */
.v-btn {
  font-weight: 500 !important;
  letter-spacing: 0.5px;
  font-family: 'DM Sans', sans-serif !important;
}

/* Menú horizontal solo visible en desktop >= 960px */
.d-none.d-md-flex {
  display: none !important;
}
@media (min-width: 960px) {
  .d-none.d-md-flex {
    display: flex !important;
  }
}

/* ==== SWITCH SOL/LUNA ANIMADO ==== */
.theme-switch-wide {
  width: 70px;
  height: 38px;
  margin: 0 6px;
  border-radius: 99px;
  background: var(--switch-track);
  box-shadow: 0 2px 8px rgba(0,0,0,0.06) inset;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  transition: background 0.3s, box-shadow 0.3s;
  outline: none;
  vertical-align: middle;
}
.theme-switch-wide:focus {
  box-shadow: 0 0 0 3px var(--switch-focus-shadow);
}
.theme-switch__circle {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: white;
  box-shadow: 4px 4px 14px rgba(0,0,0,0.05), -4px -4px 10px rgba(0,0,0,0.05) inset;
  position: absolute;
  left: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  transition: left 0.45s cubic-bezier(0.65,0,0.35,1), background 0.3s;
}
.theme-switch--dark .theme-switch__circle {
  left: 32px;  /* Empuja la "luna" a la derecha */
  background: var(--switch-track);
  box-shadow: 2px 2px 10px rgba(0,0,0,0.13), -2px -2px 18px rgba(0,0,0,0.16) inset;
}
.theme-switch__icon {
  width: 22px;
  height: 22px;
  position: absolute;
  left: 6px;
  top: 6px;
  transition: margin 0.45s cubic-bezier(0.65,0,0.35,1), opacity 0.5s;
  opacity: 1;
}
.theme-switch__icon.sun {
  color: var(--switch-sun);
  margin-top: 0%;
  opacity: 1;
}
.theme-switch__icon.moon {
  color: var(--switch-moon);
  margin-top: -150%;
  opacity: 0;
}
.theme-switch--dark .theme-switch__icon.sun {
  margin-top: 150%;
  opacity: 0;
}
.theme-switch--dark .theme-switch__icon.moon {
  margin-top: 0%;
  opacity: 1;
}
</style>
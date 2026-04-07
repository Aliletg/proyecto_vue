<template>
  <v-container class="fill-height bg-grey-lighten-4" fluid>
    <v-row justify="center">
      <v-col cols="12" sm="10" md="8" lg="6">
        
        <v-card class="pa-6 rounded-xl text-center mb-6" elevation="3">
          <v-avatar color="success-lighten-4" size="80" class="mb-4">
            <v-icon size="48" color="success">mdi-account-check</v-icon>
          </v-avatar>
          
          <h2 class="text-h4 font-weight-black mb-2 text-blue-grey-darken-4">
            ¡Hola de nuevo!
          </h2>
          <p class="text-body-1 text-grey-darken-1">
            Has accedido al sistema correctamente. ¿Qué deseas hacer hoy?
          </p>
        </v-card>

        <v-row>
          <v-col cols="12" sm="6">
            <v-card 
              link 
              @click="router.push('/productos')" 
              class="pa-6 rounded-xl transition-swing" 
              elevation="2"
              hover
            >
              <v-icon size="40" color="primary" class="mb-3">mdi-package-variant-closed</v-icon>
              <h3 class="text-h6 font-weight-bold">Inventario</h3>
              <p class="text-caption text-grey">Gestiona tus productos, precios e impuestos.</p>
              <v-divider class="my-3"></v-divider>
              <div class="text-button text-primary d-flex align-center">
                Ir a Productos <v-icon icon="mdi-chevron-right"></v-icon>
              </div>
            </v-card>
          </v-col>

          <!-- TARJETA NOTIFICACIONES -->
          <v-col cols="12" sm="6">
            <v-card 
              link
              @click="showNotifPanel = true"
              class="pa-6 rounded-xl transition-swing" 
              elevation="2"
              hover
            >
              <v-icon size="40" color="orange" class="mb-3">mdi-bell-ring</v-icon>
              <h3 class="text-h6 font-weight-bold">Notificaciones</h3>
              <p class="text-caption text-grey">Envía notificaciones push a los usuarios.</p>
              <v-divider class="my-3"></v-divider>
              <div class="text-button text-orange d-flex align-center">
                Abrir panel <v-icon icon="mdi-chevron-right"></v-icon>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12" sm="6">
            <v-card 
              variant="outlined"
              class="pa-6 rounded-xl border-dashed" 
            >
              <v-icon size="40" color="grey" class="mb-3">mdi-cog-outline</v-icon>
              <h3 class="text-h6 font-weight-bold text-grey">Ajustes</h3>
              <p class="text-caption text-grey">Configuración general del perfil (Próximamente).</p>
            </v-card>
          </v-col>
        </v-row>

        <div class="text-center mt-8">
          <v-btn 
            color="red-lighten-1" 
            variant="text" 
            prepend-icon="mdi-logout"
            @click="logout"
          >
            Finalizar sesión de forma segura
          </v-btn>
        </div>

      </v-col>
    </v-row>

    <!-- DIALOG DEL PANEL DE NOTIFICACIONES -->
    <v-dialog v-model="showNotifPanel" max-width="600">
      <v-card class="pa-4 rounded-xl">
        <v-card-item>
          <v-card-title class="text-h6 font-weight-bold">
            <v-icon color="orange" class="mr-2">mdi-bell-ring</v-icon>
            Panel de Notificaciones
          </v-card-title>
          <template #append>
            <v-btn icon="mdi-close" variant="text" @click="showNotifPanel = false"></v-btn>
          </template>
        </v-card-item>

        <v-card-text>

          <v-select
            v-model="selectedUser"
            :items="users"
            item-title="email"
            item-value="fcm_token"
            label="Seleccionar usuario"
            variant="outlined"
            prepend-inner-icon="mdi-account"
            color="primary"
            class="mb-4"
            :loading="loadingUsers"
          ></v-select>

          <v-text-field
            v-model="notifTitle"
            label="Título"
            variant="outlined"
            prepend-inner-icon="mdi-format-title"
            color="primary"
            class="mb-2"
          ></v-text-field>

          <v-textarea
            v-model="notifBody"
            label="Mensaje"
            variant="outlined"
            prepend-inner-icon="mdi-message-text"
            color="primary"
            rows="3"
            class="mb-4"
          ></v-textarea>

          <v-expand-transition>
            <v-alert
              v-if="alertMessage"
              :type="alertType"
              variant="tonal"
              density="compact"
              class="mb-4"
              closable
              @click:close="alertMessage = ''"
            >
              {{ alertMessage }}
            </v-alert>
          </v-expand-transition>

          <v-btn
            :loading="isSending"
            :disabled="!selectedUser || !notifTitle || !notifBody"
            class="text-none font-weight-bold"
            color="orange"
            size="large"
            block
            rounded="pill"
            elevation="2"
            @click="sendNotification"
          >
            <v-icon left class="mr-2">mdi-send</v-icon>
            Enviar Notificación
          </v-btn>

        </v-card-text>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from '@/config/axios'

const router = useRouter()

const showNotifPanel = ref(false)
const users = ref([])
const selectedUser = ref(null)
const notifTitle = ref('')
const notifBody = ref('')
const alertMessage = ref('')
const alertType = ref('success')
const isSending = ref(false)
const loadingUsers = ref(false)

const logout = () => {
  localStorage.removeItem('token')
  router.push('/') 
}

const loadUsers = async () => {
  loadingUsers.value = true
  try {
    const response = await axios.get('/users-with-token')
    users.value = response.data
  } catch (error) {
    console.error('Error cargando usuarios:', error)
  } finally {
    loadingUsers.value = false
  }
}

const sendNotification = async () => {
  isSending.value = true
  alertMessage.value = ''
  try {
    await axios.post('/send-notification', {
      fcm_token: selectedUser.value,
      title: notifTitle.value,
      body: notifBody.value
    })
    alertType.value = 'success'
    alertMessage.value = '¡Notificación enviada correctamente!'
    notifTitle.value = ''
    notifBody.value = ''
    selectedUser.value = null
  } catch (error) {
    console.error('Error enviando notificación:', error)
    alertType.value = 'error'
    alertMessage.value = 'Error al enviar la notificación.'
  } finally {
    isSending.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.transition-swing {
  transition: transform 0.2s ease-in-out;
}
.transition-swing:hover {
  transform: translateY(-5px);
}
.border-dashed {
  border: 2px dashed #ccc !important;
}
</style>
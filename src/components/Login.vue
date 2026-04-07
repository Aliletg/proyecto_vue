<template>
  <v-container class="fill-height d-flex align-center justify-center">

    <v-expand-transition>
      <v-alert
        v-if="!isOnline"
        type="warning"
        variant="tonal"
        density="comfortable"
        icon="mdi-wifi-off"
        class="mb-4 w-100"
        style="max-width: 400px; position: fixed; top: 16px; left: 50%; transform: translateX(-50%); z-index: 9999;"
        elevation="4"
      >
        <strong>Sin conexión a internet</strong><br>
        No es posible conectarse al servidor. Verifica tu red e inténtalo de nuevo.
      </v-alert>
    </v-expand-transition>

    <v-card 
      elevation="8" 
      width="100%" 
      max-width="400" 
      class="pa-6 rounded-lg"
    >
      <v-card-item class="justify-center">
        <v-icon size="large" color="primary" icon="mdi-account-circle" class="mb-2"></v-icon>
        <v-card-title class="text-h5 font-weight-bold">Bienvenido</v-card-title>
        <v-card-subtitle>Ingresa tus credenciales para continuar</v-card-subtitle>
      </v-card-item>

      <v-card-text class="mt-4">
        <v-form validate-on="submit lazy" @submit.prevent="handleLogin">
          
          <v-text-field
            v-model="userEmail"
            :rules="validationRules"
            label="Usuario"
            variant="outlined"
            prepend-inner-icon="mdi-account-outline"
            color="primary"
            class="mb-2"
            clearable
          ></v-text-field>

          <v-text-field
            v-model="userPassword"
            :rules="validationRules"
            label="Contraseña"
            :type="passwordVisible ? 'text' : 'password'"
            variant="outlined"
            prepend-inner-icon="mdi-lock-outline"
            :append-inner-icon="passwordVisible ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append-inner="passwordVisible = !passwordVisible"
            color="primary"
          ></v-text-field>

          <v-expand-transition>
            <v-alert
              v-if="alertMessage"
              type="error"
              variant="tonal"
              density="compact"
              class="mt-4 mb-2"
              closable
              @click:close="alertMessage = ''"
            >
              {{ alertMessage }}
            </v-alert>
          </v-expand-transition>

          <v-btn
            :loading="isLoading"
            :disabled="!isOnline"
            class="mt-6 text-none font-weight-bold"
            color="primary"
            size="large"
            type="submit"
            block
            rounded="pill"
            elevation="2"
          >
            <v-icon left class="mr-2">mdi-login</v-icon>
            {{ isOnline ? 'Iniciar sesión' : 'Sin conexión' }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from '../config/axios'
import { useRouter } from 'vue-router'
import { useNetwork } from '@/composables/useNetwork'
import { requestNotificationPermission } from '@/config/firebase'

const router = useRouter()
const { isOnline } = useNetwork()

const userEmail = ref('')
const userPassword = ref('')
const alertMessage = ref('')
const isLoading = ref(false)
const passwordVisible = ref(false)

const validationRules = [
  value => !!value || 'Campo requerido'
]

// Guarda el FCM token en Laravel después del login
const saveFcmToken = async () => {
  try {
    const token = await requestNotificationPermission()
    if (token) {
      await axios.post('/fcm-token', { fcm_token: token })
      console.log('FCM token guardado en Laravel')
    }
  } catch (error) {
    console.error('Error guardando FCM token:', error)
  }
}

const handleLogin = async () => {
  alertMessage.value = ''

  if (!isOnline.value) {
    alertMessage.value = 'No hay conexión a internet. Verifica tu red e inténtalo de nuevo.'
    return
  }

  isLoading.value = true
  
  try {
    if (!userEmail.value || !userPassword.value) {
      alertMessage.value = "Completar los datos correctamente"
      return
    }
    
    const response = await axios.post('/login', {
      email: userEmail.value,
      password: userPassword.value
    })

    console.log('Respuesta completa:', response.data)
    console.log('Valor de acceso:', response.data.acceso)
    console.log('Tipo de acceso:', typeof response.data.acceso)
    
    if (response.data.acceso && response.data.token) {
      localStorage.setItem('token', response.data.token)
      // Pedir permiso y guardar token FCM después del login exitoso
      await saveFcmToken()
      await router.push('/home')
    } else {
      alertMessage.value = 'Usuario o contraseña incorrectos'
    }
      
  } catch(error) {
    console.error('Error en login:', error)
    if (!navigator.onLine || error.code === 'ERR_NETWORK') {
      alertMessage.value = 'Sin conexión a internet. No se puede conectar al servidor.'
    } else {
      alertMessage.value = 'Ocurrió un error al conectarse con el servidor.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
:global(body) {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  height: 100vh;
  margin: 0;
}
</style>
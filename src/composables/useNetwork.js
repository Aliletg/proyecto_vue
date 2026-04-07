/**
 * useNetwork.js
 *
 * Composable que expone el estado de conexión a internet de forma reactiva.
 * Escucha los eventos nativos `online` y `offline` del navegador.
 *
 * Uso:
 *   import { useNetwork } from '@/composables/useNetwork'
 *   const { isOnline } = useNetwork()
 */

import { ref, onMounted, onUnmounted } from 'vue'

export function useNetwork () {
  // Inicializa con el estado real del navegador
  const isOnline = ref(navigator.onLine)

  const setOnline  = () => { isOnline.value = true  }
  const setOffline = () => { isOnline.value = false }

  onMounted(() => {
    window.addEventListener('online',  setOnline)
    window.addEventListener('offline', setOffline)
  })

  onUnmounted(() => {
    window.removeEventListener('online',  setOnline)
    window.removeEventListener('offline', setOffline)
  })

  return { isOnline }
}

document.addEventListener('DOMContentLoaded', function() {
  const analyzeBtn = document.getElementById('analyzeBtn');
  const scrollToNewBtn = document.getElementById('scrollToNewBtn');
  
  analyzeBtn.addEventListener('click', async function() {
    try {
      // Obtener la pestaña activa
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Verificar que la pestaña tenga una URL válida
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.error('No se puede analizar esta página:', tab.url);
        return;
      }
      
      // Intentar inyectar el content script si no está disponible
      try {
        await chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['browser/content.js']
        });
      } catch (injectError) {
        // Es normal que falle si ya está inyectado, no hacer nada
      }
      
      // Enviar mensaje al content script para extraer el DOM
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractDOM' });
      
      if (response && response.success) {
        // Análisis completado exitosamente
        // La información se muestra en la consola de la página
      } else {
        console.error('Error al analizar la página:', response?.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
  
  scrollToNewBtn.addEventListener('click', async function() {
    try {
      // Obtener la pestaña activa
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Verificar que la pestaña tenga una URL válida
      if (!tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.error('No se puede scrollear en esta página:', tab.url);
        return;
      }
      
      // Enviar mensaje al content script para scrollear al contenido nuevo
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'scrollToNewContent' });
      
      if (response && response.success) {
        console.log('Scroll completado exitosamente');
      } else {
        console.error('Error al scrollear:', response?.error || 'Error desconocido');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

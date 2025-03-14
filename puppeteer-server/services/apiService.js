import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: '/api', // Ajusta si tu backend está en otro dominio
  timeout: 10000, // 10 segundos de timeout
});

// Función para manejar errores
const handleRequest = async (request) => {
  try {
    const response = await request;
    return response.data;
  } catch (error) {
    console.error('Error en API:', error?.response?.data || error.message);
    throw error;
  }
};

// 🔹 1. Obtener total de solicitudes de bots
export const getTotalBotRequests = async (startDate, endDate, prevStart, prevEnd) => {
  return handleRequest(api.get('/total-bot-requests', {
    params: { currentStart: startDate, currentEnd: endDate, prevStart, prevEnd }
  }));
};

// 🔹 2. Obtener distribución de bots por tipo
export const getBotDistributionByType = async (startDate, endDate) => {
  return handleRequest(api.get('/bot-distribution-by-type', { params: { startDate, endDate } }));
};

// 🔹 3. Obtener distribución de bots por categoría
export const getBotDistributionByCategory = async (startDate, endDate) => {
  return handleRequest(api.get('/bot-distribution-by-category', { params: { startDate, endDate } }));
};

// 🔹 4. Obtener distribución de tipos de conexión de bots
export const getBotConnectionTypeDistribution = async (startDate, endDate) => {
  return handleRequest(api.get('/bot-connection-type-distribution', { params: { startDate, endDate } }));
};

// 🔹 5. Obtener distribución geográfica de bots
export const getBotGeoDistribution = async (startDate, endDate, isBot) => {
  return handleRequest(api.get('/bot-geo-distribution', { params: { startDate, endDate , isBot } }));
};

// 🔹 6. Obtener URLs únicas
export const getUniqueURLs = async (startDate, endDate) => {
  return handleRequest(api.get('/unique-urls', { params: { startDate, endDate } }));
};

// 🔹 7. Obtener porcentaje de errores
export const getPercentageErrors = async (startDate, endDate) => {
  return handleRequest(api.get('/percentage-errors', { params: { startDate, endDate } }));
};

// 🔹 8. Obtener el bot más activo
export const getMostActiveBot = async (startDate, endDate) => {
  return handleRequest(api.get('/most-active-bot', { params: { startDate, endDate } }));
};



// 🔹 9. Obtener la actividad diaria de bots (para el gráfico)
export const getDailyBotActivity = async (startDate, endDate) => {
  return handleRequest(
    api.get('/bot-activity', {
      params: { startDate, endDate },
    })
  );
};



export const getLatestRequests = async ({ page, limit, search }) => {
  return handleRequest(
    api.get('/latest-requests', {
      params: { page, limit, search }
    })
  );
};


export const getMostVisitedUrls = async (startDate, endDate) => {
  return handleRequest(
    api.get('/most-visited-urls', {
      params: { startDate, endDate }
    })
  );
};

export async function getAvailableDomains() {
  try {
    const response = await fetch('/api/domains');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching domains:', error);
    return [];
  }
}

// Make sure these functions are properly exported
export const getFileContent = async (domain, fileType) => {
  return handleRequest(api.get(`/files/${domain}/${fileType}`))
    .then(data => data.content)
    .catch(error => {
      console.error(`Error fetching ${fileType} for ${domain}:`, error);
      return '';
    });
};

export const saveFileContent = async (domain, fileType, content) => {
  return handleRequest(api.post(`/files/${domain}/${fileType}`, { content }))
    .then(() => true)
    .catch(error => {
      console.error(`Error saving ${fileType} for ${domain}:`, error);
      return false;
    });
};
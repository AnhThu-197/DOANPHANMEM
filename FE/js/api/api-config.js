// Cau hinh API Backend
const API_CONFIG = {
    // Neu chay local qua Live Server (port 5500/5504/3000), tiep tuc goi direct backend port 8082.
    // Neu chay Docker, tro sang relative path '/api' qua Nginx Proxy.
    BASE_URL: (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && 
              (window.location.port === '5500' || window.location.port === '5504' || window.location.port === '3000')
              ? 'http://localhost:8082/api'
              : '/api',
    TOKEN_KEY: 'accessToken',
    USER_KEY: 'currentUser',
    DEFAULT_HEADERS: {
        'Content-Type': 'application/json'
    }
};


/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // Configuración para el cliente (navegador)
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
            };
        }
        return config;
    },
};

// Suprimir la advertencia específica de Fetch API
if (typeof global !== 'undefined') {
    global.process.removeAllListeners('warning');
}

export default nextConfig;

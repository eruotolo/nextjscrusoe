/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
            },
        ],
    },
    async redirects() {
        return [
            {
                source: '/setting', // URL de origen
                destination: '/setting/users', // URL de destino
                permanent: true, // true si es una redirección 301, false para 302
            },
        ];
    },
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

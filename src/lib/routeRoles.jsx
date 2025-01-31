// Configuración centralizada de permisos por ruta
// Roles comunes para dashboard y api
const commonDashboardApiRoles = [
    'SuperAdministrador',
    'Administrador',
    'Ventas',
    'Administración',
    'Compras',
    'Operaciones',
];

const routeRoles = {
    '/dashboard': commonDashboardApiRoles,
    '/api': commonDashboardApiRoles,
    '/crm': ['SuperAdministrador', 'Administrador', 'Ventas'],
    '/setting': ['SuperAdministrador', 'Administrador'],
};

export default routeRoles;

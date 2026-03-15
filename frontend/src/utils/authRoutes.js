export const roleHomeRoutes = {
    patient: '/dashboard',
    doctor: '/dashboard',
    hospital: '/hospital',
    donor: '/donate',
    ngo: '/',
    volunteer: '/food-donation',
    admin: '/',
};

export function getHomeRouteForRole(role) {
    return roleHomeRoutes[role] || '/';
}

export function getRoleLabel(role) {
    if (!role) return 'Guest';
    return role.charAt(0).toUpperCase() + role.slice(1);
}

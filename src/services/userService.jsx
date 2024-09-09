export const getUsers = async () => {
    const response = await fetch('/api/users', {
        cache: 'no-store',
    });

    if (!response.ok) {
        console.error(`Error HTTP: ${response.status}`);
        return [];
    }

    let data = await response.json();
    data = data.filter((user) => {
        return !user.roles.some((role) => role.roleId === 1);
    });
    // console.log(data);
    return data;
};

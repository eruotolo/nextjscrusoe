export const getRoles = async () => {
    const response = await fetch('/api/roles', {
        cache: 'no-store',
    });

    if (!response.ok) {
        console.log(`Error HTTP: ${response.status}`);
        return [];
    }

    let data = await response.json();
    //console.log(data);
    return data;
};

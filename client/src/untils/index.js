export const getSender = (loggedUser, users) => {
    return users[0]?.id == loggedUser?.id ? users[1] : users[0];
};

export const createQueryString = (options) => {
    const queryString = Object.keys(options)
        .map(key => {
            if (options[key] !== null && options[key] !== undefined && options[key] !== 'null' && options[key] !== '') {
                return `${encodeURIComponent(key)}=${encodeURIComponent(options[key])}`;
            }
            return '';
        })
        .filter(Boolean)
        .join('&');
    return queryString.length > 0 ? `?${queryString}` : '?';
}
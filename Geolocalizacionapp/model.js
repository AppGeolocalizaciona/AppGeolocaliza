// model.js
export const getUserPosition = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(resolve, reject);
        } else {
            reject(new Error("La geolocalización no es soportada por este navegador."));
        }
    });
};

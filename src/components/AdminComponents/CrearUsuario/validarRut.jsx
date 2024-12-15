const validarRut = (rut) => {
    rut = rut.trim().toLowerCase();

    const regex = /^[0-9]+[-]?[0-9kK]{1}$/;
    if (!regex.test(rut)) {
        return false;
    }

    const [rutNumerico, dv] = rut.split('-');
    
    if (rutNumerico.length < 8 || rutNumerico.length > 9) {
        return false;
    }

    let suma = 0;
    let multiplicador = 2;

    for (let i = rutNumerico.length - 1; i >= 0; i--) {
        suma += parseInt(rutNumerico.charAt(i)) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    let dvEsperado;

    if (dvCalculado === 11) {
        dvEsperado = '0';
    } else if (dvCalculado === 10) {
        dvEsperado = 'k';
    } else {
        dvEsperado = dvCalculado.toString();
    }

    return dv === dvEsperado;
};

export default validarRut;

const { actualizarBarbero } = require('./src/controllers/barberos.js');
const req = {
    params: { id: 1 },
    body: {
        nombre: 'Mateo Editado',
        apellido: 'Gomez',
        email: 'mateo@tuturnoya.com',
        telefono: '3564112233',
        sucursalId: 1,
        horarioEntrada: '09:00',
        horarioSalida: '19:00'
    }
};
const res = {
    status: function(code) {
        this.statusCode = code;
        return this;
    },
    json: function(data) {
        console.log(`Status: ${this.statusCode}`, data);
    }
};

actualizarBarbero(req, res).then(() => console.log('Done')).catch(e => console.error('Caught:', e));

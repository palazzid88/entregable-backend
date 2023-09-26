const { expect } = require('chai');
const supertest = require('supertest');
const faker = require('faker');
const app = require('../app');
const jwt = require('jsonwebtoken'); // Importa la librería JWT

const requester = supertest('http://localhost:8080/');

const mockUser = {
  email: faker.internet.email(),
  firstName: 'Marcelo',
  lastName: 'Gallardo',
  age: "22",
  password: "91218",
};

describe('REGISTER / LOGIN / SESSION Pruebas para la autenticación', () => {
  let authToken; // Variable para almacenar el token JWT

  it('Debería registrar al usuario y redireccionar a /perfil', (done) => {
    console.log('Iniciando prueba de registro de usuario');
    requester
      .post('auth/register')
      .send(mockUser)
      .expect(302)
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud HTTP:', err);
          return done(err);
        }

        console.log('Respuesta HTTP:', res.status, res.header.location);
        expect(res.header.location).to.equal('/auth/perfil');

        done();
      });
  });

  it('Debe obtener un token JWT', (done) => {
    console.log('Obteniendo token JWT');
    requester
      .post('auth/login') // Realiza el inicio de sesión para obtener el token
      .send({
        email: mockUser.email,
        password: mockUser.password,
      })
      .expect(200)
      .end((err, res) => {
        if (err) {
          console.error('Error en la solicitud HTTP:', err);
          return done(err);
        }

        // El token JWT estará en la respuesta como 'token'
        authToken = res.body.token;
        console.log('Token JWT obtenido:', authToken);

        expect(authToken).to.be.ok;

        done();
      });
  });

  it('Enviar token JWT para ver el contenido del usuario', async () => {
    console.log('Iniciando prueba de contenido de usuario con token JWT');

    const { body } = await requester
      .get('auth/session/current')
      .set('Authorization', `Bearer ${authToken}`); // Incluye el token JWT en la cabecera

    console.log('Contenido del usuario:', body.email);

    expect(body.email).to.be.eql(mockUser.email);
  });
});

const { expect } = require('chai');
const supertest = require('supertest');
const faker = require('faker');
const app = require('../app');


const requester = supertest('http://localhost:8080/');

const mockUser = {
  email: faker.internet.email(),
  firstName: 'Marcelo',
  lastName: 'Gallardo',
  age: "22",
  password: "91218",
};

describe('REGISTER / LOGIN / SESSION Pruebas para la autenticación ', () => {
    let cookieName;
    let cookieValue;
  
    it('Debería registrar al usuario y redireccionar a /perfil', (done) => {
      console.log('Iniciando prueba de registro de usuario');
      requester
        .post('auth/register')
        .send(mockUser)
        .expect(302)
        .end((err, res) => {
          if (err) {
            console.log("entro en el err del if")
            console.error('Error en la solicitud HTTP:', err);
            return done(err);
          }
  
          console.log('Respuesta HTTP:', res.status, res.header.location);
          expect(res.header.location).to.equal('/auth/perfil');
  
          done();
        });
    });
  
    it('Debe DEVOLVER UNA COOKIE', async () => {
      console.log('recuperando cookie');
      const result = await requester.get('/auth/perfil')
  
      const cookie = result.headers['set-cookie'][0];
      console.log('Cookie de sesión:', cookie);
  
      expect(cookie).to.be.ok;
  
      cookieName = cookie.split('=')[0];
      cookieValue = cookie.split('=')[1];
  
      console.log("name", cookieName);
      console.log("value", cookieValue)
  
      expect(cookieName).to.be.ok.and.eql('backendCoder');
      expect(cookieValue).to.be.ok;
    });
  
    it('Enviar cookie para ver el contenido del user', async () => {
      console.log('Iniciando prueba de contenido de usuario con cookie');
      console.log("name & value", cookieName, cookieValue);
  
      const { _body } = await requester.get('auth/session/current').set('Cookie', [`${cookieName}=${cookieValue}`]);
  
      console.log('Contenido del usuario:', _body.email);
  
      expect(_body.email).to.be.eql(mockUser.email);
    });
  });
  
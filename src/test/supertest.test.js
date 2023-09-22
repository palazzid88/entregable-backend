const { expect } = require('chai');
const supertest = require('supertest');
const faker = require('faker');
const app = require('../app');

const requester = supertest('http://127.0.0.1:8081');

const mockUser = {
  firstName: 'Marcelo',
  lastName: 'Gallardo',
  email: faker.internet.email(),
  password: '9-12-18',
  age: 22,
};

let cookieName;
let cookieValue;

describe('REGISTER / LOGIN / SESSION   Pruebas para la autenticación ', () => {
  it('Debería registrar al usuario y redireccionar a /login', (done) => {
    console.log('Iniciando prueba de registro de usuario');
    requester
      .post('/auth/register')
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
  })

  it('Debe loggear un user y DEVOLVER UNA COOKIE', async () => {
    console.log('Iniciando prueba de inicio de sesión');
    const result = await requester.post('/auth/login').send({
      email: mockUser.email,
      password: mockUser.password,
    });

    const cookie = result.headers['set-cookie'][0];
    console.log('Cookie de sesión:', cookie);

    expect(cookie).to.be.ok;

    cookieName = cookie.split('=')[0];
    cookieValue = cookie.split('=')[1];

    expect(cookieName).to.be.ok.and.eql('coderCookie');
    expect(cookieValue).to.be.ok;
  });

  it('Enviar cookie para ver el contenido del user', async () => {
    console.log('Iniciando prueba de contenido de usuario con cookie');
    const { _body } = await requester
      .get('/auth/session/current')
      .set('Cookie', [`${cookieName}=${cookieValue}`]);
    console.log('Contenido del usuario:', _body.email);

    expect(_body.email).to.be.eql(mockUser.email);
  });
});

describe('Pruebas para la ruta api/carts/', () => {
  it('Debería obtener un arreglo de carritos', async () => {
    console.log('Iniciando prueba de obtener carritos');
    const response = await requester.get('/api/carts');
    console.log('Respuesta HTTP:', response.status, response.body);

    expect(response.status).to.equal(200);
    expect(response.body).to.be.an('array');
  });

  it('Debería crear un nuevo carrito y devolver el ID', async () => {
    console.log('Iniciando prueba de crear carrito');
    const response = await requester.post('/api/carts');
    console.log('Respuesta HTTP:', response.status, response.body);

    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('id').that.is.a('string');
  });

  it('Debería agregar un producto al carrito y devolver un mensaje si el usuario está autenticado y autorizado', async () => {
    console.log('Iniciando prueba de agregar producto al carrito');
    const userCredentials = {
      email: "Isabel.Gottlieb@gmail.com",
      password: "123",
    };

    const loginResponse = await requester
      .post('/auth/login')
      .send(userCredentials);
    console.log('Respuesta de inicio de sesión:', loginResponse.status);

    expect(loginResponse.status).to.equal(302);

    const cartId = '6507178f5d889446eb8a255e';
    const productId = '64f5223dada87c1b451a52d6';
    const quantityToAdd = 1;

    const response = await requester
      .put(`/api/carts/${cartId}/product/${productId}`)
      .set('Cookie', loginResponse.headers['set-cookie'])
      .send({ quantity: quantityToAdd });
    console.log('Respuesta HTTP:', response.status, response.body);

    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('message').that.is.a('string');
  });
});

describe('Pruebas para la ruta api/products/', () => {
  it('Debería obtener un arreglo de productos', async () => {
    console.log('Iniciando prueba de obtener productos');
    const response = await requester.get('/api/products');
    console.log('Respuesta HTTP:', response.status, response.body);

    expect(response.status).to.equal(200);
    expect(response.body.payload).to.be.an('array');
  });

  it('Debería crear un nuevo producto cuando el usuario está autenticado y autorizado', async () => {
    console.log('Iniciando prueba de crear producto');
    const userCredentials = {
      email: "Isabel.Gottlieb@gmail.com",
      password: "123",
    };

    const loginResponse = await requester
      .post('/auth/login')
      .send(userCredentials);
    console.log('Respuesta de inicio de sesión:', loginResponse.status);

    expect(loginResponse.status).to.equal(302);

    const productData = {
      title: 'Producto de prueba',
      description: 'Descripción de prueba',
      code: 'tl0kjjo1',
      price: 10,
      stock: 100,
      status: 'true',
    };

    const response = await requester
      .post('/api/products')
      .set('Cookie', loginResponse.headers['set-cookie'])
      .field('title', productData.title)
      .field('description', productData.description)
      .field('code', productData.code)
      .field('price', productData.price)
      .field('stock', productData.stock)
      .field('status', productData.status)
      .attach('thumbnails', './src/test/house.jpg');
    console.log('Respuesta HTTP:', response.status, response.body);

    expect(response.status).to.equal(201);
    expect(response.body).to.be.an('object');
    expect(response.body).to.have.property('msg', 'Product create');
    expect(response.body).to.have.property('data');

    const createdProduct = response.body.data;
    expect(createdProduct).to.have.property('title', productData.title);
    expect(createdProduct).to.have.property('description', productData.description);
    expect(createdProduct).to.have.property('code', productData.code);
  });
});
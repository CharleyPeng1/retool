/**
 * Copyright (C) Retool, Inc - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Retool, Inc <contact@retool.in>, 2017
 */

require('../common.js')

describe('Users controller', () => {
  describe('Login and signup', () => {
    it('Should create a new user and org on signup', () => {
      return chai.request(server)
        .post('/api/signup')
        .set('origin', 'https://retool.in')
        .send({
          email: 'test@tfffest.com',
          password: 'asdfasdf',
          firstName: 'Test',
          lastName: 'Ing'
        })
        .then((res) => {
          expect(res).to.have.status(201)
          expect(res.body.user.firstName).to.equal('Test')
          expect(res.body.user.lastName).to.equal('Ing')
          expect(res.body.user.email).to.equal('test@tfffest.com')
        })
        .catch((err) => {
          console.log(err)
        })
    })

    it('Should not create a new user if email in use', () => {
      return chai.request(server)
        .post('/api/signup')
        .set('origin', 'https://retool.in')
        .send({
          email: 'chris@retool.in',
          password: 'asdfasdf',
          firstName: 'Test',
          lastName: 'Ing'
        })
        .then((res) => {
          console.log(res)
        })
        .catch((err) => {
          const res = err.response
          expect(res).to.have.status(422)
          expect(res.body.error).to.be.true
          expect(res.body.message).to.be.equal('An account with that email address already exists.')
        })
    })

    it('Should login if email and pwd match', () => {
      return chai.request(server)
        .post('/api/login')
        .set('origin', 'https://retool.in')
        .send({
          email: 'rachel@example.com',
          password: 'asdfasdf',
        })
        .then((res) => {
          expect(res).to.have.status(200)
          expect(res.body.user.email).to.equal('rachel@example.com')
          expect(res.body.user.firstName).to.equal('Rachel')
          expect(res.body.user.lastName).to.equal('Ross')
        })
    })

    it('Should fail login if email and pwd do not match', () => {
      return chai.request(server)
        .post('/api/login')
        .set('origin', 'https://retool.in')
        .send({
          email: 'rachel@example.com',
          password: 'INCORRECT_PASSWORD',
        })
        .catch((err) => {
          const res = err.response
          expect(res).to.have.status(422)
          expect(res.body.error).to.be.true
          expect(res.body.message).to.be.equal('Incorrect email or password.')
        })
    })

    it('Should refuse login if origin is not whitelisted', () => {
      return chai.request(server)
        .post('/api/login')
        .set('origin', 'https://example.com')
        .send({
          email: 'rachel@example.com',
          password: 'INCORRECT_PASSWORD',
        })
        .catch((err) => {
          const res = err.response
          expect(res).to.have.status(500)
          expect(res.body).to.be.deep.equal({})
        })
    })
  })
})

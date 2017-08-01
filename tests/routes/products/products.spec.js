import { expect, should } from 'chai';
import server from '../../utils/server.mock';

const ENDPOINT = '/api/items';

describe(`search items`, () => {
  it('should return ipods', (done) => {
    before(function () {
      this.timeout(10000);
    });

    server.get(ENDPOINT + '?search=ipod')
      .end((err, res) => {
        const { body } = res;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(body[0]).to.be.a('object');
        expect(body).to.have.length(1);
        expect(body[0]).to.have.property('author');
        expect(body[0]).to.have.property('categories');
        expect(body[0].categories).to.be.a('array');
        expect(body[0]).to.have.property('items');

        body[0].items.forEach((item) => {
          expect(item).to.have.property('price');
        });

        done();
      });
  });

  it('should be return nothing', (done) => {
    before(function () {
      this.timeout(10000);
    });

    server.get(ENDPOINT + '?search=lalalallalalelelelelle')
      .end((err, res) => {
        const { body } = res;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(body[0]).to.be.a('object');
        expect(body).to.have.length(1);
        expect(body[0]).to.have.property('author');
        expect(body[0]).to.have.property('categories');
        expect(body[0].categories).to.be.a('array').that.is.empty;
        expect(body[0].items).that.is.empty;

        done();
      });
  });

  it('should be error', (done) => {
    before(function () {
      this.timeout(10000);
    });

    server.get(ENDPOINT + '?param=a')
      .end((err, res) => {
        const { body } = res;

        expect(res).to.have.status(500);
        expect(err).is.not.null;

        done();
      });
  });
});

describe(`get item by id`, () => {
  it('should return ipods', (done) => {
    before(function () {
      this.timeout(10000);
    });

    server.get(ENDPOINT + '/MLB799032470')
      .end((err, res) => {
        const { body } = res;

        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(body[0]).to.be.a('object');
        expect(body).to.have.length(1);
        expect(body[0]).to.have.property('author');
        expect(body[0]).to.have.property('item');
        expect(body[0].item).to.have.property('id');
        expect(body[0].item).to.have.property('title');
        expect(body[0].item).to.have.property('price');
        expect(body[0].item).to.have.property('picture');
        expect(body[0].item).to.have.property('condition');
        expect(body[0].item).to.have.property('free_shipping');
        expect(body[0].item).to.have.property('sold_quantity');
        expect(body[0].item).to.have.property('description');

        done();
      });
  });

  it('should return nothing', (done) => {
    before(function () {
      this.timeout(10000);
    });

    server.get(ENDPOINT + '/lalalallaaoeoeoe')
      .end((err, res) => {
        const { body } = res;

        expect(res).to.have.status(500);
        expect(err).is.not.null;

        done();
      });
  });
});
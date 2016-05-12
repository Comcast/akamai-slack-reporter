var fetchers = require('../src/fetchers'),
    assert = require('assert'),
    sinon = require('sinon');

describe('fetchers', function() {
  beforeEach(function() {
    this.eg = {
      auth: function() {},
      send: function() {}
    };

    sinon.spy(this.eg, 'auth');
    sinon.spy(this.eg, 'send');

    this.cb = function() {};
  });

  describe('PAPI fetchers', function() {
    describe('#groups', function() {
      beforeEach(function() {
        fetchers.groups(this.eg, ['groups'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/groups/');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });

    describe('#products', function() {
      beforeEach(function() {
        fetchers.products(this.eg, ['products', 'contract1'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/products?contractId=contract1');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });

    describe('#hostnames', function() {
      beforeEach(function() {
        fetchers.hostnames(this.eg, ['hostnames', 'group1', 'contract1'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/edgehostnames?contractId=contract1&groupId=group1');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });

    describe('#hostname', function() {
      beforeEach(function() {
        fetchers.hostname(this.eg, ['hostname', 'hostId1', 'group1', 'contract1'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/edgehostnames/hostId1?contractId=contract1&groupId=group1');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });

    describe('#digitalproperties', function() {
      beforeEach(function() {
        fetchers.digitalproperties(this.eg, ['digitalproperties', 'group1', 'contract1'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/properties?contractId=contract1&groupId=group1');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });

    describe('#digitalproperty', function() {
      beforeEach(function() {
        fetchers.digitalproperty(this.eg, ['digitalproperty', 'propName', 'group1', 'contract1'], this.cb);
      });

      describe('how it authenticates with Akamai', function() {
        beforeEach(function() {
          this.reqToSign = this.eg.auth.getCall(0).args[0];
        });

        it('signs the proper request', function() {
          assert.equal(this.reqToSign.path, '/papi/v0/properties?contractId=contract1&groupId=group1');
          assert.equal(this.reqToSign.method, 'GET');
          assert.equal(this.reqToSign.headers['Content-Type'], 'application/json');
        });
      });

      it('makes the proper request', function() {
        assert(this.eg.send.calledOnce);
      });
    });
  });
});

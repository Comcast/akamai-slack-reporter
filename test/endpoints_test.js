var eps = require('../src/endpoints'),
    assert = require('assert');

describe('endpoints', function() {
  describe('GTM endpoints', function() {
    describe('#domains', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.domains(), '/config-gtm/v1/domains');
      });
    });

    describe('#domain', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.domain('foo'), '/config-gtm/v1/domains/foo');
      });
    });

    describe('#livenesstests', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.livenesstests('prop', 'domain'), '/config-gtm/v1/domains/domain/properties/prop');
      });
    });
  });

  describe('PAPI endpionts', function() {
    describe('#papiBase', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.papiBase(), '/papi/v0');
      });
    });

    describe('#groups', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.groups(), '/papi/v0/groups/');
      });
    });

    describe('#products', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.products('123'), '/papi/v0/products?contractId=123');
      });
    });

    describe('#hostnamesBase', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.hostnamesBase(), '/papi/v0/edgehostnames');
      });
    });

    describe('#query', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.query('group1', 'contract1'), '?contractId=contract1&groupId=group1');
      });
    });

    describe('#hostnames', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.hostnames('group1', 'contract1'), '/papi/v0/edgehostnames?contractId=contract1&groupId=group1');
      });
    });

    describe('#hostname', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.hostname('hostId1', 'group1', 'contract1'), '/papi/v0/edgehostnames/hostId1?contractId=contract1&groupId=group1');
      });
    });

    describe('#digitalPropsBase', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropsBase(), '/papi/v0/properties');
      });
    });

    describe('#digitalProps', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalProps('group1', 'contract1'), '/papi/v0/properties?contractId=contract1&groupId=group1');
      });
    });

    describe('#digitalProp', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalProp('propId1', 'group1', 'contract1'), '/papi/v0/properties/propId1?contractId=contract1&groupId=group1');
      });
    });

    describe('#digitalPropBase', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropBase('prop1'), '/papi/v0/properties/prop1');
      });
    });

    describe('#digitalPropVersionsBase', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropVersionsBase('prop1'), '/papi/v0/properties/prop1/versions');
      });
    });

    describe('#digitalPropVersions', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropVersions('prop1', 'group1', 'contract1'), '/papi/v0/properties/prop1/versions?contractId=contract1&groupId=group1');
      });
    });

    describe('#digitalPropVersion', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropVersion('version1', 'prop1', 'group1', 'contract1'), '/papi/v0/properties/prop1/versions/version1?contractId=contract1&groupId=group1');
      });
    });

    describe('#digitalPropLatestVersion', function() {
      it('returns the proper endpoint', function() {
        assert.equal(eps.digitalPropLatestVersion('prop1', 'group1', 'contract1'), '/papi/v0/properties/prop1/versions/latest?contractId=contract1&groupId=group1');
      });
    });
  });
});

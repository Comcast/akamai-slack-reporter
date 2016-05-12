var formatters = require('../src/formatters'),
    papiFixtures = require('./fixtures/papi'),
    domainsFixtures = require('./fixtures/domains'),
    domainFixtures = require('./fixtures/domain'),
    assert = require('assert');

describe('formatters', function() {
  describe('#domains', function() {
    it('formats the domain names', function() {
      var formatted = formatters.domains(domainsFixtures.domains);

      assert.equal(formatted, 'Domains:\n\ndomain1\ndomain2');
    });
  });

  describe('#domain', function() {
    it('formats the domain', function() {
      var formatted = formatters.domain(domainFixtures.domain);

      assert.equal(formatted, 'Domain:\n\nName: domain1\nLast modified: lastModified\nType: type\nStatus: message');
    });
  });

  describe('#digitalproperty', function() {
    it('finds and formats the correct digital property', function() {
      var formatted = formatters.digitalproperty(papiFixtures.digitalProperties, ['digitalproperty', 'example.com']);

      assert.equal(formatted, 'Name: example.com\nID: propertyId\nAccount ID: accountId\nContract ID: someContractId\nGroup ID: someGroupId\nLatest version: 2\nStaging version: 1\nProd version: null\nNote: some note');
    });
  });
});

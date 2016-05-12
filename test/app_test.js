process.env.SLACK_TOKEN = '123';

var request = require('supertest'),
    nock = require('nock'),
    papiFixtures = require('./fixtures/papi'),
    Reporter = require('../src/app'),
    reporter = new Reporter({
      clientToken: 'clientToken',
      clientSecret: 'clientSecret',
      accessToken: 'accessToken',
      host: 'https://host.com'
    }),
    mockPost = function(text) {
      return nock('https://hooks.slack.com')
                .post('/services/undefined', {
                  username: 'Akamai',
                  channel: 'channel id',
                  icon_emoji: ':ghost:',
                  text: text
                })
                .reply(200);
    },
    mockGet = function(path, resp) {
      return nock('https://host.com')
              .get(path)
              .reply(200, resp);
    },
    expectSuccess = function(text, done) {
      request(reporter.app)
        .post('/integration')
        .send({
          token: '123',
          user_name: 'user',
          channel_id: 'channel id',
          text: text
        })
        .expect(200, done);
    };

describe('GET /', function() {
  it('returns "Hello world!"', function(done) {
    request(reporter.app)
      .get('/')
      .expect(200, 'Hello world!', done);
  });
});

describe('POST /integration', function() {
  describe('when the request token does not match the SLACK_TOKEN env variable', function() {
    it('returns 401', function(done) {
      request(reporter.app)
        .post('/integration')
        .send({
          token: '456',
        })
        .expect(401, done);
    });
  });

  describe('when the request body is empty', function() {
    it('returns the bot help info', function(done) {
      var slack = mockPost(
            '```Query Akamai from Slack!\nhttps://github.com/Comcast/akamai-slack-reporter\n\n---\n\nGTM API: https://developer.akamai.com/api/luna/config-gtm/overview.html\nAvailable GTM traffic commands:\ndomains\ndomain <domain.akadns.net>\ndatacenters <domain.akadns.net>\ndatacenter <dataCenterId> <domain.akadns.net>\nproperties <domain.akadns.net>\nproperty <propertyName> <domain.akadns.net>\nstatus <domain.akadns.net>\nlivenesstests <propertyName> <domain.akadns.net>\n\n---\n\nPAPI API: https://developer.akamai.com/api/luna/papi/overview.html\nAvailable property commands:\ngroups\nproducts <contractId>\nhostnames <groupId> <contractId>\nhostname <hostId> <groupId> <contractId>\ndigitalproperties <groupId> <contractId>\ndigitalproperty <propertyName> <groupId> <contractId>\ndigitalpropertyid <propertyName> <groupId> <contractId>\ndigitalpropertyversions <propertyName> <groupId> <contractId>\ndigitalpropertyversion <version> <propertyName> <groupId> <contractId>\ndigitalpropertyxml <propertyName> <groupId> <contractId>```'
          );

      expectSuccess('', done);
    });
  });

  describe('when it is queried for domains info', function() {
    it('returns the Akamai domains info', function(done) {
      var slack = mockPost(
            '```Domains:\n\nexample.akadns.net\nexample2.akadns.net```'
          ),
          akamai = mockGet('/config-gtm/v1/domains', {
            items: [{name: 'example.akadns.net'}, {name: 'example2.akadns.net'}]
          });

      expectSuccess('domains', done);
    });
  });

  describe('when it is queried for domain info', function() {
    it('returns the Akamai info for a domain', function(done) {
      var slack = mockPost(
            '```Domain:\n\nName: example.akadns.net\nLast modified: lastModified\nType: type\nStatus: status message```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net', {
            name: 'example.akadns.net',
            type: 'type',
            lastModified: 'lastModified',
            status: {
              message: 'status message'
            }
          });

      expectSuccess('domain example.akadns.net', done);
    });
  });

  describe('when it is queried for data centers info', function() {
    it('returns the Akamai info for data centers associated with the queried domain', function(done) {
      var slack = mockPost(
            '```Data centers:\n\nData center:\n\nNickname: nickname1\nId: 1\n---\nData center:\n\nNickname: nickname2\nId: 2```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/datacenters', {
            items:[{
              nickname: 'nickname1',
              datacenterId: 1
            },{
              nickname: 'nickname2',
              datacenterId: 2
            }]
          });


      expectSuccess('datacenters example.akadns.net', done);
    });
  });

  describe('when it is queried for data center info', function() {
    it('returns the Akamai info for the data center associated with the queried domain', function(done) {
      var slack = mockPost(
            '```Data center:\n\nNickname: nickname1\nId: 1```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/datacenters/1', {
            nickname: 'nickname1',
            datacenterId: 1
          });

      expectSuccess('datacenter 1 example.akadns.net', done);
    });
  });

  describe('when it is queried for properties info', function() {
    it('returns the Akamai properties info for a domain', function(done) {
      var slack = mockPost(
            '```Properties:\n\nproperty1\nproperty2```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/properties', {
            items: [{
              name: 'property1'
            }, {
              name: 'property2'
            }]
          });

      expectSuccess('properties example.akadns.net', done);
    });

    it('sorts the elements by their reverse domain name', function(done) {
      var slack = mockPost(
            '```Properties:\n\nfoo.bar\nfoo.zoo\nstaging.foo.zoo```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/properties', {
            items: [{
              name: 'staging.foo.zoo'
            }, {
              name: 'foo.zoo'
            }, {
              name: 'foo.bar'
            }]
          });

      expectSuccess('properties example.akadns.net', done);
    });
  });

  describe('when it is queried for property info', function() {
    it('returns the Akamai property info for the property & domain', function(done) {
      var slack = mockPost(
            '```Property:\n\nName: property\nLast modified: lastModified\nType: weighted-round-robin\nTrafficTargets:\n\tId: 4\n\tEnabled: true\n\tWeight: undefined\n\tServers: 3, 4```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/properties/property', {
            name: 'property',
            type: 'weighted-round-robin',
            lastModified: 'lastModified',
            trafficTargets: [{
              datacenterId: 4,
              enabled: true,
              servers: ['3', '4']
            }]
          });

      expectSuccess('property property example.akadns.net', done);
    });
  });

  describe('when it is queried for status info', function() {
    it('returns the Akamai domain status info', function(done) {
      var slack = mockPost(
            '```Propagation status: DENIED\nMessage: some message\nPropagation status date: a date\nPassing validation: undefined\nChange ID: 123```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/status/current', {
            message: 'some message',
            propagationStatus: 'DENIED',
            propagationStatusDate: 'a date',
            changeId: '123',
            paddingValidation: false
          });

      expectSuccess('status example.akadns.net', done);
    });
  });

  describe('when it is queried for GTM liveness tests info', function() {
    it('returns the Akamai liveness tests info', function(done) {
      var slack = mockPost(
            '```Liveness tests:\n\ndisableNonstandardPortWarning: false\nhostHeader: null\nhttpError3xx: true\nhttpError4xx: true\nhttpError5xx: true\nname: liveness test\nrequestString: null\nresponseString: null\ntestInterval: 60\ntestObject: /_status/health_check\ntestObjectPort: 443\ntestObjectProtocol: HTTPS\ntestObjectUsername: null\ntestObjectPassword: null\ntestTimeout: 25\nsslClientCertificate: null\nsslClientPrivateKey: null```'
          ),
          akamai = mockGet('/config-gtm/v1/domains/example.akadns.net/properties/prop', {
            cname: 'xtv.comcast.net',
            livenessTests: [{
              disableNonstandardPortWarning: false,
              hostHeader: null,
              httpError3xx: true,
              httpError4xx: true,
              httpError5xx: true,
              name: 'liveness test',
              requestString: null,
              responseString: null,
              testInterval: 60,
              testObject: '/_status/health_check',
              testObjectPort: 443,
              testObjectProtocol: 'HTTPS',
              testObjectUsername: null,
              testObjectPassword: null,
              testTimeout: 25.0,
              sslClientCertificate: null,
              sslClientPrivateKey :null
            }]
          });

      expectSuccess('livenesstests prop example.akadns.net', done);
    });
  });

  describe('when it is queried for groups info', function() {
    it('returns the Akamai groups info', function(done) {
      var slack = mockPost(
            '```Group name: group one\nGroup ID: 1\nParent group ID: parent1\nContract IDs: contract1, contract1-2\n---\nGroup name: group two\nGroup ID: 2\nParent group ID: parent2\nContract IDs: contract2, contract2-2```'
          ),
          akamai = mockGet('/papi/v0/groups/', {
            groups: {
              items: [{
                groupName: 'group one',
                groupId: '1',
                parentGroupId: 'parent1',
                contractIds: ['contract1', 'contract1-2']
              }, {
                groupName: 'group two',
                groupId: '2',
                parentGroupId: 'parent2',
                contractIds: ['contract2', 'contract2-2']
              }],
            }
          });

      expectSuccess('groups', done);
    });

    it('correctly handles scenarios where there are no contract IDs', function(done) {
      var slack = mockPost(
            '```Group name: group one\nGroup ID: 1\nParent group ID: parent1\nContract IDs: \n---\nGroup name: group two\nGroup ID: 2\nParent group ID: parent2\nContract IDs: ```'
          ),
          akamai = mockGet('/papi/v0/groups/', {
            groups: {
              items: [{
                groupName: 'group one',
                groupId: '1',
                parentGroupId: 'parent1',
                contractIds: false
              }, {
                groupName: 'group two',
                groupId: '2',
                parentGroupId: 'parent2'
              }],
            }
          });

      expectSuccess('groups', done);
    });
  });

  describe('when it is queried for products info', function() {
    it('returns the Akamai products info', function(done) {
      var slack = mockPost(
            '```Name: prod one\nID: 1\n---\nName: prod two\nID: 2```'
          ),
          akamai = mockGet('/papi/v0/products?contractId=someId', {
            products: {
              items: [{
                productName: 'prod one',
                productId: '1'
              }, {
                productName: 'prod two',
                productId: '2'
              }],
            }
          });

      expectSuccess('products someId', done);
    });
  });

  describe('when it is queried for hostnames info', function() {
    it('returns the Akamai hostnames info associated with the group and contract', function(done) {
      var slack = mockPost(
            '```ID: hostId1\nDomain prefix: foo.com\nDomain suffix: edge.net\nEdge hostname domain: foo.com.edge.net\nIP version: IPV4\nSecure: false\n---\nID: hostId2\nDomain prefix: bar.com\nDomain suffix: edge.net\nEdge hostname domain: bar.com.edge.net\nIP version: IPV4\nSecure: true```'
          ),
          akamai = mockGet('/papi/v0/edgehostnames?contractId=someContractId&groupId=someGroupId', {
            edgeHostnames: {
              items: [{
                edgeHostnameId: 'hostId1',
                domainPrefix: 'foo.com',
                domainSuffix: "edge.net",
                ipVersionBehavior: 'IPV4',
                secure : false,
                edgeHostnameDomain: 'foo.com.edge.net'
              }, {
                edgeHostnameId: 'hostId2',
                domainPrefix: 'bar.com',
                domainSuffix: "edge.net",
                ipVersionBehavior: 'IPV4',
                secure : true,
                edgeHostnameDomain: 'bar.com.edge.net'
              }],
            }
          });

      expectSuccess('hostnames someGroupId someContractId', done);
    });
  });

  describe('when it is queried for an individual hostname', function() {
    it('returns the Akamai hostname info', function(done) {
      var slack = mockPost(
            '```ID: hostId1\nDomain prefix: foo.com\nDomain suffix: edge.net\nEdge hostname domain: foo.com.edge.net\nIP version: IPV4\nSecure: false```'
          ),
          akamai = mockGet('/papi/v0/edgehostnames/hostId1?contractId=someContractId&groupId=someGroupId', {
            edgeHostnames: {
              items: [{
                edgeHostnameId: 'hostId1',
                domainPrefix: 'foo.com',
                domainSuffix: "edge.net",
                ipVersionBehavior: 'IPV4',
                secure : false,
                edgeHostnameDomain: 'foo.com.edge.net'
              }],
            }
          });

      expectSuccess('hostname hostId1 someGroupId someContractId', done);
    });
  });

  describe('when it is queried for digital properties', function() {
    it('returns the Akamai digital properties info associated with the group and contract', function(done) {
      var slack = mockPost(
            '```Name: example.com\nID: propertyId\nAccount ID: accountId\nContract ID: someContractId\nGroup ID: someGroupId\nLatest version: 2\nStaging version: 1\nProd version: null\nNote: some note\n---\nName: foo.com\nID: propertyIdTwo\nAccount ID: accountId\nContract ID: someContractId\nGroup ID: someGroupId\nLatest version: 2\nStaging version: 1\nProd version: null\nNote: some note```'
          ),
          akamai = mockGet('/papi/v0/properties?contractId=someContractId&groupId=someGroupId', {
            properties: {
              items: [{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyId',
                propertyName: 'example.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              },{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyIdTwo',
                propertyName: 'foo.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              }]
            }
          });

      expectSuccess('digitalproperties someGroupId someContractId', done);
    });
  });

  describe('when it is queried for digital property', function() {
    it('returns the Akamai digital property info associated with the name, group, and contract', function(done) {
      var slack = mockPost(
            '```Name: example.com\nID: propertyId\nAccount ID: accountId\nContract ID: someContractId\nGroup ID: someGroupId\nLatest version: 2\nStaging version: 1\nProd version: null\nNote: some note```'
          ),
          akamai = mockGet('/papi/v0/properties?contractId=someContractId&groupId=someGroupId', papiFixtures.digitalProperties);

      expectSuccess('digitalproperty example.com someGroupId someContractId', done);
    });
  });

  describe('when it is queried for a digital property id', function() {
    it('returns the Akamai digital property id associated with the name, group, and contract', function(done) {
      var slack = mockPost('```123```'),
          akamai = mockGet('/papi/v0/properties?contractId=someContractId&groupId=someGroupId', {
            properties: {
              items: [{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: '123',
                propertyName: 'example.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              },{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: '456',
                propertyName: 'foo.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              }]
            }
          });

      expectSuccess('digitalpropertyid example.com someGroupId someContractId', done);
    });
  });

  describe('when it is queried for digital property versions', function() {
    it('returns the Akamai digital property versions info associated with the name, group, and contract', function(done) {
      var slack = mockPost(
            '```Version: 1\nUpdated by: Some User\nUpdated date: 2014-05-10T19:06:13Z\nProd status: INACTIVE\nStaging status: ACTIVE\nEtag: someEtag\nNote: updated\n---\nVersion: 2\nUpdated by: Another User\nUpdated date: 2015-05-10T19:06:13Z\nProd status: INACTIVE\nStaging status: ACTIVE\nEtag: someEtag\nNote: updated again```'
          ),
          akamaiOne = mockGet('/papi/v0/properties?contractId=someContractId&groupId=someGroupId', {
            properties: {
              items: [{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyId',
                propertyName: 'example.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              },{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyIdTwo',
                propertyName: 'foo.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              }]
            }
          }),
          akamaiTwo = mockGet('/papi/v0/properties/propertyId/versions?contractId=someContractId&groupId=someGroupId', {
            versions: {
              items: [{
                propertyVersion: 1,
                updatedByUser: 'Some User',
                updatedDate: '2014-05-10T19:06:13Z',
                productionStatus: 'INACTIVE',
                stagingStatus: 'ACTIVE',
                etag: 'someEtag',
                productId: 'productId',
                note: 'updated'
              },{
                propertyVersion: 2,
                updatedByUser: 'Another User',
                updatedDate: '2015-05-10T19:06:13Z',
                productionStatus: 'INACTIVE',
                stagingStatus: 'ACTIVE',
                etag: 'someEtag',
                productId: 'productId',
                note: 'updated again'
              }]
            }
          });

      expectSuccess('digitalpropertyversions example.com someGroupId someContractId', done);
    });
  });

  describe('when it is queried for a digital property version', function() {
    it('returns the Akamai digital property version info associated with the name, group, and contract', function(done) {
      var slack = mockPost(
            '```Version: 1\nUpdated by: Some User\nUpdated date: 2014-05-10T19:06:13Z\nProd status: INACTIVE\nStaging status: ACTIVE\nEtag: someEtag\nNote: updated```'
          ),
          akamaiOne = mockGet('/papi/v0/properties?contractId=someContractId&groupId=someGroupId', {
            properties: {
              items: [{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyId',
                propertyName: 'example.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              },{
                accountId: 'accountId',
                contractId: 'someContractId',
                groupId: 'someGroupId',
                propertyId: 'propertyIdTwo',
                propertyName: 'foo.com',
                latestVersion: 2,
                stagingVersion: 1,
                productionVersion: null,
                note: 'some note'
              }]
            }
          }),
          akamaiTwo = mockGet('/papi/v0/properties/propertyId/versions/1?contractId=someContractId&groupId=someGroupId', {
            versions: {
              items: [{
                propertyVersion: 1,
                updatedByUser: 'Some User',
                updatedDate: '2014-05-10T19:06:13Z',
                productionStatus: 'INACTIVE',
                stagingStatus: 'ACTIVE',
                etag: 'someEtag',
                productId: 'productId',
                note: 'updated'
              }]
            }
          });

      expectSuccess('digitalpropertyversion 1 example.com someGroupId someContractId', done);
    });
  });
});

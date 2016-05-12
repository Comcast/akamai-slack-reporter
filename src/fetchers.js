var eps = require('./endpoints'),
    helpers = require('./helpers'),
    fetchers;

fetchers = {

  // GTM Traffic
  domains: function(eg, args, callback) {
    fetchData(eg, { path: eps.domains() }, callback);
  },

  domain: function(eg, args, callback) {
    fetchData(eg, { path: eps.domain(args[1]) }, callback);
  },

  datacenters: function(eg, args, callback) {
    fetchData(eg, { path: eps.datacenters(args[1]) }, callback);
  },

  datacenter: function(eg, args, callback) {
    fetchData(eg, { path: eps.datacenter(args[2], args[1]) }, callback);
  },

  properties: function(eg, args, callback) {
    fetchData(eg, { path: eps.properties(args[1]) }, callback);
  },

  property: function(eg, args, callback) {
    fetchData(eg, { path: eps.property(args[1], args[2]) }, callback);
  },

  status: function(eg, args, callback) {
    fetchData(eg, { path: eps.status(args[1]) }, callback);
  },

  livenesstests: function(eg, args, callback) {
    fetchers.property(eg, args, callback);
  },

  // PAPI
  groups: function(eg, args, callback) {
    fetchData(eg, { path: eps.groups() }, callback);
  },

  products: function(eg, args, callback) {
    fetchData(eg, { path: eps.products(args[1]) }, callback);
  },

  hostnames: function(eg, args, callback) {
    fetchData(eg, { path: eps.hostnames(args[1], args[2]) }, callback);
  },

  hostname: function(eg, args, callback) {
    fetchData(eg, { path: eps.hostname(args[1], args[2], args[3]) }, callback);
  },

  digitalproperties: function(eg, args, callback) {
    fetchData(eg, { path: eps.digitalProps(args[1], args[2]) }, callback);
  },

  digitalproperty: function(eg, args, callback) {
    fetchData(eg, { path: eps.digitalProps(args[2], args[3]) }, callback);
  },

  digitalpropertyid: function(eg, args, callback) {
    digitalPropId(eg, args[1], args[2], args[3], function(id) {
      callback(id);
    });
  },

  digitalpropertyversions: function(eg, args, callback) {
    digitalPropId(eg, args[1], args[2], args[3], function(id) {
      fetchData(eg, { path: eps.digitalPropVersions(id, args[2], args[3]) }, callback);
    });
  },

  digitalpropertyversion: function(eg, args, callback) {
    digitalPropId(eg, args[2], args[3], args[4], function(id) {
      fetchData(eg, { path: eps.digitalPropVersion(args[1], id, args[3], args[4]) }, callback);
    });
  },

  digitalpropertyxml: function(eg, args, callback) {
    latestVersionAndId(eg, args[1], args[2], args[3], function(details) {
      fetchData(eg, {
        path: eps.digitalPropVersion(details.version, details.id, args[2], args[3]),
        headers: {
          'Accept': 'text/xml'
        }
      }, callback);
    });
  },

  help: function(eg, path, callback) {
    callback([
      'Query Akamai from Slack!',
      'https://github.com/Comcast/akamai-slack-reporter',
      '\n---\n',
      'GTM API: https://developer.akamai.com/api/luna/config-gtm/overview.html',
      'Available GTM traffic commands:',
      'domains',
      'domain <domain.akadns.net>',
      'datacenters <domain.akadns.net>',
      'datacenter <dataCenterId> <domain.akadns.net>',
      'properties <domain.akadns.net>',
      'property <propertyName> <domain.akadns.net>',
      'status <domain.akadns.net>',
      'livenesstests <propertyName> <domain.akadns.net>',
      '\n---\n',
      'PAPI API: https://developer.akamai.com/api/luna/papi/overview.html',
      'Available property commands:',
      'groups',
      'products <contractId>',
      'hostnames <groupId> <contractId>',
      'hostname <hostId> <groupId> <contractId>',
      'digitalproperties <groupId> <contractId>',
      'digitalproperty <propertyName> <groupId> <contractId>',
      'digitalpropertyid <propertyName> <groupId> <contractId>',
      'digitalpropertyversions <propertyName> <groupId> <contractId>',
      'digitalpropertyversion <version> <propertyName> <groupId> <contractId>',
      'digitalpropertyxml <propertyName> <groupId> <contractId>'
    ]);
  }
};

function latestVersionAndId(eg, name, groupId, contractId, callback) {
  digitalPropId(eg, name, groupId, contractId, function(id) {
    fetchData(eg, { path: eps.digitalPropLatestVersion(id, groupId, contractId) }, function(data) {
      callback({
        id: id,
        version: JSON.parse(data).versions.items[0].propertyVersion
      });
    });
  });
}

function digitalPropId(eg, name, groupId, contractId, callback) {
  var id,
      props;

  fetchData(eg, { path: eps.digitalProps(groupId, contractId) }, function(data) {
    props = JSON.parse(data).properties.items;

    props.forEach(function(prop) {
      if (prop.propertyName === name) {
        id = prop.propertyId;

        return false;
      }
    });

    callback(id);
  });
}

function fetchData(eg, opts, callback) {
  authenticate(eg, opts);
  eg.send(function (data, response) {
    callback(data);
  });
}

function authenticate(eg, opts) {
  eg.auth(helpers.extend(opts, {
    "method": "GET",
    "headers": {
      "Content-Type": "application/json"
    },
     "body": {}
  }));
}

module.exports = fetchers;

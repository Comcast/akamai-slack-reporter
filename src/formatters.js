var helpers = require('./helpers');

function formatItems(data, formatter) {
  var items = JSON.parse(data).items;

  return items.map(function(item) {
    return formatter(item);
  }).join('\n---\n');
}

function itemsWithReverseDomain(items) {
  items.forEach(function(item) {
    item.reverseDomain = item.name.split('.').reverse();
  });

  return items;
}

function formatPropertyList(data) {
  var items = JSON.parse(data).items,
      sorted = helpers.sortByKey(itemsWithReverseDomain(items), 'reverseDomain');

  return sorted.map(function(item) {
    return item.name;
  }).join('\n');
}

function formatLivenessTests(tests) {
  return tests.map(function(test) {
    return formatLivenessTest(test);
  }).join('\n');
}

function formatLivenessTest(item) {
  return Object.keys(item).map(function(key) {
    return key + ': ' + item[key];
  }).join('\n');
}

function formatDigitalProp(item) {
  return 'Name: ' + item.propertyName + '\n' +
    'ID: ' + item.propertyId + '\n' +
    'Account ID: ' + item.accountId + '\n' +
    'Contract ID: ' + item.contractId + '\n' +
    'Group ID: ' + item.groupId + '\n' +
    'Latest version: ' + item.latestVersion + '\n' +
    'Staging version: ' + item.stagingVersion + '\n' +
    'Prod version: ' + item.productionVersion + '\n' +
    'Note: ' + item.note;
}

function formatDigitalPropVersion(item) {
  return 'Version: ' + item.propertyVersion + '\n' +
    'Updated by: ' + item.updatedByUser + '\n' +
    'Updated date: ' + item.updatedDate + '\n' +
    'Prod status: ' + item.productionStatus + '\n' +
    'Staging status: ' + item.stagingStatus + '\n' +
    'Etag: ' + item.etag + '\n' +
    'Note: ' + item.note;
}

var formatters = {

  // GTM traffic
  domains: function(data) {
    var items = JSON.parse(data).items;

    return 'Domains:\n\n' + items.map(function(item) {
      return item.name;
    }).join('\n');
  },

  domain: function(data) {
    data = JSON.parse(data);

    return 'Domain:\n\n' +
      'Name: ' + data.name + '\n' +
      'Last modified: ' + data.lastModified + '\n' +
      'Type: ' + data.type + '\n' +
      'Status: ' + data.status.message;
  },

  datacenters: function(data) {
    return 'Data centers:\n\n' + formatItems(data, formatters.datacenter);
  },

  datacenter: function(dc) {
    if (typeof dc === 'string') { dc = JSON.parse(dc); }

    return  'Data center:\n\n' +
      'Nickname: ' + dc.nickname + '\n' +
      'Id: ' + dc.datacenterId;
  },

  properties: function(data) {
    return 'Properties:\n\n' + formatPropertyList(data);
  },

  property: function(prop) {
    if (typeof prop === 'string') { prop = JSON.parse(prop); }

    return 'Property:\n\n' +
      'Name: ' + prop.name + '\n' +
      'Last modified: ' + prop.lastModified + '\n' +
      'Type: ' + prop.type + '\n' +
      'TrafficTargets:\n' +
      formatters.trafficTargets(prop.trafficTargets);
  },

  trafficTargets: function(targets) {
    return targets.map(function(target) {
      return '\tId: ' + target.datacenterId + '\n' +
        '\tEnabled: ' + target.enabled + '\n' +
        '\tWeight: ' + target.weight + '\n' +
        '\tServers: ' + target.servers.join(', ');
    }).join('\n\t---\n');
  },

  status: function(stat) {
    stat = JSON.parse(stat);

    return 'Propagation status: ' + stat.propagationStatus + '\n' +
      'Message: ' + stat.message + '\n' +
      'Propagation status date: ' + stat.propagationStatusDate + '\n' +
      'Passing validation: ' + stat.passingValidation + '\n' +
      'Change ID: ' + stat.changeId;
  },

  livenesstests: function(prop) {
    if (typeof prop === 'string') { prop = JSON.parse(prop); }

    return 'Liveness tests:\n\n' + formatLivenessTests(prop.livenessTests);
  },

  // PAPI
  groups: function(data) {
    var items = JSON.parse(data).groups.items;

    return items.map(function(item) {
      return 'Group name: ' + item.groupName + '\n' +
        'Group ID: ' + item.groupId + '\n' +
        'Parent group ID: ' + item.parentGroupId + '\n' +
        'Contract IDs: ' + (item.contractIds ? item.contractIds.join(', ') : '');
    }).join('\n---\n');
  },

  products: function(data) {
    var items = JSON.parse(data).products.items;

    return items.map(function(item) {
      return 'Name: ' + item.productName + '\n' +
        'ID: ' + item.productId;
    }).join('\n---\n');
  },

  hostnames: function(data) {
    var items = JSON.parse(data).edgeHostnames.items;

    return items.map(function(item) {
      return 'ID: ' + item.edgeHostnameId + '\n' +
        'Domain prefix: ' + item.domainPrefix + '\n' +
        'Domain suffix: ' + item.domainSuffix + '\n' +
        'Edge hostname domain: ' + item.edgeHostnameDomain + '\n' +
        'IP version: ' + item.ipVersionBehavior + '\n' +
        'Secure: ' + item.secure;
    }).join('\n---\n');
  },

  hostname: function(data) {
    return formatters.hostnames(data);
  },

  digitalproperties: function(data) {
    var items = JSON.parse(data).properties.items;

    return items.map(function(item) {
      return formatDigitalProp(item);
    }).join('\n---\n');
  },

  digitalproperty: function(data, args) {
    var propName = args[1],
        items = JSON.parse(data).properties.items,
        prop;

    items.forEach(function(item) {
      if (item.propertyName === propName) {
        prop = formatDigitalProp(item);

        return false;
      }
    });

    return prop ? prop : 'Digital property ' + propName + ' not found';
  },

  digitalpropertyid: function(id) {
    return id;
  },

  digitalpropertyversions: function(data) {
    var versions = JSON.parse(data).versions.items;

    return versions.map(function(item) {
      return formatDigitalPropVersion(item);
    }).join('\n---\n');
  },

  digitalpropertyversion: function(data) {
    return formatters.digitalpropertyversions(data);
  },

  digitalpropertyxml: function(data) {
    return data;
  },

  help: function(commands) {
    return commands.join('\n');
  }
};

module.exports = formatters;

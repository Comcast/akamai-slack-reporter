var formatters = require('./formatters'),
    fetchers = require('./fetchers');

function buildActionMap() {
  var map = {};

  [
    // GTM traffic
    'domains',
    'domain',
    'datacenters',
    'datacenter',
    'properties',
    'property',
    'status',
    'livenesstests',
    // PAPI
    'groups',
    'products',
    'hostnames',
    'hostname',
    'digitalproperties',
    'digitalproperty',
    'digitalpropertyid',
    'digitalpropertyversions',
    'digitalpropertyversion',
    'digitalpropertyxml',
    'help'
  ].forEach(function(command) {
    map[command] = {
      action: fetchers[command],
      text: formatters[command]
    };
  });

  return map;
}

module.exports = buildActionMap();

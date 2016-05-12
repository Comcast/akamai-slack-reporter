module.exports = {

  // GTM traffic
  domains: function() {
    return '/config-gtm/v1/domains';
  },

  domain: function(domain) {
    return this.domains() + '/' + domain;
  },

  datacenters: function(domain) {
    return this.domain(domain) + '/datacenters';
  },

  datacenter: function(domain, id) {
    return this.datacenters(domain) + '/' + id;
  },

  properties: function(domain) {
    return this.domain(domain) + '/properties';
  },

  property: function(property, domain) {
    return this.properties(domain) + '/' + property;
  },

  status: function(domain) {
    return this.domain(domain) + '/status/current';
  },

  livenesstests: function(property, domain) {
    return this.property(property, domain);
  },

  // PAPI
  papiBase: function() {
    return '/papi/v0';
  },

  groups: function() {
    return this.papiBase() + '/groups/';
  },

  products: function(contractId) {
    return this.papiBase() + '/products?contractId=' + contractId;
  },

  hostnamesBase: function() {
    return this.papiBase() + '/edgehostnames';
  },

  query: function(groupId, contractId) {
    return '?contractId=' + contractId + '&groupId=' + groupId;
  },

  hostnames: function(groupId, contractId) {
    return this.hostnamesBase() + this.query(groupId, contractId);
  },

  hostname: function(hostnameId, groupId, contractId) {
    return this.hostnamesBase() + '/' + hostnameId + this.query(groupId, contractId);
  },

  digitalPropsBase: function() {
    return this.papiBase() + '/properties';
  },

  digitalProps: function(groupId, contractId) {
    return this.digitalPropsBase() + this.query(groupId, contractId);
  },

  digitalPropBase: function(propertyId) {
    return this.digitalPropsBase() + '/' + propertyId;
  },

  digitalProp: function(propertyId, groupId, contractId) {
    return this.digitalPropsBase() + '/' + propertyId + this.query(groupId, contractId);
  },

  digitalPropVersionsBase: function(propertyId) {
    return this.digitalPropBase(propertyId) + '/versions';
  },

  digitalPropVersions: function(propertyId, groupId, contractId) {
    return this.digitalPropVersionsBase(propertyId) + this.query(groupId, contractId);
  },

  digitalPropVersion: function(version, propertyId, groupId, contractId) {
    return this.digitalPropVersionsBase(propertyId) + '/' + version + this.query(groupId, contractId);
  },

  digitalPropLatestVersion: function(propertyId, groupId, contractId) {
    return this.digitalPropVersionsBase(propertyId) + '/latest' + this.query(groupId, contractId);
  }
};

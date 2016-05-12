module.exports = {
  digitalProperties: JSON.stringify({
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
  })
};

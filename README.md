[![Build Status](https://travis-ci.org/Comcast/akamai-slack-reporter.svg?branch=master)](https://travis-ci.org/Comcast/akamai-slack-reporter)

# akamai-slack-reporter

A Slack slash command integration for querying your team's Akamai configuration.

## Usage

Once deployed & configured, `akamai-slack-reporter` provides the following queries to your slash command integration:

```
# Available GTM traffic commands:
# https://developer.akamai.com/api/luna/config-gtm/overview.html

/slash-command domains
/slash-command domain <domain.akadns.net>
/slash-command datacenters <domain.akadns.net>
/slash-command datacenter <dataCenterId> <domain.akadns.net>
/slash-command properties
/slash-command property <propertyName> <domain.akadns.net>

# Available property commands:
# https://developer.akamai.com/api/luna/papi/overview.html

/slash-command groups
/slash-command products <contractId>
/slash-command hostnames <groupId> <contractId>
/slash-command hostname <hostId> <groupId> <contractId>
/slash-command digitalproperties <groupId> <contractId>
/slash-command digitalproperty <propertyName> <groupId> <contractId>
/slash-command digitalpropertyversions <propertyName> <groupId> <contractId>
```

## Deploying

Instantiate your `akamai-slack-reporter`:

```javascript
var AkamaiSlackReporter = require('akamai-slack-reporter'),
    reporter = new AkamaiSlackReporter({
      // NOTE: defaults to AKAMAI_EDGEGRID_CLIENT_TOKEN env var
      clientToken: '<your-akamai-client-token>',

      // NOTE: defaults to AKAMAI_EDGEGRID_CLIENT_SECRET env var
      clientSecret: '<your-akamai-client-secret>',

      // NOTE: defaults to AKAMAI_EDGEGRID_ACCESS_TOKEN env var
      accessToken: '<akamai-access-token>',

      // NOTE: defaults to AKAMAI_EDGEGRID_HOST env var
      host: '<your-akamai-host>',

      // NOTE: defaults to SLACK_TOKEN env var
      slackToken: '<your-slack-token>',

      // NOTE: defaults to INCOMING_SLACK_WEB_HOOK_PATH env var
      hookPath: '<your-slack-incoming-web-hook-path>'
    });
```

Next, deploy the `akamai-slack-reporter` instance to `some-url.com`.

Last, configure a Slack slash command integration to perform `POST` requests to
your `akamai-slack-reporter` instance at its `/integration` endpoint: `https://some-url.com/integration`

## Local development

```
npm install
npm test
```

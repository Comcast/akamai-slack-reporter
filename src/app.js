var Integrator = require('slack-integrator'),
    EdgeGrid = require('edgegrid'),
    actions = require('./actions'),
    helpers = require('./helpers'),
    eg;

function AkamaiReporter(options) {
  this.opts = helpers.extend(options || {}, {
    clientToken: process.env.AKAMAI_EDGEGRID_CLIENT_TOKEN,
    clientSecret: process.env.AKAMAI_EDGEGRID_CLIENT_SECRET,
    accessToken: process.env.AKAMAI_EDGEGRID_ACCESS_TOKEN,
    host: process.env.AKAMAI_EDGEGRID_HOST,
    slackToken: process.env.SLACK_TOKEN,
    hookPath: process.env.INCOMING_SLACK_WEB_HOOK_PATH
  });

  eg = new EdgeGrid(
    this.opts.clientToken,
    this.opts.clientSecret,
    this.opts.accessToken,
    this.opts.host
  );

  return new Integrator({
    payload: function (req, callback) {
      var args = req.body.text ? req.body.text.split(' ') : undefined,
          action = getAction(args);

      action.action(eg, args, function(data) {
        callback({
          username: 'Akamai',
          channel: req.body.channel_id,
          icon_emoji: ':ghost:',
          text: '```' + action.text(data, args) + '```'
        });
      });
    },

    token: process.env.SLACK_TOKEN,

    hookPath: process.env.INCOMING_SLACK_WEB_HOOK_PATH
  });
}

function getAction(args) {
  return args ? actions[args[0]] : actions.help;
}

module.exports = AkamaiReporter;

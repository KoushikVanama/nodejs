/*
* Create and export environment variables
*
*/

var environments = {};

environments.staging = {
  'httpPort': 3000,
  'httpsPort': 3001,
  'envName': 'staging',
  'hashingSecret': 'thisIsaSecret',
  'maxChecks': 5,
  'twilio': {
    'accountSid' : 'AC56ea6927264ac1066f8dda1746bcd86e',
    'authToken' : '413717eebe96ebb45db2914920ba53d6',
    'fromPhone' : '+12562578058'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:3000/'
  }
};

// Testing environment
environments.testing = {
  'httpPort': 4000,
  'httpsPort': 4001,
  'envName': 'testing',
  'hashingSecret': 'thisIsaSecret',
  'maxChecks': 5,
  'twilio': {
    'accountSid' : 'AC56ea6927264ac1066f8dda1746bcd86e',
    'authToken' : '413717eebe96ebb45db2914920ba53d6',
    'fromPhone' : '+12562578058'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:4000/'
  }
};

environments.production = {
  'httpPort': 5000,
  'httpsPort': 5001,
  'envName': 'production',
  'hashingSecret': 'thisIsAlsoaSecret',
  'maxChecks': 5,
  'twilio': {
    'accountSid' : 'AC56ea6927264ac1066f8dda1746bcd86e',
    'authToken' : '413717eebe96ebb45db2914920ba53d6',
    'fromPhone' : '+12562578058'
  },
  'templateGlobals': {
    'appName': 'UptimeChecker',
    'companyName': 'NotARealCompany, Inc',
    'yearCreated': '2019',
    'baseUrl': 'http://localhost:5000/'
  }
};

// Determine which environment variable is passed as command line argument
var currentEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check that the selected environment is one above, if not default to staging
var environmentToExport = typeof(environments[currentEnv]) == 'object' ? environments[currentEnv] : environments.staging;

module.exports = environmentToExport;

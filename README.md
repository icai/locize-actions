[![Travis](https://img.shields.io/travis/icai/locize-actions/master.svg?style=flat-square)](https://travis-ci.org/icai/locize-actions)
[![npm version](https://img.shields.io/npm/v/@w3cub/locize-actions.svg?style=flat-square)](https://www.npmjs.com/package/@w3cub/locize-actions)
[![David](https://img.shields.io/david/icai/locize-actions.svg?style=flat-square)](https://david-dm.org/icai/locize-lastused)

This is an standalone scriot to be used for [locize](http://locize.com) api service. 

# Getting started

Source can be loaded via [npm](https://www.npmjs.com/package/@w3cub/locize-actions).

```
# npm package
$ npm install @w3cub/locize-actions
```

## Options

**IMPORTANT** make sure you do not add your apiKey in the production build to avoid misuse by strangers

```js
{
  // the id of your locize project
  projectId: '[PROJECTID]',

  // add an api key if you want to send missing keys
  apiKey: '[APIKEY]',

  // the reference language of your project
  referenceLng: '[LNG]',

  // version - defaults to latest
  version: '[VERSION]',

  // debounce interval to send data in milliseconds
  debounceSubmit: 90000,

  // action path formatter
  actionPath: 'https://api.locize.app/{{action}}/{{projectId}}/{{version}}/{{lng}}/{{ns}}',

  // hostnames that are allowed to send last used data
  // please keep those to your local system, staging, test servers (not production)
  allowedHosts: ['localhost']
}
```


Directly call locizeActions.init:

```js
import locizeActions from "locize-actions";

locizeActions.init(options);
```

then call used function with namespace and key:

```js
import locizeActions from "locize-actions";

locizeActions.actions('action', "myNamespace", "myKey.as.in.locize", "myKey.as.the.value", (obj)=> {
  // parse function 
  // for missing action
  return Object.keys(obj)
  // 
});
```

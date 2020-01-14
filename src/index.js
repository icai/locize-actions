import * as utils from './utils';

// https://gist.github.com/Xeoncross/7663273
function ajax(url, options, callback, data, cache) {
  try {
    var x = new (XMLHttpRequest || ActiveXObject)('MSXML2.XMLHTTP.3.0');
    x.open(data ? 'POST' : 'GET', url, 1);
    if (!options.crossDomain) {
      x.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }
    if (options.authorize && options.apiKey) {
      x.setRequestHeader('Authorization', options.apiKey);
    }
    if (data || options.setContentTypeJSON) {
      x.setRequestHeader('Content-type', 'application/json');
    }
    x.onreadystatechange = function() {
      x.readyState > 3 && callback && callback(x.responseText, x);
    };
    x.send(JSON.stringify(data));
  } catch (e) {
    window.console && window.console.log(e);
  }
};

function getDefaults() {
  return {
    actionPath: 'https://api.locize.app/{{action}}/{{projectId}}/{{version}}/{{lng}}/{{ns}}',
    referenceLng: 'en',
    crossDomain: true,
    setContentTypeJSON: false,
    version: 'latest',
    debounceSubmit: 90000,
    allowedHosts: ['localhost']
  };
}

const locizeActions = {
  init: function(options) {
    this.options =  { ...getDefaults(), ...this.options, ...options };

    const hostname = window.location && window.location.hostname;
    if (hostname) {
      this.isAllowed = this.options.allowedHosts.indexOf(hostname) > -1;
    } else {
      this.isAllowed = true;
    }

    this.submitting = null;
    this.pending = {};
    this.done = {};

    this.submit = utils.debounce(this.submit, this.options.debounceSubmit);

  },
  actions: function(action, ns, key, value, parser) {
    if (typeof value == 'function') {
      parser = value;
      value = true
    }
    ['pending', 'done'].forEach((k) => {
      if (this.done[ns] && this.done[ns][key]) return;
      if (!this[k][ns]) this[k][ns] = {};
      this[k][ns][key] = value;
    });
    this.submit(action, parser);
  },

  submit: function(action, parser) {
    if (!this.isAllowed) return;
    if (this.submitting) return this.submit(action, parser);

    parser = parser || function(obj) {
      if(action === 'used') {
        return Object.keys(obj)
      }
      return obj
    }

    // missing options
    const isMissing = utils.isMissingOption(this.options, ['projectId', 'version', 'apiKey', 'referenceLng'])
    if (isMissing) return callback(new Error(isMissing));

    this.submitting = this.pending;
    this.pending = {};

    const namespaces = Object.keys(this.submitting);

    let todo = namespaces.length;
    const doneOne = () => {
      todo--;

      if (!todo) {
        this.submitting = null;
      }
    }
    namespaces.forEach((ns) => {
      const keys = parser(this.submitting[ns]);
      let url = utils.replaceIn(this.options.actionPath, ['projectId', 'version', 'lng', 'ns', 'action'], { ...this.options, lng: this.options.referenceLng, ns, action });

      if (!utils.isEmptyObj(keys)) {
        ajax(url, { ...{ authorize: true }, ...this.options }, (data, xhr) => { doneOne(); }, keys);
      } else {
        doneOne();
      }
    });
  }
}

locizeActions.type = '3rdParty';

export default locizeActions;

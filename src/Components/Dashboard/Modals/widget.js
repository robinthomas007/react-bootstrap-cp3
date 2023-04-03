/* eslint-disable default-case */
var partyServiceWidget = null;
var partyServiceWidgetFrame = null;

const modalAlertTypes = {
  primary: 'alert-primary',
  success: 'alert-success',
  danger: 'alert-danger',
  warning: 'alert-warning',
};

const informationMessages = {
  toggleModes: 1,
};

function getHeight(opts) {
  if (opts.height.toString().indexOf('%') > -1) {
    // Set height to given percentage of window height
    const percentage = parseInt(opts.height.replace('%', ''));
    const windowHeight =
      window.innerHeight ||
      document.documentElement.clientHeight ||
      document.body.clientHeight;
    return parseInt((windowHeight / 100) * percentage);
  } else {
    return opts.height;
  }
}

//Maintain this globally to ensure we only have one per client
var appEventHandler = null;

function launchWidget(opts) {
  // These are our default options
  var defaults = {
    left: 0,
    top: 0,
    width: 1024,
    height: 'auto',
    autoClose: true,
    widgetUrl: '/',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    auth: 'oidc',
    mode: 'searchView',
    sourceSystem: 'Party-Widget',
    callback: function () {
      console.log('callback has not been defined in opts');
    },
    toggles: '',
    userName: '',
  };

  // Decoding username only when coming from R2.
  if (opts.sourceSystem === 'R2Party-Widget') {
    opts.userName = decodeURI(opts.userName);
  }

  // Merge with user defined
  setOpts(defaults, opts);

  var qString = '?';

  var qStringProps = {
    // set our mode to widget
    mode: opts.mode,
    // set our api endpoint.  This allows the client to specify which environment to use
    apiUrl: opts.apiUrl,
    // set our default search term (if any)
    query: opts.searchTerm || '',
    // Set the auth mode - currently this can be either tokenUrl or oidc
    auth: opts.auth,
    // Pass along the r2auth secret if set (R2 Integration for AAD) - requires auth param to be set to tokenUrl
    r2Auth: opts.r2Auth,
    // Pass our toggles for widget.
    toggles: opts.toggles,
    // Pass source system
    sourceSystem: opts.sourceSystem,
    // Pass user name
    userName: opts.userName,
  };

  var keys = Object.keys(qStringProps);
  for (var x = 0; x < keys.length; x++) {
    qString += keys[x] + '=' + encodeURIComponent(qStringProps[keys[x]]);
    if (x < keys.length - 1) {
      qString += '&';
    }
  }

  console.log('Launching widget with options: ');
  console.log(opts);

  partyServiceWidget = document.createElement('div');
  partyServiceWidget.style.position = 'fixed';
  partyServiceWidget.style.top = 0;
  partyServiceWidget.style.left = 0;
  partyServiceWidget.style.height = '100%';
  partyServiceWidget.style.width = '100%';
  partyServiceWidget.style.zIndex = '99999';
  partyServiceWidget.style.backgroundColor = opts.backgroundColor;

  if (isValidToggle(opts)) {
    partyServiceWidgetFrame = document.createElement('iframe');
    partyServiceWidgetFrame.width = opts.width;
    partyServiceWidgetFrame.height = getHeight(opts);
    partyServiceWidgetFrame.style.position = 'absolute';
    partyServiceWidgetFrame.style.top = '50%';
    partyServiceWidgetFrame.style.left = '50%';
    partyServiceWidgetFrame.style.transform = 'translate(-50%, -50%)';
    partyServiceWidgetFrame.style.width = opts.width + 'px';
    partyServiceWidgetFrame.style.height = getHeight(opts) + 'px';
    partyServiceWidgetFrame.src = opts.widgetUrl + qString;
    partyServiceWidgetFrame.style.border = 'none';
    partyServiceWidgetFrame.style.borderRadius = '10px';
    partyServiceWidgetFrame.id = 'pluginIframe';

    partyServiceWidget.appendChild(partyServiceWidgetFrame);
  } else {
    var msgModal = createModal(
      createMessage(informationMessages.toggleModes),
      modalAlertTypes.danger
    );
    partyServiceWidget.appendChild(msgModal);
  }

  document.body.appendChild(partyServiceWidget);

  //respond to events in the app
  //Remove any previous handler
  if (appEventHandler != null) {
    window.removeEventListener('message', appEventHandler, false);
  }

  appEventHandler = getAppEventHandler();
  window.addEventListener('message', appEventHandler, false);

  console.log('Hooking into resize');
  window.addEventListener('resize', function () {
    const height = getHeight(opts);
    this.console.log('resizing to ' + height);
    partyServiceWidgetFrame.height = getHeight(opts);
    partyServiceWidgetFrame.style.height = getHeight(opts) + 'px';
  });

  function getAppEventHandler() {
    return function (event) {
      switch (event.data.action) {
        case 'close':
          if (opts.callback) {
            opts.callback();
          }
          partyServiceWidget.style.display = 'none';
          break;
        case 'select':
          opts.callback(event.data.parties);
          if (opts.autoClose) {
            partyServiceWidget.style.display = 'none';
          }
          break;
      }
    };
  }
}

function setOpts(defaults, user) {
  for (let key in defaults) {
    if (!user[key] || (typeof user[key] == 'string' && !user[key].trim())) {
      user[key] = defaults[key];
    }
  }
}

function isValidToggle(opts) {
  if (opts.mode === 'widgetView' || opts.mode === 'widgetSearchView') {
    if (opts.toggles) return false;
  }
  return true;
}

function createModal(msg, alertType) {
  // Buttons
  var msgCloseBtn = document.createElement('button');
  msgCloseBtn.setAttribute('type', 'button');
  msgCloseBtn.setAttribute('class', 'close');
  msgCloseBtn.setAttribute('data-dismiss', 'modal');
  msgCloseBtn.setAttribute('aria-label', 'Close');

  var msgOkBtn = document.createElement('button');
  msgOkBtn.setAttribute('type', 'button');
  msgOkBtn.setAttribute('class', 'btn btn-light');
  msgOkBtn.innerHTML = 'Accept';

  // Span
  var msgSpan = document.createElement('span');
  msgSpan.setAttribute('aria-hidden', 'true');
  msgSpan.innerHTML = '&times;';

  // Modal
  var msgModal = document.createElement('div');
  msgModal.setAttribute('class', 'modal');
  msgModal.setAttribute('role', 'dialog');
  msgModal.setAttribute('id', 'msgWidgetModal');

  // Modal Dialog
  var msgModalDialog = document.createElement('div');
  msgModalDialog.setAttribute('class', 'modal-dialog');
  msgModalDialog.setAttribute('role', 'document');

  // Modal Content
  var msgModalContent = document.createElement('div');
  msgModalContent.setAttribute('class', 'modal-content');

  // Modal Header
  var msgModalHeader = document.createElement('div');
  msgModalHeader.setAttribute('class', 'modal-header ' + alertType);

  // Modal Title
  var msgModalTitle = document.createElement('h5');
  msgModalTitle.setAttribute('class', 'modal-title');
  msgModalTitle.innerHTML = 'Widget Exception';

  // Modal Body
  var msgModalBody = document.createElement('div');
  msgModalBody.setAttribute('class', 'modal-body');

  // Footer
  var msgFooter = document.createElement('footer');
  msgFooter.setAttribute('class', 'modal-footer');

  //---------------------------------------------

  msgCloseBtn.appendChild(msgSpan);
  msgModalHeader.appendChild(msgModalTitle);

  msgModalHeader.appendChild(msgCloseBtn);
  msgModalBody.appendChild(msg);
  msgFooter.appendChild(msgOkBtn);

  msgModalContent.appendChild(msgModalHeader);
  msgModalContent.appendChild(msgModalBody);
  msgModalContent.appendChild(msgFooter);

  msgModalDialog.appendChild(msgModalContent);
  msgModal.appendChild(msgModalDialog);

  msgModal.style.display = 'contents';

  return msgModal;
}

function createMessage(messageType) {
  //All elements should be wrapped by this 'p' element.
  var message = document.createElement('p');

  // eslint-disable-next-line default-case
  switch (messageType) {
    case informationMessages.toggleModes:
      message.innerHTML =
        'Invalid selection, you cannot use toggles when selecting the following modes: <br/>' +
        '<ul>' +
        '<li>View (M2)</li>' +
        '<li>Search And View (M4)</li>' +
        '</ul>';
      break;
  }

  return message;
}
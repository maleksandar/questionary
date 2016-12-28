define('app',['exports', './services/auth', 'aurelia-framework'], function (exports, _auth, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.App = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_auth.Auth), _dec(_class = function () {
    function App(auth) {
      _classCallCheck(this, App);

      this.auth = auth;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Questionary';
      config.map([{ route: '', moduleId: 'pages/questions', title: 'Questions' }, { route: 'home', moduleId: 'pages/home', title: 'Home', nav: false }, { route: 'login', moduleId: 'pages/login', name: 'login', title: 'Log in' }, { route: 'logout', moduleId: 'pages/logout', name: 'logout', title: 'Log out' }, { route: 'signup', moduleId: 'pages/signup', name: 'signup', title: 'Sign up' }]);
      this.router = router;
    };

    return App;
  }()) || _class);
});
define('environment',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    debug: true,
    testing: true
  };
});
define('main',['exports', './environment', 'aurelia-fetch-client'], function (exports, _environment, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;

  var _environment2 = _interopRequireDefault(_environment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  Promise.config({
    longStackTraces: _environment2.default.debug,
    warnings: {
      wForgottenReturn: false
    }
  });

  function configure(aurelia) {
    aurelia.use.standardConfiguration().feature('resources');

    if (_environment2.default.debug) {
      aurelia.use.developmentLogging();
    }

    if (_environment2.default.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    configureContainer(aurelia.container);

    aurelia.start().then(function () {
      return aurelia.setRoot();
    });
  }

  function configureContainer(container) {
    var http = new _aureliaFetchClient.HttpClient();
    http.configure(function (config) {
      config.useStandardConfiguration().withBaseUrl('api/').withDefaults({
        credentials: 'same-origin',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'Fetch'
        }
      });
      if (_environment2.default.debug) {
        config.withInterceptor({
          request: function request(_request) {
            console.log('Requesting ' + _request.method + ' ' + _request.url);
            return _request;
          },
          response: function response(_response) {
            console.log('Received ' + _response.status + ' ' + _response.url);
            return _response;
          }
        });
      }
    });
    container.registerInstance(_aureliaFetchClient.HttpClient, http);
  }
});
define('config/sharedResources',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var SharedResources = exports.SharedResources = function SharedResources() {
    _classCallCheck(this, SharedResources);

    this.currentUser = {
      isLogedIn: false,
      isAdmin: false
    };
  };
});
define('pages/home',['exports', '../services/auth', 'aurelia-framework'], function (exports, _auth, _aureliaFramework) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Home = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Home = exports.Home = (_dec = (0, _aureliaFramework.inject)(_auth.Auth), _dec(_class = function () {
    function Home(auth) {
      _classCallCheck(this, Home);

      this.auth = auth;
    }

    Home.prototype.canActivate = function canActivate() {
      return this.auth.isLogedIn;
    };

    return Home;
  }()) || _class);
});
define('pages/login',['exports', 'aurelia-framework', 'aurelia-router', '../services/auth'], function (exports, _aureliaFramework, _aureliaRouter, _auth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Login = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_auth.Auth, _aureliaRouter.Router), _dec(_class = function () {
    function Login(auth, router) {
      _classCallCheck(this, Login);

      this.auth = auth;
      this.router = router;
    }

    Login.prototype.login = function login() {
      var _this = this;

      this.auth.login(this.email, this.password).then(function () {
        _this.router.navigate("");
      }).catch(function () {
        return _this.loginError = true;
      });
    };

    return Login;
  }()) || _class);
});
define('pages/logout',['exports', 'aurelia-framework', 'aurelia-router', '../services/auth'], function (exports, _aureliaFramework, _aureliaRouter, _auth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Logout = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Logout = exports.Logout = (_dec = (0, _aureliaFramework.inject)(_aureliaRouter.Router, _auth.Auth), _dec(_class = function Logout(router, auth) {
    var _this = this;

    _classCallCheck(this, Logout);

    this.auth = auth;
    this.router = router;

    this.auth.logout().then(function () {
      return _this.router.navigate("");
    });
  }) || _class);
});
define('pages/questions',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var Questions = exports.Questions = function Questions() {
    _classCallCheck(this, Questions);

    this.message = "hello";
  };
});
define('pages/signup',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Signup = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function Signup(httpClient, router) {
      _classCallCheck(this, Signup);

      this.httpClient = httpClient;
      this.router = router;
    }

    Signup.prototype.signup = function signup() {
      var _this = this;

      this.httpClient.fetch('users', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ name: this.name, email: this.email, password: this.password })
      }).then(function () {
        return _this.router.navigate("");
      });
    };

    return Signup;
  }()) || _class);
});
define('resources/index',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.configure = configure;
  function configure(config) {}
});
define('services/auth',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Auth = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var Auth = exports.Auth = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = function () {
    function Auth(httpClient) {
      _classCallCheck(this, Auth);

      this.httpClient = httpClient;
      this.isLogedIn = sessionStorage.getItem("logedIn") === "true" ? true : false;
    }

    Auth.prototype.login = function login(email, password) {
      var _this = this;

      return this.httpClient.fetch('auth/login', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ email: email, password: password })
      }).then(function (response) {
        sessionStorage.setItem('logedIn', "true");
        _this.isLogedIn = true;
        return response.json();
      });
    };

    Auth.prototype.logout = function logout() {
      var _this2 = this;

      return this.httpClient.fetch('auth/logout', {
        method: 'post'
      }).then(function (response) {
        sessionStorage.setItem('logedIn', "false");
        _this2.isLogedIn = false;
      });
    };

    return Auth;
  }()) || _class);
});
define('resources/elements/question-form',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'aurelia-router', 'toastr'], function (exports, _aureliaFetchClient, _aureliaFramework, _aureliaRouter, toastr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QuestionForm = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var QuestionForm = exports.QuestionForm = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router, toastr), _dec(_class = function () {
    function QuestionForm(httpClient, router, toastr) {
      _classCallCheck(this, QuestionForm);

      this.httpClient = httpClient;
      this.router = router;
      this.toastr = toastr;
    }

    QuestionForm.prototype.postQuestion = function postQuestion() {
      var _this = this;

      return this.httpClient.fetch('questions', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ headline: this.headline, text: this.text })
      }).then(function () {
        _this.toastr.success('You have successfully posted your question');
        _this.router.navigate("");
      }).catch(function () {
        return _this.serverError = true;
      });
    };

    return QuestionForm;
  }()) || _class);
});
define('resources/elements/question-list',['exports', 'aurelia-framework', 'aurelia-fetch-client'], function (exports, _aureliaFramework, _aureliaFetchClient) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QuestionList = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
      desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
      desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
      return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
      desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
      desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
      Object['define' + 'Property'](target, property, desc);
      desc = null;
    }

    return desc;
  }

  function _initializerWarningHelper(descriptor, context) {
    throw new Error('Decorating class property failed. Please ensure that transform-class-properties is enabled.');
  }

  var _dec, _class, _desc, _value, _class2, _descriptor;

  var QuestionList = exports.QuestionList = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient), _dec(_class = (_class2 = function () {
    function QuestionList(httpClient) {
      var _this = this;

      _classCallCheck(this, QuestionList);

      _initDefineProp(this, 'value', _descriptor, this);

      this.httpClient = httpClient;

      this.httpClient.fetch('questions').then(function (response) {
        return response.json();
      }).then(function (questions) {
        return _this.questions = questions;
      });
    }

    QuestionList.prototype.valueChanged = function valueChanged(newValue, oldValue) {};

    return QuestionList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'value', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\n  <require from=\"./resources/elements/question-list\"></require>\n  <require from=\"./resources/elements/navigation-element.html\"></require>\n  <!--<require from=\"./services/auth.js\"></require>-->\n  <require from=\"./styles.css\"></require>\n\n<nav class=\"navbar navbar-inverse\">\n  <div class=\"container-fluid\">\n    <div class=\"navbar-header\">\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#myNavbar\">\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>\n        <span class=\"icon-bar\"></span>                        \n      </button>\n      <a class=\"navbar-brand\" href=\"#\">Questionary</a>\n    </div>\n    <div class=\"collapse navbar-collapse\" id=\"myNavbar\">\n      <ul class=\"nav navbar-nav\">\n        <li><a if.bind=\"auth.isLogedIn\" href=\"/#/home\"><span class=\"fa fa-home\"></span>Home</a></li>\n        <li><a href=\"#\">About</a></li>\n      </ul>\n      <form class=\"navbar-form navbar-left\">\n        <div class=\"input-group\">\n          <div class=\"form-group\">\n            <input type=\"text\" class=\"form-control\" placeholder=\"Search\">\n          </div>\n          <div class=\"input-group-btn\">\n            <button type=\"submit\" class=\"btn btn-default\">Submit</button>\n          </div>\n        </div>\n      </form>\n      <ul class=\"nav navbar-nav navbar-right\">\n        <li><a if.bind=\"!auth.isLogedIn\" href=\"/#/signup\"><span class=\"fa fa-user\"></span> Sign Up</a></li>\n        <li><a if.bind=\"!auth.isLogedIn\" href=\"/#/login\"><span class=\"fa fa-sign-in\"></span> Login</a></li>\n        <li><a if.bind=\"auth.isLogedIn\" href=\"/#/logout\"><span class=\"fa fa-sign-out\"></span> Logout</a></li>\n      </ul>\n    </div>\n  </div>\n</nav>\n      <router-view class=\"col-md-8\"></router-view>\n  </div>\n</template>"; });
define('text!styles.css', ['module'], function(module) { module.exports = "section {\r\n  margin: 0 20px;\r\n}\r\n\r\na:focus {\r\n  outline: none;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.no-selection {\r\n  margin: 20px;\r\n}\r\n\r\n.contact-list {\r\n  overflow-y: auto;\r\n  border: 1px solid #ddd;\r\n  padding: 10px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\nli.list-group-item {\r\n  list-style: none;\r\n}\r\n\r\nli.list-group-item > a {\r\n  text-decoration: none;\r\n}\r\n\r\nli.list-group-item.active > a {\r\n  color: white;\r\n}\r\n"; });
define('text!pages/home.html', ['module'], function(module) { module.exports = "<template>\r\n<require from=\"../resources/elements/question-form\"></require>\r\n<question-form></question-form>\r\n</template>"; });
define('text!pages/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"row\"><h3 class=\"col-sm-offset-4 col-sm-8\">Log in with your credentials</h3></div>\r\n  <form class=\"form-horizontal\" role=\"form\" submit.delegate = \"login()\">\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"email\">Email:</label>\r\n      <div class=\"col-sm-8\">\r\n        <input value.bind=\"email\" type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Enter your email\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"pwd\">Password:</label>\r\n      <div class=\"col-sm-8\">          \r\n        <input value.bind=\"password\" type=\"password\" class=\"form-control\" id=\"pwd\" placeholder=\"Enter your password\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">        \r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <div class=\"checkbox\">\r\n          <label><input type=\"checkbox\"> Remember me</label>\r\n        </div>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">        \r\n      <div show.bind=\"loginError\" class=\"col-sm-offset-4 col-sm-8 alert alert-danger\">\r\n        <p><i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i> <strong> Error: </strong> Email or password you provided do not match with any existing user</p>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">        \r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <button type=\"submit\" class=\"btn btn-default\">Log in</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n</template>"; });
define('text!pages/logout.html', ['module'], function(module) { module.exports = "<template>...loging out...</template>"; });
define('text!pages/questions.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../resources/elements/question-list\"></require>\r\n  <question-list></question-list>\r\n  <div>${message}</div>\r\n</template>"; });
define('text!pages/signup.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"row\"><h3 class=\"col-sm-offset-4 col-sm-8\">Sign up with your credentials</h3></div>\r\n  <form class=\"form-horizontal\" role=\"form\" submit.delegate = \"signup()\">\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"name\">Full name:</label>\r\n      <div class=\"col-sm-8\">\r\n        <input value.bind=\"name\" type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Enter your full name\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"email\">Email:</label>\r\n      <div class=\"col-sm-8\">\r\n        <input value.bind=\"email\" type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Enter your email\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"pwd\">Password:</label>\r\n      <div class=\"col-sm-8\">          \r\n        <input value.bind=\"password\" type=\"password\" class=\"form-control\" id=\"pwd\" placeholder=\"Enter password\">\r\n      </div>\r\n    </div> \r\n    <div class=\"form-group\">        \r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <button type=\"submit\" class=\"btn btn-default\">Sign up</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n</template>"; });
define('text!resources/elements/navigation-element.html', ['module'], function(module) { module.exports = "<template bindable=\"href, title, icon\">\r\n      <a class=\"navbar-brand\" href=\"${href}\">\r\n        <i class=\"${icon}\"></i>\r\n        <span>${title}</span>\r\n      </a>\r\n</template>"; });
define('text!resources/elements/question-form.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"toastr/build/toastr.min.css\"></require>\r\n  <div class=\"row\"><h3 class=\"col-sm-offset-4 col-sm-8\">Ask your question</h3></div>\r\n  <form class=\"form-horizontal\" role=\"form\" submit.delegate = \"postQuestion()\">\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"email\">Headline:</label>\r\n      <div class=\"col-sm-8\">\r\n        <input value.bind=\"headline\" type=\"text\" class=\"form-control\" name=\"headline\" placeholder=\"Enter the headline of your question\">\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <label class=\"control-label col-sm-4\" for=\"pwd\">Text:</label>\r\n      <div class=\"col-sm-8\">      \r\n        <textarea value.bind=\"text\" class=\"form-control\" rows=\"7\" name=\"text\" placeholder=\"Enter the text of your question\"></textarea>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">        \r\n      <div show.bind=\"serverError\" class=\"col-sm-offset-4 col-sm-8 alert alert-danger\">\r\n        <p><i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i> <strong> Error: </strong> Some kind of a server error! </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">        \r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <button type=\"submit\" class=\"btn btn-default\">Post question</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n</template>"; });
define('text!resources/elements/question-list.html', ['module'], function(module) { module.exports = "<template>\n  <require from=\"./question.html\"></require>\n  <h1>QUESTIONS:</h1>\n  <li repeat.for=\"question of questions\">\n    <question content.bind=\"question\"></question>\n  </li>\n</template>"; });
define('text!resources/elements/question.html', ['module'], function(module) { module.exports = "<template bindable=\"content\">\n    <h1>${content.headline}</h1>\n    <p>${content.text}</p>\n</template>"; });
//# sourceMappingURL=app-bundle.js.map
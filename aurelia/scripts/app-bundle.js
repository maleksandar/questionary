define('app',['exports', './services/auth', 'aurelia-framework', 'aurelia-dialog', './dialogs/login', './dialogs/signup'], function (exports, _auth, _aureliaFramework, _aureliaDialog, _login, _signup) {
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

  var App = exports.App = (_dec = (0, _aureliaFramework.inject)(_auth.Auth, _aureliaDialog.DialogService), _dec(_class = function () {
    function App(auth, dialogService) {
      _classCallCheck(this, App);

      this.auth = auth;
      this.dialogService = dialogService;
    }

    App.prototype.configureRouter = function configureRouter(config, router) {
      config.title = 'Questionary';
      config.map([{ route: '', moduleId: 'pages/questions', title: 'Questions' }, { route: 'home', moduleId: 'pages/home', title: 'Home', nav: false }, { route: 'question/:id', moduleId: 'pages/question-details', name: 'question-details', title: 'Question' }]);
      this.router = router;
    };

    App.prototype.loginModal = function loginModal() {
      this.dialogService.open({ viewModel: _login.Login });
    };

    App.prototype.signupModal = function signupModal() {
      this.dialogService.open({ viewModel: _signup.Signup });
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
    aurelia.use.standardConfiguration().feature('resources').plugin('aurelia-dialog');

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
define('dialogs/login',['exports', 'aurelia-framework', 'aurelia-router', 'aurelia-fetch-client', '../services/auth', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaRouter, _aureliaFetchClient, _auth, _aureliaDialog) {
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

  var Login = exports.Login = (_dec = (0, _aureliaFramework.inject)(_auth.Auth, _aureliaRouter.Router, _aureliaFetchClient.HttpClient, _aureliaDialog.DialogController), _dec(_class = function () {
    function Login(auth, router, httpClient, dialogController) {
      _classCallCheck(this, Login);

      this.auth = auth;
      this.router = router;
      this.httpClient = httpClient;
      this.dialogController = dialogController;
    }

    Login.prototype.login = function login() {
      var _this = this;

      this.auth.login(this.email, this.password).then(function () {
        _this.dialogController.close();
      }).catch(function () {
        return _this.loginError = true;
      }).then(function () {
        if (!_this.loginError) {
          _this.httpClient.fetch('users/me').then(function (response) {
            return response.json();
          });
        }
      });
    };

    return Login;
  }()) || _class);
});
define('dialogs/signup',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter, _aureliaDialog) {
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

  var Signup = exports.Signup = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router, _aureliaDialog.DialogController), _dec(_class = function () {
    function Signup(httpClient, router, dialogController) {
      _classCallCheck(this, Signup);

      this.httpClient = httpClient;
      this.router = router;
      this.dialogController = dialogController;
    }

    Signup.prototype.signup = function signup() {
      var _this = this;

      this.httpClient.fetch('users', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ name: this.name, email: this.email, password: this.password })
      }).then(function () {
        _this.dialogController.close();
        _this.router.navigate("");
      }).catch(function (reason) {
        return reason.json();
      }).then(function (reason) {
        console.log(reason);
        if (reason.name === "SequelizeUniqueConstraintError") {
          console.log('not unique');
        }
      });
    };

    return Signup;
  }()) || _class);
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
define('pages/question-details',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router', 'aurelia-event-aggregator'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter, _aureliaEventAggregator) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.QuestionDetails = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var QuestionDetails = exports.QuestionDetails = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaEventAggregator.EventAggregator), _dec(_class = function () {
    function QuestionDetails(httpClient, ea) {
      _classCallCheck(this, QuestionDetails);

      this.httpClient = httpClient;
      this.ea = ea;
    }

    QuestionDetails.prototype.activate = function activate(params, routeConfig) {
      var _this = this;

      this.routeConfig = routeConfig;

      var questionPromise = this.httpClient.fetch('questions/' + params.id + '?include=Tags&include=Answers').then(function (questionDetail) {
        return questionDetail.json();
      }).then(function (question) {
        _this.questionContent = question;
        _this.routeConfig.navModel.setTitle(question.headline);
      });

      var answerPromise = this.httpClient.fetch('answers/question/' + params.id).then(function (response) {
        return response.json();
      }).then(function (answers) {
        _this.answers = answers;
      });

      return Promise.all([questionPromise, answerPromise]);
    };

    QuestionDetails.prototype.attached = function attached() {
      var _this2 = this;

      this.subscriber = this.ea.subscribe('questionAnswered', function (message) {
        _this2.httpClient.fetch('answers/question/' + message.id).then(function (response) {
          return response.json();
        }).then(function (answers) {
          _this2.answers = answers;
          console.log(answers);
        });
      });
    };

    QuestionDetails.prototype.detached = function detached() {
      this.subscriber.dispose();
    };

    return QuestionDetails;
  }()) || _class);
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
  };
});
define('resources/index',['exports'], function (exports) {
                        'use strict';

                        Object.defineProperty(exports, "__esModule", {
                                                value: true
                        });
                        exports.configure = configure;
                        function configure(config) {
                                                config.globalResources(['./elements/question-list', './elements/question-form', './elements/question-filter']);
                        }
});
define('services/auth',['exports', 'aurelia-framework', 'aurelia-fetch-client', 'aurelia-router'], function (exports, _aureliaFramework, _aureliaFetchClient, _aureliaRouter) {
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

  var Auth = exports.Auth = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _aureliaRouter.Router), _dec(_class = function () {
    function Auth(httpClient, router) {
      _classCallCheck(this, Auth);

      this.httpClient = httpClient;
      this.router = router;
      this.isLogedIn = sessionStorage.getItem("logedIn") === "true";
      this.currentUser = { userId: sessionStorage.getItem("userId"), role: sessionStorage.getItem("role") };
      console.log('auth constructor', this.currentUser);
    }

    Auth.prototype.login = function login(email, password) {
      var _this = this;

      return this.httpClient.fetch('auth/login', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ email: email, password: password })
      }).then(function (response) {
        return response.json();
      }).then(function (userinfo) {
        console.log(userinfo);

        sessionStorage.setItem('logedIn', "true");
        _this.isLogedIn = true;
        _this.currentUser.userId = userinfo.user_id;
        sessionStorage.setItem('userId', userinfo.user_id);
        return userinfo;
      });
    };

    Auth.prototype.logout = function logout() {
      var _this2 = this;

      sessionStorage.setItem('logedIn', "false");
      this.isLogedIn = false;
      this.currentUser.userId = "";
      sessionStorage.setItem('userId', "");
      return this.httpClient.fetch('auth/logout', {
        method: 'post'
      }).then(function () {
        _this2.router.navigate("");
      });
    };

    return Auth;
  }()) || _class);
});
define('resources/elements/answer',['exports', 'aurelia-framework', 'aurelia-fetch-client', '../../services/auth'], function (exports, _aureliaFramework, _aureliaFetchClient, _auth) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Answer = undefined;

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

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var Answer = exports.Answer = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, _auth.Auth), _dec2 = (0, _aureliaFramework.computedFrom)('auth.currentUser.userId', 'content.createdByUserId'), _dec3 = (0, _aureliaFramework.computedFrom)('auth.isLogedIn'), _dec(_class = (_class2 = function () {
    function Answer(httpClient, auth) {
      _classCallCheck(this, Answer);

      _initDefineProp(this, 'content', _descriptor, this);

      this.httpClient = httpClient;
      this.auth = auth;
    }

    Answer.prototype.voteUp = function voteUp() {
      this.httpClient.fetch('answers/votes/' + this.content._id.toString() + '/thumbsup', { method: 'put' });
    };

    Answer.prototype.voteDown = function voteDown() {
      this.httpClient.fetch('answers/votes/' + this.content._id.toString() + '/thumbsdown', { method: 'put' });
    };

    _createClass(Answer, [{
      key: 'authorized',
      get: function get() {
        return parseInt(this.auth.currentUser.userId) === parseInt(this.content.createdByUserId);
      }
    }, {
      key: 'authenticated',
      get: function get() {
        return this.auth.isLogedIn;
      }
    }]);

    return Answer;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'content', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'authorized', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'authorized'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'authenticated', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'authenticated'), _class2.prototype)), _class2)) || _class);
});
define('resources/elements/confirmation-dialog',['exports', 'aurelia-framework', 'aurelia-dialog'], function (exports, _aureliaFramework, _aureliaDialog) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ConfirmationDialog = undefined;

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _dec, _class;

  var ConfirmationDialog = exports.ConfirmationDialog = (_dec = (0, _aureliaFramework.inject)(_aureliaDialog.DialogController), _dec(_class = function () {
    function ConfirmationDialog(dialogController) {
      _classCallCheck(this, ConfirmationDialog);

      this.dialogController = dialogController;
    }

    ConfirmationDialog.prototype.activate = function activate(content) {
      this.message = content.message;
      this.headline = content.headline;
    };

    return ConfirmationDialog;
  }()) || _class);
});
define('resources/elements/question-filter',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var QuestionFilter = exports.QuestionFilter = function QuestionFilter() {
    _classCallCheck(this, QuestionFilter);
  };
});
define('resources/elements/question-form',['exports', 'aurelia-fetch-client', 'aurelia-framework', 'toastr'], function (exports, _aureliaFetchClient, _aureliaFramework, toastr) {
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

  var QuestionForm = exports.QuestionForm = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, toastr), _dec(_class = function () {
    function QuestionForm(httpClient, toastr) {
      var _this = this;

      _classCallCheck(this, QuestionForm);

      this.httpClient = httpClient;
      this.toastr = toastr;
      this.tags = [];
      this.tag = "";
      this.httpClient.fetch('domains').then(function (response) {
        return response.json();
      }).then(function (domains) {
        _this.domains = domains;console.log("Domains:", _this.domains);
      }).catch(function (reason) {
        console.log(reason);
      });
    }

    QuestionForm.prototype.postQuestion = function postQuestion() {
      var _this2 = this;

      var tagObjects = this.tags.map(function (tag) {
        return { text: tag };
      });
      return this.httpClient.fetch('questions', {
        method: 'post',
        body: (0, _aureliaFetchClient.json)({ headline: this.headline, text: this.text, Tags: tagObjects, DomainText: this.domain.text })
      }).then(function () {
        _this2.toastr.success('You have successfully posted your question');
        _this2.headline = "";
        _this2.text = "";
        _this2.tags = [];
      }).catch(function () {
        return _this2.serverError = true;
      });
    };

    QuestionForm.prototype.removeTag = function removeTag(tagText) {
      var index = this.tags.indexOf(tagText);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    };

    QuestionForm.prototype.addTag = function addTag() {
      this.tags.push(this.tag);
      this.tag = "";
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
      _classCallCheck(this, QuestionList);

      _initDefineProp(this, 'source', _descriptor, this);

      this.httpClient = httpClient;
      this.qss = [];
      this.pageIndexes = [];
      this.qssIsNotEmpty = false;
    }

    QuestionList.prototype.attached = function attached() {
      var _this = this;

      var request = '';
      if (this.source === 'pinned') {
        request = 'questions/pinned';
      } else if (this.source === 'mine') {
        request = 'questions/mine';
      } else {
        request = 'questions?include=Answers&include=Tags';
      }
      console.log('QS: ', this.source);
      this.httpClient.fetch(request).then(function (response) {
        return response.json();
      }).then(function (questions) {
        _this.questions = questions;
        while (_this.questions.length != 0) {
          _this.qss.push(_this.questions.splice(0, 6));
        }_this.qssIsNotEmpty = _this.qss.length != 0;
        if (_this.qssIsNotEmpty) {
          _this.questions = _this.qss[0];
          _this.currentIndex = 0;
          _this.pageIndexes = Array.from(new Array(_this.qss.length), function (x, i) {
            return i;
          });
        }
      });
    };

    return QuestionList;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'source', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  })), _class2)) || _class);
});
define('resources/elements/question',['exports', 'aurelia-framework', 'aurelia-fetch-client', '../../services/auth', 'aurelia-dialog', './confirmation-dialog', 'aurelia-event-aggregator', 'toastr'], function (exports, _aureliaFramework, _aureliaFetchClient, _auth, _aureliaDialog, _confirmationDialog, _aureliaEventAggregator, toastr) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.Question = undefined;

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

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

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

  var _dec, _dec2, _dec3, _class, _desc, _value, _class2, _descriptor;

  var Question = exports.Question = (_dec = (0, _aureliaFramework.inject)(_aureliaFetchClient.HttpClient, toastr, _auth.Auth, _aureliaDialog.DialogService, _aureliaEventAggregator.EventAggregator), _dec2 = (0, _aureliaFramework.computedFrom)('auth.currentUser.userId', 'content.createdByUserId'), _dec3 = (0, _aureliaFramework.computedFrom)('auth.isLogedIn'), _dec(_class = (_class2 = function () {
    function Question(httpClient, toastr, auth, dialogService, ea) {
      _classCallCheck(this, Question);

      _initDefineProp(this, 'content', _descriptor, this);

      this.httpClient = httpClient;
      this.toastr = toastr;
      this.auth = auth;
      this.dialogService = dialogService;
      this.ea = ea;
    }

    Question.prototype.attached = function attached() {
      var _this = this;

      this.httpClient.fetch('pins/question/' + this.content._id).then(function (response) {
        return response.json();
      }).then(function (pinned) {
        _this.pinned = pinned;
      }).catch(function (reson) {
        return console.log(reason);
      });
    };

    Question.prototype.quickAnswer = function quickAnswer() {
      var _this2 = this;

      this.httpClient.fetch('answers', { method: 'post', body: (0, _aureliaFetchClient.json)({ text: this.answerText, QuestionId: this.content._id }) }).then(function () {
        _this2.answerText = "";
        _this2.content.Answers.push({});
        _this2.ea.publish('questionAnswered', { id: _this2.content._id });
        _this2.toastr.success('You have successfully posted your answer');
      });
    };

    Question.prototype.delete = function _delete() {
      var _this3 = this;

      this.dialogService.open({ viewModel: _confirmationDialog.ConfirmationDialog, model: { headline: "Delete question", message: "Are you sure you want to delete this question?" } }).then(function (response) {
        if (!response.wasCancelled) {
          console.log(response);
          _this3.httpClient.fetch('questions/' + _this3.content._id, { method: 'delete' }).then(function () {
            _this3.toastr.success('You have successfully deleted your question');
            _this3.deleted = true;
          });
        }
      });
    };

    Question.prototype.pin = function pin() {
      if (!this.pinned) this.httpClient.fetch('pins/question/' + this.content._id, { method: 'post' });
      if (this.pinned) this.httpClient.fetch('pins/question/' + this.content._id, { method: 'delete' });
      this.pinned = !this.pinned;
    };

    Question.prototype.voteUp = function voteUp() {
      this.httpClient.fetch('questions/votes/' + this.content._id.toString() + '/thumbsup', { method: 'put' });
    };

    Question.prototype.voteDown = function voteDown() {
      this.httpClient.fetch('questions/votes/' + this.content._id.toString() + '/thumbsdown', { method: 'put' });
    };

    _createClass(Question, [{
      key: 'authorized',
      get: function get() {
        return parseInt(this.auth.currentUser.userId) === parseInt(this.content.createdByUserId);
      }
    }, {
      key: 'authenticated',
      get: function get() {
        return this.auth.isLogedIn;
      }
    }]);

    return Question;
  }(), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'content', [_aureliaFramework.bindable], {
    enumerable: true,
    initializer: null
  }), _applyDecoratedDescriptor(_class2.prototype, 'authorized', [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, 'authorized'), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, 'authenticated', [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, 'authenticated'), _class2.prototype)), _class2)) || _class);
});
define('resources/value-converters/dates',['exports', 'moment'], function (exports, _moment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DateFormatValueConverter = undefined;

  var _moment2 = _interopRequireDefault(_moment);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var DateFormatValueConverter = exports.DateFormatValueConverter = function () {
    function DateFormatValueConverter() {
      _classCallCheck(this, DateFormatValueConverter);
    }

    DateFormatValueConverter.prototype.toView = function toView(value) {
      return (0, _moment2.default)(value).calendar();
    };

    return DateFormatValueConverter;
  }();
});
define('aurelia-dialog/ai-dialog',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialog = undefined;

  

  var _dec, _dec2, _class;

  var AiDialog = exports.AiDialog = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialog() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-header',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogHeader = undefined;

  

  var _dec, _dec2, _class, _class2, _temp;

  var AiDialogHeader = exports.AiDialogHeader = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-header'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <button type="button" class="dialog-close" aria-label="Close" if.bind="!controller.settings.lock" click.trigger="controller.cancel()">\n      <span aria-hidden="true">&times;</span>\n    </button>\n\n    <div class="dialog-header-content">\n      <slot></slot>\n    </div>\n  </template>\n'), _dec(_class = _dec2(_class = (_temp = _class2 = function AiDialogHeader(controller) {
    

    this.controller = controller;
  }, _class2.inject = [_dialogController.DialogController], _temp)) || _class) || _class);
});
define('aurelia-dialog/dialog-controller',['exports', './lifecycle', './dialog-result'], function (exports, _lifecycle, _dialogResult) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogController = undefined;

  

  var DialogController = exports.DialogController = function () {
    function DialogController(renderer, settings, resolve, reject) {
      

      this.renderer = renderer;
      this.settings = settings;
      this._resolve = resolve;
      this._reject = reject;
    }

    DialogController.prototype.ok = function ok(output) {
      return this.close(true, output);
    };

    DialogController.prototype.cancel = function cancel(output) {
      return this.close(false, output);
    };

    DialogController.prototype.error = function error(message) {
      var _this = this;

      return (0, _lifecycle.invokeLifecycle)(this.viewModel, 'deactivate').then(function () {
        return _this.renderer.hideDialog(_this);
      }).then(function () {
        _this.controller.unbind();
        _this._reject(message);
      });
    };

    DialogController.prototype.close = function close(ok, output) {
      var _this2 = this;

      if (this._closePromise) {
        return this._closePromise;
      }

      this._closePromise = (0, _lifecycle.invokeLifecycle)(this.viewModel, 'canDeactivate').then(function (canDeactivate) {
        if (canDeactivate) {
          return (0, _lifecycle.invokeLifecycle)(_this2.viewModel, 'deactivate').then(function () {
            return _this2.renderer.hideDialog(_this2);
          }).then(function () {
            var result = new _dialogResult.DialogResult(!ok, output);
            _this2.controller.unbind();
            _this2._resolve(result);
            return result;
          });
        }

        _this2._closePromise = undefined;
      }, function (e) {
        _this2._closePromise = undefined;
        return Promise.reject(e);
      });

      return this._closePromise;
    };

    return DialogController;
  }();
});
define('aurelia-dialog/lifecycle',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.invokeLifecycle = invokeLifecycle;
  function invokeLifecycle(instance, name, model) {
    if (typeof instance[name] === 'function') {
      var result = instance[name](model);

      if (result instanceof Promise) {
        return result;
      }

      if (result !== null && result !== undefined) {
        return Promise.resolve(result);
      }

      return Promise.resolve(true);
    }

    return Promise.resolve(true);
  }
});
define('aurelia-dialog/dialog-result',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var DialogResult = exports.DialogResult = function DialogResult(cancelled, output) {
    

    this.wasCancelled = false;

    this.wasCancelled = cancelled;
    this.output = output;
  };
});
define('aurelia-dialog/ai-dialog-body',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogBody = undefined;

  

  var _dec, _dec2, _class;

  var AiDialogBody = exports.AiDialogBody = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-body'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n  </template>\n'), _dec(_class = _dec2(_class = function AiDialogBody() {
    
  }) || _class) || _class);
});
define('aurelia-dialog/ai-dialog-footer',['exports', 'aurelia-templating', './dialog-controller'], function (exports, _aureliaTemplating, _dialogController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AiDialogFooter = undefined;

  function _initDefineProp(target, property, descriptor, context) {
    if (!descriptor) return;
    Object.defineProperty(target, property, {
      enumerable: descriptor.enumerable,
      configurable: descriptor.configurable,
      writable: descriptor.writable,
      value: descriptor.initializer ? descriptor.initializer.call(context) : void 0
    });
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

  var _dec, _dec2, _class, _desc, _value, _class2, _descriptor, _descriptor2, _class3, _temp;

  var AiDialogFooter = exports.AiDialogFooter = (_dec = (0, _aureliaTemplating.customElement)('ai-dialog-footer'), _dec2 = (0, _aureliaTemplating.inlineView)('\n  <template>\n    <slot></slot>\n\n    <template if.bind="buttons.length > 0">\n      <button type="button" class="btn btn-default" repeat.for="button of buttons" click.trigger="close(button)">${button}</button>\n    </template>\n  </template>\n'), _dec(_class = _dec2(_class = (_class2 = (_temp = _class3 = function () {
    function AiDialogFooter(controller) {
      

      _initDefineProp(this, 'buttons', _descriptor, this);

      _initDefineProp(this, 'useDefaultButtons', _descriptor2, this);

      this.controller = controller;
    }

    AiDialogFooter.prototype.close = function close(buttonValue) {
      if (AiDialogFooter.isCancelButton(buttonValue)) {
        this.controller.cancel(buttonValue);
      } else {
        this.controller.ok(buttonValue);
      }
    };

    AiDialogFooter.prototype.useDefaultButtonsChanged = function useDefaultButtonsChanged(newValue) {
      if (newValue) {
        this.buttons = ['Cancel', 'Ok'];
      }
    };

    AiDialogFooter.isCancelButton = function isCancelButton(value) {
      return value === 'Cancel';
    };

    return AiDialogFooter;
  }(), _class3.inject = [_dialogController.DialogController], _temp), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, 'buttons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return [];
    }
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, 'useDefaultButtons', [_aureliaTemplating.bindable], {
    enumerable: true,
    initializer: function initializer() {
      return false;
    }
  })), _class2)) || _class) || _class);
});
define('aurelia-dialog/attach-focus',['exports', 'aurelia-templating'], function (exports, _aureliaTemplating) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.AttachFocus = undefined;

  

  var _dec, _class, _class2, _temp;

  var AttachFocus = exports.AttachFocus = (_dec = (0, _aureliaTemplating.customAttribute)('attach-focus'), _dec(_class = (_temp = _class2 = function () {
    function AttachFocus(element) {
      

      this.value = true;

      this.element = element;
    }

    AttachFocus.prototype.attached = function attached() {
      if (this.value && this.value !== 'false') {
        this.element.focus();
      }
    };

    AttachFocus.prototype.valueChanged = function valueChanged(newValue) {
      this.value = newValue;
    };

    return AttachFocus;
  }(), _class2.inject = [Element], _temp)) || _class);
});
define('aurelia-dialog/dialog-configuration',['exports', './renderer', './dialog-renderer', './dialog-options', 'aurelia-pal'], function (exports, _renderer, _dialogRenderer, _dialogOptions, _aureliaPal) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogConfiguration = undefined;

  

  var defaultRenderer = _dialogRenderer.DialogRenderer;

  var resources = {
    'ai-dialog': './ai-dialog',
    'ai-dialog-header': './ai-dialog-header',
    'ai-dialog-body': './ai-dialog-body',
    'ai-dialog-footer': './ai-dialog-footer',
    'attach-focus': './attach-focus'
  };

  var defaultCSSText = 'ai-dialog-container,ai-dialog-overlay{position:fixed;top:0;right:0;bottom:0;left:0}ai-dialog-overlay{opacity:0}ai-dialog-overlay.active{opacity:1}ai-dialog-container{display:block;transition:opacity .2s linear;opacity:0;overflow-x:hidden;overflow-y:auto;-webkit-overflow-scrolling:touch}ai-dialog-container.active{opacity:1}ai-dialog-container>div{padding:30px}ai-dialog-container>div>div{display:block;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto}ai-dialog-container,ai-dialog-container>div,ai-dialog-container>div>div{outline:0}ai-dialog{display:table;box-shadow:0 5px 15px rgba(0,0,0,.5);border:1px solid rgba(0,0,0,.2);border-radius:5px;padding:3;min-width:300px;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border-image-source:initial;border-image-slice:initial;border-image-width:initial;border-image-outset:initial;border-image-repeat:initial;background:#fff}ai-dialog>ai-dialog-header{display:block;padding:16px;border-bottom:1px solid #e5e5e5}ai-dialog>ai-dialog-header>button{float:right;border:none;display:block;width:32px;height:32px;background:0 0;font-size:22px;line-height:16px;margin:-14px -16px 0 0;padding:0;cursor:pointer}ai-dialog>ai-dialog-body{display:block;padding:16px}ai-dialog>ai-dialog-footer{display:block;padding:6px;border-top:1px solid #e5e5e5;text-align:right}ai-dialog>ai-dialog-footer button{color:#333;background-color:#fff;padding:6px 12px;font-size:14px;text-align:center;white-space:nowrap;vertical-align:middle;-ms-touch-action:manipulation;touch-action:manipulation;cursor:pointer;background-image:none;border:1px solid #ccc;border-radius:4px;margin:5px 0 5px 5px}ai-dialog>ai-dialog-footer button:disabled{cursor:default;opacity:.45}ai-dialog>ai-dialog-footer button:hover:enabled{color:#333;background-color:#e6e6e6;border-color:#adadad}.ai-dialog-open{overflow:hidden}';

  var DialogConfiguration = exports.DialogConfiguration = function () {
    function DialogConfiguration(aurelia) {
      

      this.aurelia = aurelia;
      this.settings = _dialogOptions.dialogOptions;
      this.resources = [];
      this.cssText = defaultCSSText;
      this.renderer = defaultRenderer;
    }

    DialogConfiguration.prototype.useDefaults = function useDefaults() {
      return this.useRenderer(defaultRenderer).useCSS(defaultCSSText).useStandardResources();
    };

    DialogConfiguration.prototype.useStandardResources = function useStandardResources() {
      return this.useResource('ai-dialog').useResource('ai-dialog-header').useResource('ai-dialog-body').useResource('ai-dialog-footer').useResource('attach-focus');
    };

    DialogConfiguration.prototype.useResource = function useResource(resourceName) {
      this.resources.push(resourceName);
      return this;
    };

    DialogConfiguration.prototype.useRenderer = function useRenderer(renderer, settings) {
      this.renderer = renderer;
      this.settings = Object.assign(this.settings, settings || {});
      return this;
    };

    DialogConfiguration.prototype.useCSS = function useCSS(cssText) {
      this.cssText = cssText;
      return this;
    };

    DialogConfiguration.prototype._apply = function _apply() {
      var _this = this;

      this.aurelia.transient(_renderer.Renderer, this.renderer);
      this.resources.forEach(function (resourceName) {
        return _this.aurelia.globalResources(resources[resourceName]);
      });

      if (this.cssText) {
        _aureliaPal.DOM.injectStyles(this.cssText);
      }
    };

    return DialogConfiguration;
  }();
});
define('aurelia-dialog/renderer',['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  

  var Renderer = exports.Renderer = function () {
    function Renderer() {
      
    }

    Renderer.prototype.getDialogContainer = function getDialogContainer() {
      throw new Error('DialogRenderer must implement getDialogContainer().');
    };

    Renderer.prototype.showDialog = function showDialog(dialogController) {
      throw new Error('DialogRenderer must implement showDialog().');
    };

    Renderer.prototype.hideDialog = function hideDialog(dialogController) {
      throw new Error('DialogRenderer must implement hideDialog().');
    };

    return Renderer;
  }();
});
define('aurelia-dialog/dialog-renderer',['exports', 'aurelia-pal', 'aurelia-dependency-injection'], function (exports, _aureliaPal, _aureliaDependencyInjection) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogRenderer = undefined;

  

  var _dec, _class;

  var containerTagName = 'ai-dialog-container';
  var overlayTagName = 'ai-dialog-overlay';
  var transitionEvent = function () {
    var transition = null;

    return function () {
      if (transition) return transition;

      var t = void 0;
      var el = _aureliaPal.DOM.createElement('fakeelement');
      var transitions = {
        'transition': 'transitionend',
        'OTransition': 'oTransitionEnd',
        'MozTransition': 'transitionend',
        'WebkitTransition': 'webkitTransitionEnd'
      };
      for (t in transitions) {
        if (el.style[t] !== undefined) {
          transition = transitions[t];
          return transition;
        }
      }
    };
  }();

  var DialogRenderer = exports.DialogRenderer = (_dec = (0, _aureliaDependencyInjection.transient)(), _dec(_class = function () {
    function DialogRenderer() {
      var _this = this;

      

      this._escapeKeyEventHandler = function (e) {
        if (e.keyCode === 27) {
          var top = _this._dialogControllers[_this._dialogControllers.length - 1];
          if (top && top.settings.lock !== true) {
            top.cancel();
          }
        }
      };
    }

    DialogRenderer.prototype.getDialogContainer = function getDialogContainer() {
      return _aureliaPal.DOM.createElement('div');
    };

    DialogRenderer.prototype.showDialog = function showDialog(dialogController) {
      var _this2 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];
      var wrapper = document.createElement('div');

      this.modalOverlay = _aureliaPal.DOM.createElement(overlayTagName);
      this.modalContainer = _aureliaPal.DOM.createElement(containerTagName);
      this.anchor = dialogController.slot.anchor;
      wrapper.appendChild(this.anchor);
      this.modalContainer.appendChild(wrapper);

      this.stopPropagation = function (e) {
        e._aureliaDialogHostClicked = true;
      };
      this.closeModalClick = function (e) {
        if (!settings.lock && !e._aureliaDialogHostClicked) {
          dialogController.cancel();
        } else {
          return false;
        }
      };

      dialogController.centerDialog = function () {
        if (settings.centerHorizontalOnly) return;
        centerDialog(_this2.modalContainer);
      };

      this.modalOverlay.style.zIndex = settings.startingZIndex;
      this.modalContainer.style.zIndex = settings.startingZIndex;

      var lastContainer = Array.from(body.querySelectorAll(containerTagName)).pop();

      if (lastContainer) {
        lastContainer.parentNode.insertBefore(this.modalContainer, lastContainer.nextSibling);
        lastContainer.parentNode.insertBefore(this.modalOverlay, lastContainer.nextSibling);
      } else {
        body.insertBefore(this.modalContainer, body.firstChild);
        body.insertBefore(this.modalOverlay, body.firstChild);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.addEventListener('keyup', this._escapeKeyEventHandler);
      }

      this._dialogControllers.push(dialogController);

      dialogController.slot.attached();

      if (typeof settings.position === 'function') {
        settings.position(this.modalContainer, this.modalOverlay);
      } else {
        dialogController.centerDialog();
      }

      this.modalContainer.addEventListener('click', this.closeModalClick);
      this.anchor.addEventListener('click', this.stopPropagation);

      return new Promise(function (resolve) {
        var renderer = _this2;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this2.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this2.modalOverlay.classList.add('active');
        _this2.modalContainer.classList.add('active');
        body.classList.add('ai-dialog-open');

        function onTransitionEnd(e) {
          if (e.target !== renderer.modalContainer) {
            return;
          }
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      });
    };

    DialogRenderer.prototype.hideDialog = function hideDialog(dialogController) {
      var _this3 = this;

      var settings = dialogController.settings;
      var body = _aureliaPal.DOM.querySelectorAll('body')[0];

      this.modalContainer.removeEventListener('click', this.closeModalClick);
      this.anchor.removeEventListener('click', this.stopPropagation);

      var i = this._dialogControllers.indexOf(dialogController);
      if (i !== -1) {
        this._dialogControllers.splice(i, 1);
      }

      if (!this._dialogControllers.length) {
        _aureliaPal.DOM.removeEventListener('keyup', this._escapeKeyEventHandler);
      }

      return new Promise(function (resolve) {
        var renderer = _this3;
        if (settings.ignoreTransitions) {
          resolve();
        } else {
          _this3.modalContainer.addEventListener(transitionEvent(), onTransitionEnd);
        }

        _this3.modalOverlay.classList.remove('active');
        _this3.modalContainer.classList.remove('active');

        function onTransitionEnd() {
          renderer.modalContainer.removeEventListener(transitionEvent(), onTransitionEnd);
          resolve();
        }
      }).then(function () {
        body.removeChild(_this3.modalOverlay);
        body.removeChild(_this3.modalContainer);
        dialogController.slot.detached();

        if (!_this3._dialogControllers.length) {
          body.classList.remove('ai-dialog-open');
        }

        return Promise.resolve();
      });
    };

    return DialogRenderer;
  }()) || _class);


  DialogRenderer.prototype._dialogControllers = [];

  function centerDialog(modalContainer) {
    var child = modalContainer.children[0];
    var vh = Math.max(_aureliaPal.DOM.querySelectorAll('html')[0].clientHeight, window.innerHeight || 0);

    child.style.marginTop = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
    child.style.marginBottom = Math.max((vh - child.offsetHeight) / 2, 30) + 'px';
  }
});
define('aurelia-dialog/dialog-options',["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var dialogOptions = exports.dialogOptions = {
    lock: true,
    centerHorizontalOnly: false,
    startingZIndex: 1000,
    ignoreTransitions: false
  };
});
define('aurelia-dialog/dialog-service',['exports', 'aurelia-metadata', 'aurelia-dependency-injection', 'aurelia-templating', './dialog-controller', './renderer', './lifecycle', './dialog-result', './dialog-options'], function (exports, _aureliaMetadata, _aureliaDependencyInjection, _aureliaTemplating, _dialogController, _renderer, _lifecycle, _dialogResult, _dialogOptions) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.DialogService = undefined;

  

  var _class, _temp;

  var DialogService = exports.DialogService = (_temp = _class = function () {
    function DialogService(container, compositionEngine) {
      

      this.container = container;
      this.compositionEngine = compositionEngine;
      this.controllers = [];
      this.hasActiveDialog = false;
    }

    DialogService.prototype.open = function open(settings) {
      return this.openAndYieldController(settings).then(function (controller) {
        return controller.result;
      });
    };

    DialogService.prototype.openAndYieldController = function openAndYieldController(settings) {
      var _this = this;

      var childContainer = this.container.createChild();
      var dialogController = void 0;
      var promise = new Promise(function (resolve, reject) {
        dialogController = new _dialogController.DialogController(childContainer.get(_renderer.Renderer), _createSettings(settings), resolve, reject);
      });
      childContainer.registerInstance(_dialogController.DialogController, dialogController);
      dialogController.result = promise;
      dialogController.result.then(function () {
        _removeController(_this, dialogController);
      }, function () {
        _removeController(_this, dialogController);
      });
      return _openDialog(this, childContainer, dialogController).then(function () {
        return dialogController;
      });
    };

    return DialogService;
  }(), _class.inject = [_aureliaDependencyInjection.Container, _aureliaTemplating.CompositionEngine], _temp);


  function _createSettings(settings) {
    settings = Object.assign({}, _dialogOptions.dialogOptions, settings);
    settings.startingZIndex = _dialogOptions.dialogOptions.startingZIndex;
    return settings;
  }

  function _openDialog(service, childContainer, dialogController) {
    var host = dialogController.renderer.getDialogContainer();
    var instruction = {
      container: service.container,
      childContainer: childContainer,
      model: dialogController.settings.model,
      view: dialogController.settings.view,
      viewModel: dialogController.settings.viewModel,
      viewSlot: new _aureliaTemplating.ViewSlot(host, true),
      host: host
    };

    return _getViewModel(instruction, service.compositionEngine).then(function (returnedInstruction) {
      dialogController.viewModel = returnedInstruction.viewModel;
      dialogController.slot = returnedInstruction.viewSlot;

      return (0, _lifecycle.invokeLifecycle)(dialogController.viewModel, 'canActivate', dialogController.settings.model).then(function (canActivate) {
        if (canActivate) {
          return service.compositionEngine.compose(returnedInstruction).then(function (controller) {
            service.controllers.push(dialogController);
            service.hasActiveDialog = !!service.controllers.length;
            dialogController.controller = controller;
            dialogController.view = controller.view;

            return dialogController.renderer.showDialog(dialogController);
          });
        }
      });
    });
  }

  function _getViewModel(instruction, compositionEngine) {
    if (typeof instruction.viewModel === 'function') {
      instruction.viewModel = _aureliaMetadata.Origin.get(instruction.viewModel).moduleId;
    }

    if (typeof instruction.viewModel === 'string') {
      return compositionEngine.ensureViewModel(instruction);
    }

    return Promise.resolve(instruction);
  }

  function _removeController(service, controller) {
    var i = service.controllers.indexOf(controller);
    if (i !== -1) {
      service.controllers.splice(i, 1);
      service.hasActiveDialog = !!service.controllers.length;
    }
  }
});
define('text!app.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"bootstrap/css/bootstrap.css\"></require>\r\n  <require from=\"./styles.css\"></require>\r\n<nav class=\"navbar navbar-inverse navbar-fixed-top\">\r\n  <div class=\"container-fluid\">\r\n    <div class=\"navbar-header\">\r\n      <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\"#myNavbar\">\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>\r\n        <span class=\"icon-bar\"></span>                        \r\n      </button>\r\n      <a class=\"navbar-brand\" href=\"#\">Questionary</a>\r\n    </div>\r\n    <div class=\"collapse navbar-collapse\" id=\"myNavbar\">\r\n      <ul class=\"nav navbar-nav\">\r\n        <li><a if.bind=\"auth.isLogedIn\" href=\"/#/home\"><span class=\"fa fa-home\"></span>Home</a></li>\r\n        <li><a href=\"#\">About</a></li>\r\n      </ul>\r\n      <form class=\"navbar-form navbar-left\">\r\n        <div class=\"input-group\">\r\n          <div class=\"form-group\">\r\n            <input type=\"text\" class=\"form-control\" placeholder=\"Search\">\r\n          </div>\r\n          <div class=\"input-group-btn\">\r\n            <button type=\"submit\" class=\"btn btn-default\">Submit</button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n      <ul class=\"nav navbar-nav navbar-right\">\r\n        <li><a if.bind=\"!auth.isLogedIn\" href=\"#\" click.trigger=\"signupModal()\"><span class=\"fa fa-user\"></span> Sign Up</a></li>\r\n        <li><a if.bind=\"!auth.isLogedIn\" href=\"#\" click.trigger=\"loginModal()\"><span class=\"fa fa-sign-in\"></span> Login</a></li>\r\n        <li><a if.bind=\"auth.isLogedIn\" href=\"#\" click.trigger=\"auth.logout()\"><span class=\"fa fa-sign-out\"></span> Logout</a></li>\r\n      </ul>\r\n    </div>\r\n  </div>\r\n</nav>\r\n      <div class='router-view'>\r\n        <router-view class=\"col-md-12 col-xs-12 col-sm-12 col-lg-12\"></router-view>\r\n      </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!styles.css', ['module'], function(module) { module.exports = "section {\r\n  margin: 0 20px;\r\n}\r\n\r\na:focus {\r\n  outline: none;\r\n}\r\n\r\n.navbar-nav li.loader {\r\n    margin: 12px 24px 0 6px;\r\n}\r\n\r\n.no-selection {\r\n  margin: 20px;\r\n}\r\n\r\n.contact-list {\r\n  overflow-y: auto;\r\n  border: 1px solid #ddd;\r\n  padding: 10px;\r\n}\r\n\r\n.panel {\r\n  margin: 20px;\r\n}\r\n\r\n.button-bar {\r\n  right: 0;\r\n  left: 0;\r\n  bottom: 0;\r\n  border-top: 1px solid #ddd;\r\n  background: white;\r\n}\r\n\r\n.button-bar > button {\r\n  float: right;\r\n  margin: 20px;\r\n}\r\n\r\nli.list-group-item {\r\n  list-style: none;\r\n}\r\n\r\nli.list-group-item > a {\r\n  text-decoration: none;\r\n}\r\n\r\nli.list-group-item.active > a {\r\n  color: white;\r\n}\r\n\r\n.question {\r\n    background-color: #eee;\r\n    border-radius: 7px;\r\n    /*box-shadow: 2px 2px 2px 2px #eee;*/\r\n    border: 1px solid #eee;\r\n    color: #333;\r\n    text-align: left;\r\n    margin-bottom: 35px;\r\n}\r\n\r\n.question-clickable:hover {\r\n    color: dodgerblue;\r\n    cursor: pointer;\r\n}\r\n\r\n.question-text {\r\n    color: #333;\r\n    background-color: white;\r\n    text-align: start;\r\n}\r\n.tag-pill{\r\n    background-color: #888;\r\n}\r\n.question-text {\r\n    font-family: \"Arial\";\r\n    font-size: 16px;\r\n    white-space: pre-line;\r\n    height: 100%;\r\n}\r\n\r\n.question-headline {\r\n    font-size: 22px;\r\n    font-weight: bold;\r\n}\r\n\r\n.question-answers {\r\n    background-color: #444444;\r\n    color: #F2DEDE;\r\n}\r\n\r\n.question-tags {\r\n    /*background-color: #eee;*/\r\n    padding-bottom: 10px;\r\n    text-align: left;\r\n}\r\n\r\n.question-user {\r\n    font-style: italic;\r\n    font-size: 13px;\r\n    text-align: right;\r\n}\r\n\r\n.question-domain {\r\n    font-style: italic;\r\n    font-size: 13px;\r\n    text-align: right;\r\n}\r\n\r\n.question-admin {\r\n    text-align: right;\r\n}\r\n\r\n.question-trash {\r\n    background-color: #222222;\r\n    color: #FF3333;\r\n}\r\n\r\n.question-trash:hover {\r\n    background-color: #FF3333;\r\n    color: #222222;\r\n    cursor: pointer;\r\n}\r\n\r\n.question-pencil {\r\n    background-color: #222222;\r\n    color: #FFFF66;\r\n}\r\n\r\n.question-pencil:hover {\r\n    background-color: #FFFF66;\r\n    color: #222222;\r\n    cursor: pointer;\r\n}\r\n\r\n.votes-plus {\r\n    background-color: #DFF0D8;\r\n    color: seagreen;\r\n}\r\n\r\n.votes-minus {\r\n    background-color: #F2DEDE;\r\n    color: darkred; \r\n}\r\n\r\nai-dialog-overlay.active {\r\n  background-color: black;\r\n  opacity: .5;\r\n}\r\n\r\n.router-view {\r\n  margin-top: 80px;\r\n}"; });
define('text!dialogs/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog>\r\n    <ai-dialog-header>\r\n      <button type=\"button\" class=\"close\" click.trigger=\"dialogController.cancel()\">&times;</button>\r\n      <h4 class=\"modal-title\">Log in</h4>\r\n    </ai-dialog-header>\r\n    <ai-dialog-body>\r\n      <form class=\"form-horizontal\" role=\"form\" submit.delegate=\"login()\">\r\n        <div class=\"form-group\">\r\n          <label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" for=\"email\">Email:</label>\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <input value.bind=\"email\" required type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Enter your email\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" for=\"pwd\">Password:</label>\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <input value.bind=\"password\" required type=\"password\" class=\"form-control\" id=\"pwd\" placeholder=\"Enter your password\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <div class=\"checkbox\">\r\n              <label><input type=\"checkbox\"> Remember me</label>\r\n            </div>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div show.bind=\"loginError\" class=\"col-lg-offset-2 col-lg-6 col-md-offset-2 col-md-6 col-sm-offset-3 col-sm-6 alert alert-danger\">\r\n            <p><i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i> <strong> Error: </strong> Email or password you provided\r\n              do not match with any existing user</p>\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <button type=\"submit\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-default btn-lg\">\r\n              <i class=\"fa fa-sign-in\" aria-hidden=\"true\"></i>\r\n              <span>Log in</span>\r\n            </button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </ai-dialog-body>\r\n  </ai-dialog>\r\n</template>"; });
define('text!dialogs/signup.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog>\r\n    <ai-dialog-header>\r\n      <button type=\"button\" class=\"close\" click.trigger=\"dialogController.cancel()\">&times;</button>\r\n      <h4 class=\"modal-title\">Sign up with your credentials</h4>\r\n    </ai-dialog-header>\r\n    <ai-dialog-body>\r\n\r\n      <form class=\"form-horizontal\" role=\"form\" submit.delegate=\"signup()\">\r\n        <div class=\"form-group\">\r\n          <label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" for=\"name\">Full name:</label>\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <input value.bind=\"name\" required type=\"text\" class=\"form-control\" id=\"name\" placeholder=\"Enter your full name\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" for=\"email\">Email:</label>\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <input value.bind=\"email\" required type=\"email\" class=\"form-control\" id=\"email\" placeholder=\"Enter your email\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <label class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" for=\"pwd\">Password:</label>\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <input value.bind=\"password\" required type=\"password\" class=\"form-control\" id=\"pwd\" placeholder=\"Enter password\">\r\n          </div>\r\n        </div>\r\n        <div class=\"form-group\">\r\n          <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n            <button type=\"submit\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 btn btn-default btn-lg\">\r\n              <i class=\"fa fa-user-plus\" aria-hidden=\"true\"></i>\r\n              <span>Signup</span>  \r\n            </button>\r\n          </div>\r\n        </div>\r\n      </form>\r\n    </ai-dialog-body>\r\n  </ai-dialog>\r\n</template>"; });
define('text!pages/home.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"row\">\r\n    <question-form class='col-md-6'></question-form>\r\n  </div>\r\n  <div class='row'>\r\n    <div class='col-md-6'>\r\n      <h4>Your Questions:</h4>\r\n      <question-list source.bind='\"mine\"'></question-list>\r\n    </div>\r\n    <div class='col-md-6'>\r\n      <h4>Pinned Questions:</h4>\r\n      <question-list source.bind='\"pinned\"'></question-list>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!pages/question-details.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"../resources/elements/question\"></require>\r\n  <require from=\"../resources/elements/answer\"></require>\r\n\r\n  <question content.bind=\"questionContent\"></question>\r\n  <div>\r\n    <div repeat.for=\"answer of answers\">\r\n      <answer content.bind=\"answer\"></answer>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!pages/questions.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"row\">\r\n    <question-filter class =\"col-xs-12 col-sm-4 col-md-4 col-lg-4\"></question-filter>\r\n    <div class =\"col-xs-12 col-sm-8 col-md-8 col-lg-8\">\r\n      <h4> Filtered Questions: </h4>\r\n      <question-list></question-list>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!resources/elements/answer.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"well\">\r\n    <div>\r\n      <div class=\"well\">\r\n        <div class=\"answer-text\">${content.text}</div>\r\n      </div>\r\n    </div>\r\n\r\n    <div class=\"row\">\r\n      <div class=\"col-lg-8 col-md-8 col-sm-8 col-xs-12\">\r\n        <button if.bind=\"authorized\" class=\"btn btn-danger btn-xs\"><i class=\"fa fa-trash\" aria-hidden=\"true\"></i> <span> Delete </span></button>\r\n        <button if.bind=\"authenticated && !authorized\" click.delegate=\"voteUp()\" class=\"btn btn-success btn-xs\"><i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i> <span class=\"badge\">${content.positiveVotes}</span></button>\r\n        <button if.bind=\"authenticated && !authorized\" click.delegate=\"voteDown()\" class=\"btn btn-danger btn-xs\"><i class=\"fa fa-thumbs-o-down\" aria-hidden=\"true\"></i> <span class=\"badge\">${content.positiveVotes}</span></button>\r\n      </div>\r\n      <div class=\"col-lg-4 col-md-4 col-sm-4 col-xs-12 question-user\">\r\n        <i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i> <i>someuser@mail.com</i>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!resources/elements/confirmation-dialog.html', ['module'], function(module) { module.exports = "<template>\r\n  <ai-dialog>\r\n    <ai-dialog-header>\r\n      <h4 class=\"modal-title\"> ${headline} </h4>\r\n    </ai-dialog-header>\r\n      <ai-dialog-body>\r\n         <h2>${message}</h2>\r\n      </ai-dialog-body>\r\n      <ai-dialog-footer>\r\n         <button click.trigger = \"dialogController.cancel()\">Cancel</button>\r\n         <button click.trigger = \"dialogController.ok(message)\">Ok</button>\r\n      </ai-dialog-footer>\r\n  </ai-dialog>\r\n</template>"; });
define('text!resources/elements/navigation-element.html', ['module'], function(module) { module.exports = "<template bindable=\"href, title, icon\">\r\n      <a class=\"navbar-brand\" href=\"${href}\">\r\n        <i class=\"${icon}\"></i>\r\n        <span>${title}</span>\r\n      </a>\r\n</template>"; });
define('text!resources/elements/question-filter.html', ['module'], function(module) { module.exports = "<template>\r\n    <div>\r\n    <form role=\"form\" submit.delegate=\"filter()\">\r\n      <div class=\"form-group\">\r\n        <label for=\"questionText\"> Text:</label> \r\n        <input type=\"text\" name=\"questionText\" value.bind=\"questionText\" class=\"form-control\"> \r\n        \r\n        <label for=\"tag\">Tag</label>\r\n        <input type=\"text\" name=\"tag\" value.bind=\"tag\" class=\"form-control\">\r\n\r\n        <label for=\"domain\">Domain:</label>\r\n        <input type=\"text\" name=\"domain\" value.bind=\"domain\" class=\"form-control\">\r\n\r\n        <label for=\"dateFrom\">Date From:</label>\r\n        <input type=\"date\" name=\"dateFrom\" value.bind=\"dateFrom\" class=\"form-control\">\r\n        \r\n        <label for=\"dateTo\">Date To:</label>\r\n        <input type=\"date\" name=\"dateTo\"value.bind=\"dateTo\" class=\"form-control\">\r\n        \r\n        <button type=\"submit\" class=\"btn btn-default\"> \r\n          <span> \r\n            <i class=\"fa fa-filter\" aria-hidden=\"true\"></i>\r\n            Filter \r\n          </span> \r\n        </button>\r\n      </div>\r\n    </form>\r\n  </div>\r\n</template>"; });
define('text!resources/elements/question-form.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"toastr/build/toastr.min.css\"></require>\r\n  <div><button class=\"btn btn-default\" data-toggle=\"collapse\" data-target=\".questionForm\">Ask a Question</button></div>\r\n  <form class=\"questionForm collapse\" role=\"form\" submit.delegate=\"postQuestion()\">\r\n    <h3>Ask your question</h3>\r\n    <div class=\"form-group\">\r\n      <labelfor=\"headline\">Headline:</label>\r\n      <input value.bind=\"headline\" required type=\"text\" class=\"form-control\" name=\"headline\" placeholder=\"Enter the headline of your question\">\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <labelfor=\"text\">Text:</label>\r\n      <textarea value.bind=\"text\" class=\"form-control\" rows=\"7\" name=\"text\" placeholder=\"Enter the text of your question\"></textarea>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div show.bind=\"serverError\" class=\"alert alert-danger\">\r\n        <p><i class=\"fa fa-exclamation\" aria-hidden=\"true\"></i> <strong> Error: </strong> Some kind of a server error! </p>\r\n      </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <div>\r\n          &nbsp;<span repeat.for=\"tag of tags\"> <span class=\"tag tag-pill\"> ${tag} <i click.trigger=\"removeTag(tag)\" class=\"fa fa-times\" aria-hidden=\"true\"></i></span>          </span>\r\n        </div>\r\n        <div class=\"input-group\">\r\n          <input type=\"text\" class=\"form-control\" name=\"tag\" placeholder=\"Add tag:\" value.bind=\"tag\">\r\n          <div class=\"input-group-btn\">\r\n            <button class=\"btn btn-primary\" click.trigger=\"addTag()\"> \r\n              <i class=\"fa fa-plus\" aria-hidden=\"true\"></i>\r\n              <i class=\"fa fa-tag\" aria-hidden=\"true\"></i>\r\n            </button>\r\n          </div>\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n        <div class=\"input-group\">\r\n          <label for=\"doman\"> Domain: </label>\r\n          <select value.bind=\"domain\" name=\"domain\" class=\"form-control\" data-live-search=\"true\" style=\"height: 34px\">\r\n            <option repeat.for=\"domainOption of domains\" model.bind=\"domainOption\">${domainOption.text}</option>\r\n          </select>\r\n        </div>\r\n    </div>\r\n    <div class=\"form-group\">\r\n      <div class=\"col-sm-offset-4 col-sm-8\">\r\n        <button type=\"submit\" class=\"btn btn-default\">Post question</button>\r\n      </div>\r\n    </div>\r\n  </form>\r\n</template>"; });
define('text!resources/elements/question-list.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from=\"./question\"></require>\r\n  <div if.bind=\"questions.length !== 0\" value.bind=\"currentIndex\">\r\n    <div>\r\n      <div if.bind=\"qssIsNotEmpty\" repeat.for=\"question of qss[currentIndex]\">\r\n        <question content.bind=\"question\"></question>\r\n      </div>\r\n      <div>\r\n        <div if.bind=\"qssIsNotEmpty\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\" style=\"text-align: center;\">\r\n          <ul class=\"pagination pagination\" repeat.for=\"index of pageIndexes\">\r\n            <li class=\"${currentIndex == index? 'active':''}\">\r\n              <a click.delegate=\"setPage(index)\" href=\"#\">${index+1}</a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n  <div if.bind=\"questions.length === 0\">\r\n    <div class=\"jumbotron\"> No questions asked yet </div>\r\n  </div>\r\n</template>"; });
define('text!resources/elements/question.html', ['module'], function(module) { module.exports = "<template>\r\n    <require from=\"../value-converters/dates\"></require>\r\n    <div if.bind=\"!deleted\" class=\"question\">\r\n        <!-- Headline -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-10 col-md-8 col-sm-8 col-xs-12 question-clickable question-headline\"> <a route-href=\"route: question-details; params.bind: { id: content._id }\">${content.headline}</a></div>\r\n            <!--if.bind=\"cuser.isLogedIn && content.createdByUserId == cuser.id\"-->\r\n            <div class=\"col-lg-2 col-md-4 col-sm-4 col-xs-12 question-admin\">\r\n                <button if.bind=\"authorized\" class=\"btn btn-warning btn-xs\">\r\n                    <i class=\"fa fa-pencil\" aria-hidden=\"true\"></i>\r\n                </button>\r\n                <button if.bind=\"authorized\" class=\"btn btn-danger btn-xs\" click.trigger=\"delete()\">\r\n                    <i class=\"fa fa-trash\" aria-hidden=\"true\"></i>\r\n                </button>\r\n                <button if.bind=\"authenticated && !authorized\" class=\"btn btn-info btn-xs\" click.trigger=\"pin()\">\r\n                    <i class=\"fa fa-thumb-tack\" style=\"color: ${pinned ? 'black': 'white'}\" aria-hidden=\"true\"></i>\r\n                </button>\r\n            </div>\r\n        </div>\r\n\r\n        <div>\r\n            <div class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n                <div class=\"row\">\r\n                    <div class=\"question-text\">${content.text}</div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <!-- Tags and Domain -->\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-8 col-md-8 col-sm-6 col-xs-12 question-tags\">\r\n                <i class=\"fa fa-tags\" aria-hidden=\"true\"></i>\r\n                <span style=\"color: #999\" if.bind=\"content.TagQuestions.length === 0\"><i>(No tags attached)</i></span>\r\n                <span repeat.for=\"tag of content.TagQuestions\"> <span class=\"tag tag-pill\"> ${tag.TagText} </span></span>\r\n            </div>\r\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 question-domain\">\r\n               <div class=\"col-xs-12\"> <i>${content.DomainText}</i></div>\r\n            </div>\r\n        </div>\r\n        <div class=\"row\">\r\n            <div class=\"col-lg-8 col-md-8 col-sm-6 col-xs-12\">\r\n                    <button if.bind=\"authenticated\" class=\"btn btn-default btn-xs col-sm-12 col-xs-4 col-md-4\" data-toggle=\"collapse\" data-target=\"#quick-answer-${content._id}\"><i class=\"fa fa-pencil\" aria-hidden=\"true\"></i><span> Answer</span> <span>${content.Answers.length}</span></button>\r\n                    <button if.bind=\"authenticated\" class=\"btn btn-default btn-xs col-sm-6 col-xs-4 col-md-4\" click.delegate=\"voteUp()\"><i class=\"fa fa-thumbs-o-up\" aria-hidden=\"true\"></i> <span>${content.positiveVotes}</span></button>\r\n                    <button if.bind=\"authenticated\" class=\"btn btn-default btn-xs col-sm-6 col-xs-4 col-md-4\" click.delegate=\"voteDown()\" style=\"color:red\"><i class=\"fa fa-thumbs-o-down\" aria-hidden=\"true\"></i> <span>${content.negativeVotes}</span></button>\r\n            </div>\r\n            <div class=\"col-lg-4 col-md-4 col-sm-6 col-xs-12 question-user\">\r\n                <div class=\"col-xs-12\">${content.createdAt | dateFormat}</div>  \r\n                <div class=\"col-xs-12\"><i class=\"fa fa-user-circle-o\" aria-hidden=\"true\"></i><i>someuser@mail.com</i></div>\r\n            </div>\r\n            <div id=\"quick-answer-${content._id}\" class=\"col-lg-12 col-md-12 col-sm-12 col-xs-12 collapse\">\r\n                <form class=\"form-horizontal\" role=\"form\" submit.delegate=\"quickAnswer()\">\r\n                    <div class=\"form-group col-lg-12 col-md-12 col-sm-12 col-xs-12\">\r\n                        <label class=\"control-label\" for=\"answer\">Answer:</label>\r\n                        <textarea value.bind=\"answerText\" class=\"form-control\" rows=\"7\" name=\"answer\" placeholder=\"Enter quick answer here\"></textarea>\r\n                        <button type=\"submit\" data-toggle=\"collapse\" data-target=\"#quick-answer-${content._id}\" class=\"btn btn-default\">Post answer</button>\r\n                    </div>\r\n                </form>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map
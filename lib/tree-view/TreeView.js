'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _objectWithoutProperties2 = require('babel-runtime/helpers/objectWithoutProperties');

var _objectWithoutProperties3 = _interopRequireDefault(_objectWithoutProperties2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _defineProperty2 = require('babel-runtime/helpers/defineProperty');

var _defineProperty3 = _interopRequireDefault(_defineProperty2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

var _pathUtils = require('./pathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var reducer = function reducer(state, action) {
  switch (action.type) {
    case 'TOGGLE_EXPAND':
      var path = action.path;
      var expandedPaths = state.expandedPaths;
      var expanded = !!expandedPaths[path];

      return Object.assign({}, state, {
        expandedPaths: Object.assign({}, state.expandedPaths, (0, _defineProperty3.default)({}, path, !expanded))
      });
    default:
      return state;
  }
};

var ConnectedTreeNode = function (_Component) {
  (0, _inherits3.default)(ConnectedTreeNode, _Component);

  function ConnectedTreeNode(props, context) {
    (0, _classCallCheck3.default)(this, ConnectedTreeNode);

    var _this = (0, _possibleConstructorReturn3.default)(this, (ConnectedTreeNode.__proto__ || Object.getPrototypeOf(ConnectedTreeNode)).call(this, props));

    _this.state = context.store.storeState;
    return _this;
  }

  (0, _createClass3.default)(ConnectedTreeNode, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps, nextState) {
      return !!nextState.expandedPaths[nextProps.path] !== !!this.state.expandedPaths[this.props.path] || nextProps.data !== this.props.data || nextProps.name !== this.props.name;
    }
  }, {
    key: 'handleClick',
    value: function handleClick(path) {
      this.context.store.storeState = reducer(this.context.store.storeState, {
        type: 'TOGGLE_EXPAND',
        path: path
      });
      if (this.props.handleExpand) {
        this.props.handleExpand(path);
      }
      this.setState(this.context.store.storeState);
    }
  }, {
    key: 'renderChildNodes',
    value: function renderChildNodes(parentData, parentPath) {
      var dataIterator = this.props.dataIterator;
      var depth = this.props.depth;
      var _props = this.props,
          nodeRenderer = _props.nodeRenderer,
          handleExpand = _props.handleExpand;


      var childNodes = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = dataIterator(parentData)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _ref2 = _step.value;
          var name = _ref2.name,
              data = _ref2.data,
              props = (0, _objectWithoutProperties3.default)(_ref2, ['name', 'data']);

          var key = name;
          var path = parentPath + '.' + key;
          childNodes.push(_react2.default.createElement(ConnectedTreeNode, (0, _extends3.default)({
            name: name,
            data: data,
            depth: depth + 1,
            path: path,
            key: key,
            dataIterator: dataIterator,
            nodeRenderer: nodeRenderer
            // This should pass down the prop received from the object inspector
            , handleExpand: handleExpand
          }, props)) // props for nodeRenderer
          );
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return childNodes;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props2 = this.props,
          data = _props2.data,
          dataIterator = _props2.dataIterator,
          path = _props2.path,
          depth = _props2.depth;


      var nodeHasChildNodes = (0, _pathUtils.hasChildNodes)(data, dataIterator);
      var expandedPaths = this.state.expandedPaths;

      var expanded = !!expandedPaths[path];

      var nodeRenderer = this.props.nodeRenderer;


      return _react2.default.createElement(
        _TreeNode2.default,
        (0, _extends3.default)({
          expanded: expanded,
          onClick: nodeHasChildNodes ? this.handleClick.bind(this, path) : function () {}
          // show arrow anyway even if not expanded and not rendering children
          , shouldShowArrow: nodeHasChildNodes
          // show placeholder only for non root nodes
          , shouldShowPlaceholder: depth > 0
          // Render a node from name and data (or possibly other props like isNonenumerable)
          , nodeRenderer: nodeRenderer
        }, this.props),
        // only render if the node is expanded
        expanded ? this.renderChildNodes(data, path) : undefined
      );
    }
  }]);
  return ConnectedTreeNode;
}(_react.Component);

ConnectedTreeNode.propTypes = {
  name: _propTypes2.default.string,
  data: _propTypes2.default.any,
  dataIterator: _propTypes2.default.func,

  depth: _propTypes2.default.number,
  expanded: _propTypes2.default.bool,

  nodeRenderer: _propTypes2.default.func
};

ConnectedTreeNode.contextTypes = {
  store: _propTypes2.default.any
};

var TreeView = function (_Component2) {
  (0, _inherits3.default)(TreeView, _Component2);

  function TreeView(props) {
    (0, _classCallCheck3.default)(this, TreeView);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (TreeView.__proto__ || Object.getPrototypeOf(TreeView)).call(this, props));

    _this2.store = {
      storeState: {
        expandedPaths: (0, _pathUtils.getExpandedPaths)(props.data, props.dataIterator, props.expandPaths, props.expandLevel)
      }
    };
    return _this2;
  }

  (0, _createClass3.default)(TreeView, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.store = {
        storeState: {
          expandedPaths: (0, _pathUtils.getExpandedPaths)(nextProps.data, nextProps.dataIterator, nextProps.expandPaths, nextProps.expandLevel, this.store.storeState.expandedPaths)
        }
      };
    }
  }, {
    key: 'getChildContext',
    value: function getChildContext() {
      return {
        store: this.store
      };
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          name = _props3.name,
          data = _props3.data,
          dataIterator = _props3.dataIterator;
      var nodeRenderer = this.props.nodeRenderer;


      var rootPath = _pathUtils.DEFAULT_ROOT_PATH;

      return _react2.default.createElement(ConnectedTreeNode, {
        name: name,
        data: data,
        dataIterator: dataIterator,
        depth: 0,
        path: rootPath,
        nodeRenderer: nodeRenderer
      });
    }
  }]);
  return TreeView;
}(_react.Component);

TreeView.defaultProps = {
  expandLevel: 0,
  expandPaths: []
};
TreeView.childContextTypes = {
  store: _propTypes2.default.any
};


TreeView.propTypes = {
  name: _propTypes2.default.string,
  data: _propTypes2.default.any,
  dataIterator: _propTypes2.default.func,

  nodeRenderer: _propTypes2.default.func
};

TreeView.defaultProps = {
  name: undefined
};

exports.default = TreeView;
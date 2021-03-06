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

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _TreeNode = require('./TreeNode');

var _TreeNode2 = _interopRequireDefault(_TreeNode);

var _pathUtils = require('./pathUtils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ConnectedTreeNode = function (_Component) {
  (0, _inherits3.default)(ConnectedTreeNode, _Component);

  function ConnectedTreeNode(props) {
    (0, _classCallCheck3.default)(this, ConnectedTreeNode);

    // Keep this as a non-state variable because we don't want to trigger re-renders
    var _this = (0, _possibleConstructorReturn3.default)(this, (ConnectedTreeNode.__proto__ || Object.getPrototypeOf(ConnectedTreeNode)).call(this, props));

    _this.userClicked = false;
    return _this;
  }

  (0, _createClass3.default)(ConnectedTreeNode, [{
    key: 'shouldComponentUpdate',
    value: function shouldComponentUpdate(nextProps) {
      var keys = Object.keys(nextProps.expandedPaths);

      if (this.props.shouldComponentUpdate && this.props.shouldComponentUpdate(this.props, nextProps)) return true;

      if (keys.length !== Object.keys(this.props.expandedPaths).length) return true;

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = keys[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          if (!!nextProps[key] !== !!this.props.expandedPaths[key]) return true;
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

      return nextProps.data !== this.props.data || nextProps.name !== this.props.name;
    }
  }, {
    key: 'getExpanded',
    value: function getExpanded() {
      var _props = this.props,
          path = _props.path,
          controlledPaths = _props.controlledPaths,
          expandedPaths = _props.expandedPaths;

      var controlled = !!controlledPaths[path];
      var expanded = this.props.shouldExpand && !controlled ? this.props.shouldExpand(this.props) : !!expandedPaths[path];

      return expanded;
    }

    /**
     * React lifecycle method to determine if this component has changed dimensions
     * @param prevProps
     */

  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps) {
      var previouslyExpanded = this.expanded;
      var expanded = this.getExpanded();

      // we changed dimensions
      if (expanded !== previouslyExpanded) {
        if (this.props.onToggle) this.props.onToggle(this.props.path);
      }

      this.expanded = expanded;
    }

    /**
     * react lifecycle method used because it sets up some local variables that aren't included in state and will be
     * needed in future 'componentDidUpdates'
     */

  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.expanded = this.getExpanded();
    }
  }, {
    key: 'handleClick',
    value: function handleClick(path) {
      var expandedPaths = this.props.expandedPaths;

      var expanded = !!expandedPaths[path];

      if (this.props.handleClick) this.props.handleClick(path);

      // We're in a current expanded state and the user just clicked to collapse us
      if (expanded && this.props.handleCollapse) {
        this.props.handleCollapse(path);
      }
      // We're in a current collapsed stated and the user just clicked to expand us
      else if (!expanded && this.props.handleExpand) {
          this.props.handleExpand(path);
        }
    }
  }, {
    key: 'renderChildNodes',
    value: function renderChildNodes(parentData, parentPath) {
      var dataIterator = this.props.dataIterator;
      var depth = this.props.depth;
      var _props2 = this.props,
          nodeRenderer = _props2.nodeRenderer,
          onToggle = _props2.onToggle,
          handleClick = _props2.handleClick,
          handleCollapse = _props2.handleCollapse,
          handleExpand = _props2.handleExpand,
          expandedPaths = _props2.expandedPaths,
          controlledPaths = _props2.controlledPaths,
          extraStuff = _props2.extraStuff,
          shouldComponentUpdate = _props2.shouldComponentUpdate,
          shouldExpand = _props2.shouldExpand,
          filter = _props2.filter;


      var childNodes = [];
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = dataIterator(parentData)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var _ref2 = _step2.value;
          var name = _ref2.name,
              data = _ref2.data,
              props = (0, _objectWithoutProperties3.default)(_ref2, ['name', 'data']);

          if (filter && !filter(name, data, extraStuff)) {
            continue;
          }
          var key = name;
          var path = parentPath + '.' + key;
          childNodes.push(_react2.default.createElement(ConnectedTreeNode, (0, _extends3.default)({
            name: name,
            data: data,
            depth: depth + 1,
            path: path,
            key: key,
            dataIterator: dataIterator,
            nodeRenderer: nodeRenderer,
            expandedPaths: expandedPaths,
            controlledPaths: controlledPaths
            // This should pass down the prop received from the object inspector
            , onToggle: onToggle,
            handleCollapse: handleCollapse,
            handleExpand: handleExpand,
            handleClick: handleClick
            // Because we can't pass down the rest of ...this.props without causing an infinite loop
            , extraStuff: extraStuff,
            shouldExpand: shouldExpand,
            shouldComponentUpdate: shouldComponentUpdate,
            filter: filter

          }, props)) // props for nodeRenderer
          );
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return childNodes;
    }
  }, {
    key: 'render',
    value: function render() {
      var _props3 = this.props,
          data = _props3.data,
          dataIterator = _props3.dataIterator,
          path = _props3.path,
          depth = _props3.depth;


      var nodeHasChildNodes = (0, _pathUtils.hasChildNodes)(data, dataIterator);
      var expanded = this.getExpanded();

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

  nodeRenderer: _propTypes2.default.func,
  shouldExpand: _propTypes2.default.func
};

var TreeView = function (_Component2) {
  (0, _inherits3.default)(TreeView, _Component2);

  function TreeView(props) {
    (0, _classCallCheck3.default)(this, TreeView);

    var _this2 = (0, _possibleConstructorReturn3.default)(this, (TreeView.__proto__ || Object.getPrototypeOf(TreeView)).call(this, props));

    _this2.state = {
      expandedPaths: (0, _pathUtils.getExpandedPaths)(props.data, props.dataIterator, props.expandPaths, props.expandLevel)
    };
    return _this2;
  }

  (0, _createClass3.default)(TreeView, [{
    key: 'render',
    value: function render() {
      var _props4 = this.props,
          name = _props4.name,
          data = _props4.data,
          dataIterator = _props4.dataIterator,
          expandPaths = _props4.expandPaths,
          expandLevel = _props4.expandLevel,
          controlPaths = _props4.controlPaths,
          nodeRenderer = _props4.nodeRenderer,
          handleExpand = _props4.handleExpand,
          handleCollapse = _props4.handleCollapse,
          handleClick = _props4.handleClick,
          onToggle = _props4.onToggle,
          filter = _props4.filter;


      var expandedPaths = (0, _pathUtils.getExpandedPaths)(data, dataIterator, expandPaths, expandLevel);
      var controlledPaths = (0, _pathUtils.getExpandedPaths)(data, dataIterator, controlPaths, 0);

      var rootPath = _pathUtils.DEFAULT_ROOT_PATH;

      return _react2.default.createElement(ConnectedTreeNode, (0, _extends3.default)({
        name: name,
        data: data,
        dataIterator: dataIterator,
        depth: 0,
        path: rootPath,
        expandedPaths: expandedPaths,
        controlledPaths: controlledPaths,
        nodeRenderer: nodeRenderer,
        handleExpand: handleExpand,
        handleCollapse: handleCollapse,
        handleClick: handleClick,
        onToggle: onToggle,
        filter: filter
      }, this.props));
    }
  }]);
  return TreeView;
}(_react.Component);

TreeView.defaultProps = {
  expandLevel: 0,
  expandPaths: []
};


TreeView.propTypes = {
  name: _propTypes2.default.string,
  data: _propTypes2.default.any,
  dataIterator: _propTypes2.default.func,

  nodeRenderer: _propTypes2.default.func,

  handleExpand: _propTypes2.default.func,
  handleCollapse: _propTypes2.default.func,
  onToggle: _propTypes2.default.func
};

TreeView.defaultProps = {
  name: undefined
};

exports.default = TreeView;
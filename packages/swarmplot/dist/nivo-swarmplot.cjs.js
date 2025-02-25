'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@nivo/core');
var colors = require('@nivo/colors');
var axes = require('@nivo/axes');
var voronoi = require('@nivo/voronoi');
var PropTypes = _interopDefault(require('prop-types'));
var scales = require('@nivo/scales');
var annotations = require('@nivo/annotations');
var get = _interopDefault(require('lodash/get'));
var tooltip = require('@nivo/tooltip');
var isString = _interopDefault(require('lodash/isString'));
var isNumber = _interopDefault(require('lodash/isNumber'));
var isPlainObject = _interopDefault(require('lodash/isPlainObject'));
var d3Scale = require('d3-scale');
var d3Force = require('d3-force');
var reactMotion = require('react-motion');

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  groups: PropTypes.arrayOf(PropTypes.string).isRequired,
  groupBy: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  identity: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  valueScale: scales.scalePropType.isRequired,
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.shape({
    key: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.number).isRequired,
    sizes: PropTypes.arrayOf(PropTypes.number).isRequired
  }), PropTypes.func]).isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  gap: PropTypes.number.isRequired,
  forceStrength: PropTypes.number.isRequired,
  simulationIterations: PropTypes.number.isRequired,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['grid', 'axes', 'nodes', 'mesh', 'annotations']), PropTypes.func])).isRequired,
  renderNode: PropTypes.func.isRequired,
  colors: colors.ordinalColorsPropType.isRequired,
  colorBy: colors.colorPropertyAccessorPropType.isRequired,
  borderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
  borderColor: colors.inheritedColorPropType.isRequired,
  enableGridX: PropTypes.bool.isRequired,
  gridXValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  enableGridY: PropTypes.bool.isRequired,
  gridYValues: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  axisTop: axes.axisPropType,
  axisRight: axes.axisPropType,
  axisBottom: axes.axisPropType,
  axisLeft: axes.axisPropType,
  annotations: PropTypes.arrayOf(annotations.annotationSpecPropType).isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  useMesh: PropTypes.bool.isRequired,
  debugMesh: PropTypes.bool.isRequired,
  tooltip: PropTypes.any
};
var SwarmPlotPropTypes = _objectSpread({}, commonPropTypes, {}, core.motionPropTypes);
var SwarmPlotCanvasPropTypes = _objectSpread({
  pixelRatio: PropTypes.number.isRequired
}, commonPropTypes);
var commonDefaultProps = {
  groupBy: 'group',
  identity: 'id',
  label: 'id',
  value: 'value',
  valueScale: {
    type: 'linear',
    min: 0,
    max: 'auto'
  },
  size: 6,
  spacing: 2,
  layout: 'vertical',
  gap: 0,
  forceStrength: 1,
  simulationIterations: 120,
  layers: ['grid', 'axes', 'nodes', 'mesh', 'annotations'],
  colors: {
    scheme: 'nivo'
  },
  colorBy: 'group',
  borderWidth: 0,
  borderColor: 'none',
  enableGridX: true,
  enableGridY: true,
  axisTop: {},
  axisRight: {},
  axisBottom: {},
  axisLeft: {},
  annotations: [],
  isInteractive: true,
  useMesh: false,
  debugMesh: false
};
var SwarmPlotDefaultProps = _objectSpread({}, commonDefaultProps, {
  animate: true,
  motionStiffness: 90,
  motionDamping: 15
});
var SwarmPlotCanvasDefaultProps = _objectSpread({}, commonDefaultProps, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
var getSizeGenerator = function getSizeGenerator(size) {
  if (typeof size === 'function') return size;
  if (isNumber(size)) return function () {
    return size;
  };
  if (isPlainObject(size)) {
    if (!isString(size.key)) {
      throw new Error('Size is invalid, key should be a string pointing to the property to use to determine node size');
    }
    if (!Array.isArray(size.values) || size.values.length !== 2) {
      throw new Error('Size is invalid, values spec should be an array containing two values, min and max');
    }
    if (!Array.isArray(size.sizes) || size.sizes.length !== 2) {
      throw new Error('Size is invalid, sizes spec should be an array containing two values, min and max');
    }
    var sizeScale = d3Scale.scaleLinear().domain([size.values[0], size.values[1]]).range([size.sizes[0], size.sizes[1]]);
    return function (d) {
      return sizeScale(get(d, size.key));
    };
  }
  throw new Error('Size is invalid, it should be either a function, a number or an object');
};
var computeValueScale = function computeValueScale(_ref) {
  var width = _ref.width,
      height = _ref.height,
      axis = _ref.axis,
      getValue = _ref.getValue,
      scale = _ref.scale,
      data = _ref.data;
  var values = data.map(getValue);
  var min = Math.min.apply(Math, _toConsumableArray(values));
  var max = Math.max.apply(Math, _toConsumableArray(values));
  return scales.computeScale(_objectSpread$1({}, scale, {
    axis: axis
  }), _defineProperty$1({}, axis, {
    min: min,
    max: max
  }), width, height);
};
var computeOrdinalScale = function computeOrdinalScale(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      axis = _ref2.axis,
      groups = _ref2.groups,
      gap = _ref2.gap;
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new Error("'groups' should be an array containing at least one item");
  }
  var groupCount = groups.length;
  var groupSize;
  if (axis === 'x') {
    groupSize = (height - gap * (groupCount - 1)) / groupCount;
  } else if (axis === 'y') {
    groupSize = (width - gap * (groupCount - 1)) / groupCount;
  }
  var range = groups.map(function (g, i) {
    return i * (groupSize + gap) + groupSize / 2;
  });
  return d3Scale.scaleOrdinal(range).domain(groups);
};
var computeForces = function computeForces(_ref3) {
  var axis = _ref3.axis,
      valueScale = _ref3.valueScale,
      ordinalScale = _ref3.ordinalScale,
      spacing = _ref3.spacing,
      forceStrength = _ref3.forceStrength;
  var collisionForce = d3Force.forceCollide(function (d) {
    return d.size / 2 + spacing / 2;
  });
  var xForce;
  var yForce;
  if (axis === 'x') {
    xForce = d3Force.forceX(function (d) {
      return valueScale(d.value);
    }).strength(forceStrength);
    yForce = d3Force.forceY(function (d) {
      return ordinalScale(d.group);
    });
  } else if (axis === 'y') {
    xForce = d3Force.forceX(function (d) {
      return ordinalScale(d.group);
    });
    yForce = d3Force.forceY(function (d) {
      return valueScale(d.value);
    }).strength(forceStrength);
  }
  return {
    x: xForce,
    y: yForce,
    collision: collisionForce
  };
};
var computeNodes = function computeNodes(_ref4) {
  var _ref5;
  var data = _ref4.data,
      getIdentity = _ref4.getIdentity,
      layout = _ref4.layout,
      getValue = _ref4.getValue,
      valueScale = _ref4.valueScale,
      getGroup = _ref4.getGroup,
      ordinalScale = _ref4.ordinalScale,
      getSize = _ref4.getSize,
      forces = _ref4.forces,
      simulationIterations = _ref4.simulationIterations;
  var config = {
    horizontal: ['x', 'y'],
    vertical: ['y', 'x']
  };
  var simulatedNodes = data.map(function (d) {
    return {
      id: getIdentity(d),
      group: getGroup(d),
      value: getValue(d),
      size: getSize(d),
      data: _objectSpread$1({}, d)
    };
  });
  var simulation = d3Force.forceSimulation(simulatedNodes).force('x', forces.x).force('y', forces.y).force('collide', forces.collision).stop();
  simulation.tick(simulationIterations);
  return _ref5 = {}, _defineProperty$1(_ref5, "".concat(config[layout][0], "Scale"), valueScale), _defineProperty$1(_ref5, "".concat(config[layout][1], "Scale"), ordinalScale), _defineProperty$1(_ref5, "nodes", simulation.nodes()), _ref5;
};

var SwarmPlotTooltip = function SwarmPlotTooltip(_ref) {
  var node = _ref.node;
  return React__default.createElement(tooltip.BasicTooltip, {
    id: node.label,
    value: node.formattedValue,
    enableChip: true,
    color: node.color
  });
};
SwarmPlotTooltip.propTypes = {
  node: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    color: PropTypes.string.isRequired
  }).isRequired
};

var useValueScale = function useValueScale(_ref) {
  var width = _ref.width,
      height = _ref.height,
      axis = _ref.axis,
      getValue = _ref.getValue,
      scale = _ref.scale,
      data = _ref.data;
  return React.useMemo(function () {
    return computeValueScale({
      width: width,
      height: height,
      axis: axis,
      getValue: getValue,
      scale: scale,
      data: data
    });
  }, [width, height, axis, getValue, scale, data]);
};
var useOrdinalScale = function useOrdinalScale(_ref2) {
  var width = _ref2.width,
      height = _ref2.height,
      axis = _ref2.axis,
      groups = _ref2.groups,
      gap = _ref2.gap;
  return React.useMemo(function () {
    return computeOrdinalScale({
      width: width,
      height: height,
      axis: axis,
      groups: groups,
      gap: gap
    });
  }, [width, height, axis, groups, gap]);
};
var useForces = function useForces(_ref3) {
  var axis = _ref3.axis,
      valueScale = _ref3.valueScale,
      ordinalScale = _ref3.ordinalScale,
      getSize = _ref3.getSize,
      spacing = _ref3.spacing,
      forceStrength = _ref3.forceStrength;
  return React.useMemo(function () {
    return computeForces({
      axis: axis,
      valueScale: valueScale,
      ordinalScale: ordinalScale,
      getSize: getSize,
      spacing: spacing,
      forceStrength: forceStrength
    });
  }, [axis, valueScale, ordinalScale, getSize, spacing, forceStrength]);
};
var useSize = function useSize(size) {
  return React.useMemo(function () {
    return getSizeGenerator(size);
  }, [size]);
};
var getAccessor = function getAccessor(instruction) {
  if (typeof instruction === 'function') return instruction;
  return function (d) {
    return get(d, instruction);
  };
};
var useSwarmPlot = function useSwarmPlot(_ref4) {
  var width = _ref4.width,
      height = _ref4.height,
      data = _ref4.data,
      identity = _ref4.identity,
      label = _ref4.label,
      groups = _ref4.groups,
      groupBy = _ref4.groupBy,
      value = _ref4.value,
      valueFormat = _ref4.valueFormat,
      valueScaleConfig = _ref4.valueScale,
      size = _ref4.size,
      spacing = _ref4.spacing,
      layout = _ref4.layout,
      gap = _ref4.gap,
      colors$1 = _ref4.colors,
      colorBy = _ref4.colorBy,
      forceStrength = _ref4.forceStrength,
      simulationIterations = _ref4.simulationIterations;
  var axis = layout === 'horizontal' ? 'x' : 'y';
  var getIdentity = React.useMemo(function () {
    return getAccessor(identity);
  }, [identity]);
  var getLabel = React.useMemo(function () {
    return getAccessor(label);
  }, [label]);
  var getValue = React.useMemo(function () {
    return getAccessor(value);
  }, [value]);
  var formatValue = core.useValueFormatter(valueFormat);
  var getGroup = React.useMemo(function () {
    return getAccessor(groupBy);
  }, [groupBy]);
  var getSize = useSize(size);
  var getColor = colors.useOrdinalColorScale(colors$1, colorBy);
  var valueScale = useValueScale({
    width: width,
    height: height,
    axis: axis,
    getValue: getValue,
    scale: valueScaleConfig,
    data: data
  });
  var ordinalScale = useOrdinalScale({
    width: width,
    height: height,
    axis: axis,
    groups: groups,
    gap: gap
  });
  var forces = useForces({
    axis: axis,
    valueScale: valueScale,
    ordinalScale: ordinalScale,
    spacing: spacing,
    forceStrength: forceStrength
  });
  var _useMemo = React.useMemo(function () {
    return computeNodes({
      data: data,
      getIdentity: getIdentity,
      layout: layout,
      getValue: getValue,
      valueScale: valueScale,
      getGroup: getGroup,
      ordinalScale: ordinalScale,
      getSize: getSize,
      forces: forces,
      simulationIterations: simulationIterations
    });
  }, [data, getIdentity, layout, getValue, valueScale, getGroup, ordinalScale, getSize, forces, simulationIterations]),
      nodes = _useMemo.nodes,
      xScale = _useMemo.xScale,
      yScale = _useMemo.yScale;
  var augmentedNodes = React.useMemo(function () {
    return nodes.map(function (node) {
      return {
        id: node.id,
        index: node.index,
        group: node.group,
        label: getLabel(node),
        value: node.value,
        formattedValue: formatValue(node.value),
        x: node.x,
        y: node.y,
        size: node.size,
        color: getColor(node),
        data: node.data
      };
    });
  }, [nodes, getLabel, formatValue, getColor]);
  return {
    nodes: augmentedNodes,
    xScale: xScale,
    yScale: yScale,
    getColor: getColor
  };
};
var useBorderWidth = function useBorderWidth(borderWidth) {
  return React.useMemo(function () {
    if (typeof borderWidth === 'function') return borderWidth;
    return function () {
      return borderWidth;
    };
  }, [borderWidth]);
};
var useNodeMouseHandlers = function useNodeMouseHandlers(_ref5) {
  var isEnabled = _ref5.isEnabled,
      onMouseEnter = _ref5.onMouseEnter,
      onMouseMove = _ref5.onMouseMove,
      onMouseLeave = _ref5.onMouseLeave,
      onClick = _ref5.onClick,
      tooltip$1 = _ref5.tooltip;
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var showNodeTooltip = React.useMemo(function () {
    if (tooltip$1) return function (node, event) {
      return showTooltipFromEvent(tooltip$1({
        node: node
      }), event);
    };
    return function (node, event) {
      return showTooltipFromEvent(React__default.createElement(SwarmPlotTooltip, {
        node: node
      }), event);
    };
  }, [showTooltipFromEvent]);
  var mouseEnterHandler = React.useCallback(function (node, event) {
    if (!isEnabled) return;
    showNodeTooltip(node, event);
    onMouseEnter && onMouseEnter(node, event);
  }, [isEnabled, onMouseEnter]);
  var mouseMoveHandler = React.useCallback(function (node, event) {
    if (!isEnabled) return;
    showNodeTooltip(node, event);
    onMouseMove && onMouseMove(node, event);
  }, [isEnabled, onMouseMove]);
  var mouseLeaveHandler = React.useCallback(function (node, event) {
    if (!isEnabled) return;
    hideTooltip();
    onMouseLeave && onMouseLeave(node, event);
  }, [isEnabled, onMouseLeave], hideTooltip);
  var clickHandler = React.useCallback(function (node, event) {
    isEnabled && onClick && onClick(node, event);
  }, [isEnabled, onClick]);
  return {
    onMouseEnter: mouseEnterHandler,
    onMouseMove: mouseMoveHandler,
    onMouseLeave: mouseLeaveHandler,
    onClick: clickHandler
  };
};
var useSwarmPlotAnnotations = function useSwarmPlotAnnotations(items, annotations$1) {
  return annotations.useAnnotations({
    items: items,
    annotations: annotations$1,
    getDimensions: function getDimensions(node, offset) {
      var size = node.size + offset * 2;
      return {
        size: size,
        width: size,
        height: size
      };
    }
  });
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var willEnter = function willEnter(_ref) {
  var style = _ref.style;
  return {
    x: style.x.val,
    y: style.y.val,
    size: style.size.val,
    colorR: style.colorR.val,
    colorG: style.colorG.val,
    colorB: style.colorB.val,
    scale: 0
  };
};
var willLeave = function willLeave(springConfig) {
  return function (_ref2) {
    var style = _ref2.style;
    return {
      x: style.x,
      y: style.y,
      size: style.size,
      colorR: style.colorR,
      colorG: style.colorG,
      colorB: style.colorB,
      scale: reactMotion.spring(0, springConfig)
    };
  };
};
var AnimatedSwarmPlotNodes = React.memo(function (_ref3) {
  var nodes = _ref3.nodes,
      renderNode = _ref3.renderNode,
      getBorderWidth = _ref3.getBorderWidth,
      getBorderColor = _ref3.getBorderColor,
      motionStiffness = _ref3.motionStiffness,
      motionDamping = _ref3.motionDamping,
      isInteractive = _ref3.isInteractive,
      onMouseEnter = _ref3.onMouseEnter,
      onMouseMove = _ref3.onMouseMove,
      onMouseLeave = _ref3.onMouseLeave,
      onClick = _ref3.onClick;
  var springConfig = {
    stiffness: motionStiffness,
    damping: motionDamping
  };
  return React__default.createElement(reactMotion.TransitionMotion, {
    willEnter: willEnter,
    willLeave: willLeave(springConfig),
    styles: nodes.map(function (node) {
      return {
        key: node.id,
        data: node,
        style: _objectSpread$2({
          x: reactMotion.spring(node.x, springConfig),
          y: reactMotion.spring(node.y, springConfig),
          size: reactMotion.spring(node.size, springConfig)
        }, colors.interpolateColor(node.color, springConfig), {
          scale: reactMotion.spring(1, springConfig)
        })
      };
    })
  }, function (interpolatedStyles) {
    return React__default.createElement(React__default.Fragment, null, interpolatedStyles.map(function (_ref4) {
      var key = _ref4.key,
          style = _ref4.style,
          node = _ref4.data;
      var color = colors.getInterpolatedColor(style);
      return React__default.createElement(React.Fragment, {
        key: key
      }, renderNode({
        node: node,
        x: style.x,
        y: style.y,
        size: style.size,
        scale: style.scale,
        color: color,
        borderWidth: getBorderWidth(node),
        borderColor: getBorderColor(node),
        isInteractive: isInteractive,
        onMouseEnter: onMouseEnter,
        onMouseMove: onMouseMove,
        onMouseLeave: onMouseLeave,
        onClick: onClick
      }));
    }));
  });
});
AnimatedSwarmPlotNodes.displayName = 'AnimatedSwarmPlotNodes';
AnimatedSwarmPlotNodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  renderNode: PropTypes.func.isRequired,
  getBorderWidth: PropTypes.func.isRequired,
  getBorderColor: PropTypes.func.isRequired,
  motionStiffness: PropTypes.number.isRequired,
  motionDamping: PropTypes.number.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func
};

var StaticSwarmPlotNodes = React.memo(function (_ref) {
  var nodes = _ref.nodes,
      renderNode = _ref.renderNode,
      getBorderWidth = _ref.getBorderWidth,
      getBorderColor = _ref.getBorderColor,
      isInteractive = _ref.isInteractive,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick;
  return nodes.map(function (node) {
    return React__default.createElement(React.Fragment, {
      key: node.id
    }, renderNode({
      node: node,
      x: node.x,
      y: node.y,
      size: node.size,
      color: node.color,
      borderWidth: getBorderWidth(node),
      borderColor: getBorderColor(node),
      isInteractive: isInteractive,
      onMouseEnter: onMouseEnter,
      onMouseMove: onMouseMove,
      onMouseLeave: onMouseLeave,
      onClick: onClick
    }));
  });
});
StaticSwarmPlotNodes.displayName = 'StaticSwarmPlotNodes';
StaticSwarmPlotNodes.propTypes = {
  nodes: PropTypes.array.isRequired,
  renderNode: PropTypes.func.isRequired,
  getBorderWidth: PropTypes.func.isRequired,
  getBorderColor: PropTypes.func.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func
};

var SwarmPlotNode = React.memo(function (_ref) {
  var node = _ref.node,
      x = _ref.x,
      y = _ref.y,
      size = _ref.size,
      scale = _ref.scale,
      color = _ref.color,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick;
  var handleMouseEnter = React.useCallback(function (event) {
    return onMouseEnter && onMouseEnter(node, event);
  }, [node, onMouseEnter]);
  var handleMouseMove = React.useCallback(function (event) {
    return onMouseMove && onMouseEnter(node, event);
  }, [node, onMouseMove]);
  var handleMouseLeave = React.useCallback(function (event) {
    return onMouseLeave && onMouseLeave(node, event);
  }, [node, onMouseLeave]);
  var handleClick = React.useCallback(function (event) {
    return onClick && onClick(node, event);
  }, [node, onClick]);
  return React__default.createElement("circle", {
    transform: "translate(".concat(x, ",").concat(y, ") scale(").concat(scale, ")"),
    r: size / 2,
    fill: color,
    strokeWidth: borderWidth,
    stroke: borderColor,
    onMouseEnter: handleMouseEnter,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick
  });
});
SwarmPlotNode.displayName = 'SwarmPlotNode';
SwarmPlotNode.propTypes = {
  node: PropTypes.object.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  size: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  color: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func,
  onMouseMove: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func
};
SwarmPlotNode.defaultProps = {
  scale: 1
};

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var SwarmPlotAnnotations = function SwarmPlotAnnotations(_ref) {
  var nodes = _ref.nodes,
      annotations$1 = _ref.annotations,
      innerWidth = _ref.innerWidth,
      innerHeight = _ref.innerHeight;
  var boundAnnotations = useSwarmPlotAnnotations(nodes, annotations$1);
  return boundAnnotations.map(function (annotation, i) {
    return React__default.createElement(annotations.Annotation, _extends({
      key: i
    }, annotation, {
      containerWidth: innerWidth,
      containerHeight: innerHeight
    }));
  });
};
SwarmPlotAnnotations.propTypes = {};

function ownKeys$3(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$3(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$3(source, true).forEach(function (key) { _defineProperty$3(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$3(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$3(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var SwarmPlot = React.memo(function (_ref) {
  var width = _ref.width,
      height = _ref.height,
      partialMargin = _ref.margin,
      data = _ref.data,
      groups = _ref.groups,
      groupBy = _ref.groupBy,
      identity = _ref.identity,
      label = _ref.label,
      value = _ref.value,
      valueFormat = _ref.valueFormat,
      valueScale = _ref.valueScale,
      size = _ref.size,
      spacing = _ref.spacing,
      layout = _ref.layout,
      gap = _ref.gap,
      forceStrength = _ref.forceStrength,
      simulationIterations = _ref.simulationIterations,
      layers = _ref.layers,
      renderNode = _ref.renderNode,
      colors$1 = _ref.colors,
      colorBy = _ref.colorBy,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      enableGridX = _ref.enableGridX,
      gridXValues = _ref.gridXValues,
      enableGridY = _ref.enableGridY,
      gridYValues = _ref.gridYValues,
      axisTop = _ref.axisTop,
      axisRight = _ref.axisRight,
      axisBottom = _ref.axisBottom,
      axisLeft = _ref.axisLeft,
      annotations = _ref.annotations,
      isInteractive = _ref.isInteractive,
      useMesh = _ref.useMesh,
      debugMesh = _ref.debugMesh,
      onMouseEnter = _ref.onMouseEnter,
      onMouseMove = _ref.onMouseMove,
      onMouseLeave = _ref.onMouseLeave,
      onClick = _ref.onClick,
      tooltip = _ref.tooltip,
      animate = _ref.animate,
      motionStiffness = _ref.motionStiffness,
      motionDamping = _ref.motionDamping;
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var theme = core.useTheme();
  var _useSwarmPlot = useSwarmPlot({
    width: innerWidth,
    height: innerHeight,
    data: data,
    groups: groups,
    groupBy: groupBy,
    identity: identity,
    label: label,
    value: value,
    valueFormat: valueFormat,
    valueScale: valueScale,
    size: size,
    spacing: spacing,
    layout: layout,
    gap: gap,
    colors: colors$1,
    colorBy: colorBy,
    forceStrength: forceStrength,
    simulationIterations: simulationIterations
  }),
      nodes = _useSwarmPlot.nodes,
      xScale = _useSwarmPlot.xScale,
      yScale = _useSwarmPlot.yScale;
  var getBorderWidth = useBorderWidth(borderWidth);
  var getBorderColor = colors.useInheritedColor(borderColor, theme);
  var layerById = {
    grid: React__default.createElement(axes.Grid, {
      key: "grid",
      width: innerWidth,
      height: innerHeight,
      xScale: enableGridX ? xScale : null,
      xValues: gridXValues,
      yScale: enableGridY ? yScale : null,
      yValues: gridYValues
    }),
    axes: React__default.createElement(axes.Axes, {
      key: "axes",
      xScale: xScale,
      yScale: yScale,
      width: innerWidth,
      height: innerHeight,
      top: axisTop,
      right: axisRight,
      bottom: axisBottom,
      left: axisLeft
    }),
    mesh: null,
    annotations: React__default.createElement(SwarmPlotAnnotations, {
      key: "annotations",
      nodes: nodes,
      annotations: annotations,
      innerWidth: innerWidth,
      innerHeight: innerHeight,
      animate: animate,
      motionStiffness: motionStiffness,
      motionDamping: motionDamping
    })
  };
  var enableNodeInteractivity = isInteractive && !useMesh;
  var handlers = useNodeMouseHandlers({
    isEnabled: isInteractive,
    onMouseEnter: onMouseEnter,
    onMouseMove: onMouseMove,
    onMouseLeave: onMouseLeave,
    onClick: onClick,
    tooltip: tooltip
  });
  if (animate) {
    layerById.nodes = React__default.createElement(AnimatedSwarmPlotNodes, {
      key: "nodes",
      nodes: nodes,
      renderNode: renderNode,
      getBorderWidth: getBorderWidth,
      getBorderColor: getBorderColor,
      motionStiffness: motionStiffness,
      motionDamping: motionDamping,
      isInteractive: enableNodeInteractivity,
      onMouseEnter: !useMesh ? handlers.onMouseEnter : undefined,
      onMouseMove: !useMesh ? handlers.onMouseMove : undefined,
      onMouseLeave: !useMesh ? handlers.onMouseLeave : undefined,
      onClick: !useMesh ? handlers.onClick : undefined
    });
  } else {
    layerById.nodes = React__default.createElement(StaticSwarmPlotNodes, {
      key: "nodes",
      nodes: nodes,
      renderNode: renderNode,
      getBorderWidth: getBorderWidth,
      getBorderColor: getBorderColor,
      isInteractive: enableNodeInteractivity,
      onMouseEnter: !useMesh ? handlers.onMouseEnter : undefined,
      onMouseMove: !useMesh ? handlers.onMouseMove : undefined,
      onMouseLeave: !useMesh ? handlers.onMouseLeave : undefined,
      onClick: !useMesh ? handlers.onClick : undefined
    });
  }
  if (isInteractive === true && useMesh === true) {
    layerById.mesh = React__default.createElement(voronoi.Mesh, {
      key: "mesh",
      nodes: nodes,
      width: innerWidth,
      height: innerHeight,
      onMouseEnter: handlers.onMouseEnter,
      onMouseMove: handlers.onMouseMove,
      onMouseLeave: handlers.onMouseLeave,
      onClick: handlers.onClick,
      debug: debugMesh
    });
  }
  var layerContext = {
    nodes: nodes,
    xScale: xScale,
    yScale: yScale,
    innerWidth: innerWidth,
    innerHeight: innerHeight,
    outerWidth: outerWidth,
    outerHeight: outerHeight,
    margin: margin,
    getBorderColor: getBorderColor,
    getBorderWidth: getBorderWidth,
    animate: animate,
    motionStiffness: motionStiffness,
    motionDamping: motionDamping
  };
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme
  }, layers.map(function (layer, i) {
    if (layerById[layer] !== undefined) {
      return layerById[layer];
    }
    if (typeof layer === 'function') {
      return React__default.createElement(React.Fragment, {
        key: i
      }, layer(layerContext));
    }
    return null;
  }));
});
SwarmPlot.displayName = 'SwarmPlot';
SwarmPlot.propTypes = SwarmPlotPropTypes;
SwarmPlot.defaultProps = _objectSpread$3({}, SwarmPlotDefaultProps, {
  renderNode: function renderNode(props) {
    return React__default.createElement(SwarmPlotNode, props);
  }
});
var SwarmPlot$1 = core.withContainer(SwarmPlot);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var ResponsiveSwarmPlot = function ResponsiveSwarmPlot(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(SwarmPlot$1, _extends$1({
      width: width,
      height: height
    }, props));
  });
};

function ownKeys$4(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$4(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$4(source, true).forEach(function (key) { _defineProperty$4(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$4(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$4(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var renderCanvasNode = function renderCanvasNode(ctx, _ref) {
  var node = _ref.node,
      getBorderWidth = _ref.getBorderWidth,
      getBorderColor = _ref.getBorderColor;
  var nodeBorderWidth = getBorderWidth(node);
  if (nodeBorderWidth > 0) {
    ctx.strokeStyle = getBorderColor(node);
    ctx.lineWidth = nodeBorderWidth;
  }
  ctx.beginPath();
  ctx.arc(node.x, node.y, node.size / 2, 0, 2 * Math.PI);
  ctx.fillStyle = node.color;
  ctx.fill();
  if (nodeBorderWidth > 0) {
    ctx.stroke();
  }
};
var SwarmPlotCanvas = React.memo(function (_ref2) {
  var pixelRatio = _ref2.pixelRatio,
      width = _ref2.width,
      height = _ref2.height,
      partialMargin = _ref2.margin,
      data = _ref2.data,
      groups = _ref2.groups,
      groupBy = _ref2.groupBy,
      identity = _ref2.identity,
      label = _ref2.label,
      value = _ref2.value,
      valueFormat = _ref2.valueFormat,
      valueScale = _ref2.valueScale,
      size = _ref2.size,
      spacing = _ref2.spacing,
      layout = _ref2.layout,
      gap = _ref2.gap,
      forceStrength = _ref2.forceStrength,
      simulationIterations = _ref2.simulationIterations,
      layers = _ref2.layers,
      renderNode = _ref2.renderNode,
      colors$1 = _ref2.colors,
      colorBy = _ref2.colorBy,
      borderWidth = _ref2.borderWidth,
      borderColor = _ref2.borderColor,
      enableGridX = _ref2.enableGridX,
      gridXValues = _ref2.gridXValues,
      enableGridY = _ref2.enableGridY,
      gridYValues = _ref2.gridYValues,
      axisTop = _ref2.axisTop,
      axisRight = _ref2.axisRight,
      axisBottom = _ref2.axisBottom,
      axisLeft = _ref2.axisLeft,
      annotations$1 = _ref2.annotations,
      isInteractive = _ref2.isInteractive,
      onMouseEnter = _ref2.onMouseEnter,
      onMouseMove = _ref2.onMouseMove,
      onMouseLeave = _ref2.onMouseLeave,
      onClick = _ref2.onClick,
      tooltip$1 = _ref2.tooltip,
      debugMesh = _ref2.debugMesh;
  var canvasEl = React.useRef(null);
  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentNode = _useState2[0],
      setCurrentNode = _useState2[1];
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      innerWidth = _useDimensions.innerWidth,
      innerHeight = _useDimensions.innerHeight,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var theme = core.useTheme();
  var _useSwarmPlot = useSwarmPlot({
    width: innerWidth,
    height: innerHeight,
    data: data,
    groups: groups,
    groupBy: groupBy,
    identity: identity,
    label: label,
    value: value,
    valueFormat: valueFormat,
    valueScale: valueScale,
    size: size,
    spacing: spacing,
    layout: layout,
    gap: gap,
    colors: colors$1,
    colorBy: colorBy,
    forceStrength: forceStrength,
    simulationIterations: simulationIterations
  }),
      nodes = _useSwarmPlot.nodes,
      xScale = _useSwarmPlot.xScale,
      yScale = _useSwarmPlot.yScale;
  var boundAnnotations = useSwarmPlotAnnotations(nodes, annotations$1);
  var computedAnnotations = annotations.useComputedAnnotations({
    annotations: boundAnnotations,
    innerWidth: innerWidth,
    innerHeight: innerHeight
  });
  var getBorderWidth = useBorderWidth(borderWidth);
  var getBorderColor = colors.useInheritedColor(borderColor, theme);
  var _useVoronoiMesh = voronoi.useVoronoiMesh({
    points: nodes,
    width: innerWidth,
    height: innerHeight,
    debug: debugMesh
  }),
      delaunay = _useVoronoiMesh.delaunay,
      voronoi$1 = _useVoronoiMesh.voronoi;
  React.useEffect(function () {
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    layers.forEach(function (layer) {
      if (layer === 'grid' && theme.grid.line.strokeWidth > 0) {
        ctx.lineWidth = theme.grid.line.strokeWidth;
        ctx.strokeStyle = theme.grid.line.stroke;
        enableGridX && axes.renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: xScale,
          axis: 'x',
          values: gridXValues
        });
        enableGridY && axes.renderGridLinesToCanvas(ctx, {
          width: innerWidth,
          height: innerHeight,
          scale: yScale,
          axis: 'y',
          values: gridYValues
        });
      }
      if (layer === 'axes') {
        axes.renderAxesToCanvas(ctx, {
          xScale: xScale,
          yScale: yScale,
          width: innerWidth,
          height: innerHeight,
          top: axisTop,
          right: axisRight,
          bottom: axisBottom,
          left: axisLeft,
          theme: theme
        });
      }
      if (layer === 'nodes') {
        nodes.forEach(function (node) {
          renderNode(ctx, {
            node: node,
            getBorderWidth: getBorderWidth,
            getBorderColor: getBorderColor
          });
        });
      }
      if (layer === 'mesh' && debugMesh === true) {
        voronoi.renderVoronoiToCanvas(ctx, voronoi$1);
        if (currentNode) {
          voronoi.renderVoronoiCellToCanvas(ctx, voronoi$1, currentNode.index);
        }
      }
      if (layer === 'annotations') {
        annotations.renderAnnotationsToCanvas(ctx, {
          annotations: computedAnnotations,
          theme: theme
        });
      }
      if (typeof layer === 'function') {
        layer(ctx, {
          nodes: nodes,
          innerWidth: innerWidth,
          innerHeight: innerHeight,
          outerWidth: outerWidth,
          outerHeight: outerHeight,
          margin: margin,
          xScale: xScale,
          yScale: yScale
        });
      }
    });
  }, [canvasEl, innerWidth, innerHeight, outerWidth, outerHeight, margin, pixelRatio, theme, layers, nodes, xScale, yScale, getBorderWidth, getBorderColor, voronoi$1, currentNode, computedAnnotations]);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var showNodeTooltip = React.useMemo(function () {
    if (tooltip$1) return function (node, event) {
      return showTooltipFromEvent(tooltip$1({
        node: node
      }), event);
    };
    return function (node, event) {
      return showTooltipFromEvent(React__default.createElement(SwarmPlotTooltip, {
        node: node
      }), event);
    };
  }, [showTooltipFromEvent, tooltip$1]);
  var getNodeFromMouseEvent = React.useCallback(function (event) {
    var _getRelativeCursor = core.getRelativeCursor(canvasEl.current, event),
        _getRelativeCursor2 = _slicedToArray(_getRelativeCursor, 2),
        x = _getRelativeCursor2[0],
        y = _getRelativeCursor2[1];
    if (!core.isCursorInRect(margin.left, margin.top, innerWidth, innerHeight, x, y)) return null;
    var nodeIndex = delaunay.find(x - margin.left, y - margin.top);
    return nodes[nodeIndex];
  }, [canvasEl, margin, innerWidth, innerHeight, delaunay]);
  var handleMouseHover = React.useCallback(function (event) {
    var node = getNodeFromMouseEvent(event);
    setCurrentNode(node);
    onMouseMove && onMouseMove(node, event);
    if (node) {
      showNodeTooltip(node, event);
      if ((!currentNode || currentNode.id !== node.id) && onMouseEnter) {
        onMouseEnter(node, event);
      }
      if (currentNode && currentNode.id !== node.id && onMouseLeave) {
        onMouseLeave(currentNode, event);
      }
    } else {
      currentNode && onMouseLeave && onMouseLeave(currentNode, event);
      hideTooltip();
    }
  }, [getNodeFromMouseEvent, currentNode, onMouseEnter, onMouseLeave, showNodeTooltip, hideTooltip]);
  var handleMouseLeave = React.useCallback(function (event) {
    hideTooltip();
    setCurrentNode(null);
    onMouseLeave && onMouseLeave(currentNode, event);
  }, [hideTooltip, setCurrentNode, currentNode, onMouseLeave]);
  var handleClick = React.useCallback(function (event) {
    var node = getNodeFromMouseEvent(event);
    node && onClick && onClick(node, event);
  }, [getNodeFromMouseEvent, onClick]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight,
      cursor: isInteractive ? 'auto' : 'normal'
    },
    onMouseEnter: isInteractive ? handleMouseHover : undefined,
    onMouseMove: isInteractive ? handleMouseHover : undefined,
    onMouseLeave: isInteractive ? handleMouseLeave : undefined,
    onClick: isInteractive ? handleClick : undefined
  });
});
SwarmPlotCanvas.displayName = 'SwarmPlotCanvas';
SwarmPlotCanvas.propTypes = SwarmPlotCanvasPropTypes;
SwarmPlotCanvas.defaultProps = _objectSpread$4({}, SwarmPlotCanvasDefaultProps, {
  renderNode: renderCanvasNode
});
var SwarmPlotCanvas$1 = core.withContainer(SwarmPlotCanvas);

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var ResponsiveSwarmPlotCanvas = function ResponsiveSwarmPlotCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(SwarmPlotCanvas$1, _extends$2({
      width: width,
      height: height
    }, props));
  });
};

exports.ResponsiveSwarmPlot = ResponsiveSwarmPlot;
exports.ResponsiveSwarmPlotCanvas = ResponsiveSwarmPlotCanvas;
exports.SwarmPlot = SwarmPlot$1;
exports.SwarmPlotCanvas = SwarmPlotCanvas$1;
exports.SwarmPlotCanvasDefaultProps = SwarmPlotCanvasDefaultProps;
exports.SwarmPlotCanvasPropTypes = SwarmPlotCanvasPropTypes;
exports.SwarmPlotDefaultProps = SwarmPlotDefaultProps;
exports.SwarmPlotPropTypes = SwarmPlotPropTypes;
exports.SwarmPlotTooltip = SwarmPlotTooltip;
exports.computeForces = computeForces;
exports.computeNodes = computeNodes;
exports.computeOrdinalScale = computeOrdinalScale;
exports.computeValueScale = computeValueScale;
exports.getSizeGenerator = getSizeGenerator;
exports.useBorderWidth = useBorderWidth;
exports.useForces = useForces;
exports.useNodeMouseHandlers = useNodeMouseHandlers;
exports.useOrdinalScale = useOrdinalScale;
exports.useSwarmPlot = useSwarmPlot;
exports.useSwarmPlotAnnotations = useSwarmPlotAnnotations;
exports.useValueScale = useValueScale;

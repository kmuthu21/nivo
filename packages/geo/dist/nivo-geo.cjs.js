'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var core = require('@nivo/core');
var tooltip = require('@nivo/tooltip');
var PropTypes = _interopDefault(require('prop-types'));
var colors = require('@nivo/colors');
var _get = _interopDefault(require('lodash/get'));
var _isFunction = _interopDefault(require('lodash/isFunction'));
var d3Format = require('d3-format');
var d3Geo = require('d3-geo');
var legends = require('@nivo/legends');

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var projectionById = {
  azimuthalEqualArea: d3Geo.geoAzimuthalEqualArea,
  azimuthalEquidistant: d3Geo.geoAzimuthalEquidistant,
  gnomonic: d3Geo.geoGnomonic,
  orthographic: d3Geo.geoOrthographic,
  stereographic: d3Geo.geoStereographic,
  equalEarth: d3Geo.geoEqualEarth,
  equirectangular: d3Geo.geoEquirectangular,
  mercator: d3Geo.geoMercator,
  transverseMercator: d3Geo.geoTransverseMercator,
  naturalEarth1: d3Geo.geoNaturalEarth1
};
var useGeoMap = function useGeoMap(_ref) {
  var width = _ref.width,
      height = _ref.height,
      projectionType = _ref.projectionType,
      projectionScale = _ref.projectionScale,
      projectionTranslation = _ref.projectionTranslation,
      projectionRotation = _ref.projectionRotation,
      fillColor = _ref.fillColor,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor;
  var projection = React.useMemo(function () {
    return projectionById[projectionType]().scale(projectionScale).translate([width * projectionTranslation[0], height * projectionTranslation[1]]).rotate(projectionRotation);
  }, [width, height, projectionType, projectionScale, projectionTranslation[0], projectionTranslation[1], projectionRotation[0], projectionRotation[1], projectionRotation[2]]);
  var path = React.useMemo(function () {
    return d3Geo.geoPath(projection);
  }, [projection]);
  var graticule = React.useMemo(function () {
    return d3Geo.geoGraticule();
  });
  var theme = core.useTheme();
  var getBorderWidth = React.useMemo(function () {
    return typeof borderWidth === 'function' ? borderWidth : function () {
      return borderWidth;
    };
  }, [borderWidth]);
  var getBorderColor = colors.useInheritedColor(borderColor, theme);
  var getFillColor = React.useMemo(function () {
    return typeof fillColor === 'function' ? fillColor : function () {
      return fillColor;
    };
  }, [fillColor]);
  return {
    projection: projection,
    path: path,
    graticule: graticule,
    getBorderWidth: getBorderWidth,
    getBorderColor: getBorderColor,
    getFillColor: getFillColor
  };
};
var useChoropleth = function useChoropleth(_ref2) {
  var features = _ref2.features,
      data = _ref2.data,
      match = _ref2.match,
      label = _ref2.label,
      value = _ref2.value,
      valueFormat = _ref2.valueFormat,
      colors = _ref2.colors,
      unknownColor = _ref2.unknownColor,
      domain = _ref2.domain;
  var findMatchingDatum = React.useMemo(function () {
    if (_isFunction(match)) return match;
    return function (feature, datum) {
      var featureKey = _get(feature, match);
      var datumKey = _get(datum, match);
      return featureKey && featureKey === datumKey;
    };
  }, [match]);
  var getLabel = React.useMemo(function () {
    return _isFunction(label) ? label : function (datum) {
      return _get(datum, label);
    };
  }, [label]);
  var getValue = React.useMemo(function () {
    return _isFunction(value) ? value : function (datum) {
      return _get(datum, value);
    };
  }, [value]);
  var valueFormatter = React.useMemo(function () {
    if (valueFormat === undefined) return function (d) {
      return d;
    };
    if (_isFunction(valueFormat)) return valueFormat;
    return d3Format.format(valueFormat);
  }, [valueFormat]);
  var colorScale = React.useMemo(function () {
    return core.guessQuantizeColorScale(colors).domain(domain);
  }, [colors]);
  var getFillColor = React.useMemo(function () {
    return function (feature) {
      if (feature.value === undefined) return unknownColor;
      return colorScale(feature.value);
    };
  }, [colorScale, unknownColor]);
  var boundFeatures = React.useMemo(function () {
    return features.map(function (feature) {
      var datum = data.find(function (datum) {
        return findMatchingDatum(feature, datum);
      });
      var datumValue = getValue(datum);
      if (datum) {
        var featureWithData = _objectSpread({}, feature, {
          data: datum,
          value: datumValue,
          formattedValue: valueFormatter(datumValue)
        });
        featureWithData.color = getFillColor(featureWithData);
        featureWithData.label = getLabel(featureWithData);
        return featureWithData;
      }
      return feature;
    });
  }, [features, data, findMatchingDatum, getValue, valueFormatter, getFillColor]);
  var legendData = legends.useQuantizeColorScaleLegendData({
    scale: colorScale,
    valueFormat: valueFormatter
  });
  return {
    colorScale: colorScale,
    getFillColor: getFillColor,
    boundFeatures: boundFeatures,
    valueFormatter: valueFormatter,
    legendData: legendData
  };
};

var ChoroplethTooltip = React.memo(function (_ref) {
  var feature = _ref.feature;
  if (feature.data === undefined) return null;
  return React__default.createElement(tooltip.BasicTooltip, {
    id: feature.label,
    color: feature.color,
    enableChip: true,
    value: feature.formattedValue
  });
});
ChoroplethTooltip.propTypes = {
  feature: PropTypes.object.isRequired
};
ChoroplethTooltip.displayName = 'ChoroplethTooltip';

function ownKeys$1(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$1(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$1(source, true).forEach(function (key) { _defineProperty$1(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$1(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$1(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
var commonPropTypes = {
  features: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Feature']).isRequired,
    properties: PropTypes.object,
    geometry: PropTypes.object.isRequired
  })).isRequired,
  projectionType: PropTypes.oneOf(Object.keys(projectionById)).isRequired,
  projectionScale: PropTypes.number.isRequired,
  projectionTranslation: PropTypes.arrayOf(PropTypes.number).isRequired,
  projectionRotation: PropTypes.arrayOf(PropTypes.number).isRequired,
  fillColor: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  borderWidth: PropTypes.oneOfType([PropTypes.number, PropTypes.func]).isRequired,
  borderColor: colors.inheritedColorPropType.isRequired,
  enableGraticule: PropTypes.bool.isRequired,
  graticuleLineWidth: PropTypes.number.isRequired,
  graticuleLineColor: PropTypes.string.isRequired,
  isInteractive: PropTypes.bool.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.any,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['graticule', 'features']), PropTypes.func])).isRequired
};
var GeoMapPropTypes = _objectSpread$1({}, commonPropTypes);
var GeoMapCanvasPropTypes = _objectSpread$1({
  pixelRatio: PropTypes.number.isRequired
}, commonPropTypes);
var commonChoroplethPropTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  match: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  valueFormat: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  colors: core.quantizeColorScalePropType.isRequired,
  domain: PropTypes.arrayOf(PropTypes.number).isRequired,
  unknownColor: PropTypes.string.isRequired,
  layers: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.oneOf(['graticule', 'features', 'legends']), PropTypes.func])).isRequired
};
var ChoroplethPropTypes = _objectSpread$1({}, GeoMapPropTypes, {}, commonChoroplethPropTypes);
var ChoroplethCanvasPropTypes = _objectSpread$1({}, GeoMapCanvasPropTypes, {}, commonChoroplethPropTypes);
var commonDefaultProps = {
  projectionType: 'mercator',
  projectionScale: 100,
  projectionTranslation: [0.5, 0.5],
  projectionRotation: [0, 0, 0],
  enableGraticule: false,
  graticuleLineWidth: 0.5,
  graticuleLineColor: '#999999',
  fillColor: '#dddddd',
  borderWidth: 0,
  borderColor: '#000000',
  isInteractive: true,
  onMouseEnter: function onMouseEnter() {},
  onMouseLeave: function onMouseLeave() {},
  onMouseMove: function onMouseMove() {},
  onClick: function onClick() {},
  layers: ['graticule', 'features'],
  legends: []
};
var GeoMapDefaultProps = _objectSpread$1({}, commonDefaultProps);
var GeoMapCanvasDefaultProps = _objectSpread$1({}, commonDefaultProps, {
  pixelRatio: global.window && global.window.devicePixelRatio ? global.window.devicePixelRatio : 1
});
var commonChoroplethDefaultProps = {
  match: 'id',
  label: 'id',
  value: 'value',
  colors: 'PuBuGn',
  unknownColor: '#999',
  tooltip: ChoroplethTooltip,
  layers: ['graticule', 'features', 'legends']
};
var ChoroplethDefaultProps = _objectSpread$1({}, GeoMapDefaultProps, {}, commonChoroplethDefaultProps);
var ChoroplethCanvasDefaultProps = _objectSpread$1({}, GeoMapCanvasDefaultProps, {}, commonChoroplethDefaultProps);

var GeoGraticule = React.memo(function (_ref) {
  var path = _ref.path,
      graticule = _ref.graticule,
      lineWidth = _ref.lineWidth,
      lineColor = _ref.lineColor;
  return React__default.createElement("path", {
    fill: "none",
    strokeWidth: lineWidth,
    stroke: lineColor,
    d: path(graticule())
  });
});
GeoGraticule.propTypes = {
  path: PropTypes.func.isRequired,
  graticule: PropTypes.func.isRequired,
  lineWidth: PropTypes.number.isRequired,
  lineColor: PropTypes.string.isRequired
};
GeoGraticule.displayName = 'GeoGraticule';

var GeoMapFeature = React.memo(function (_ref) {
  var feature = _ref.feature,
      path = _ref.path,
      fillColor = _ref.fillColor,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      _onClick = _ref.onClick,
      _onMouseEnter = _ref.onMouseEnter,
      _onMouseMove = _ref.onMouseMove,
      _onMouseLeave = _ref.onMouseLeave;
  return React__default.createElement("path", {
    key: feature.id,
    fill: fillColor,
    strokeWidth: borderWidth,
    stroke: borderColor,
    strokeLinejoin: "bevel",
    d: path(feature),
    onMouseEnter: function onMouseEnter(event) {
      return _onMouseEnter(feature, event);
    },
    onMouseMove: function onMouseMove(event) {
      return _onMouseMove(feature, event);
    },
    onMouseLeave: function onMouseLeave(event) {
      return _onMouseLeave(feature, event);
    },
    onClick: function onClick(event) {
      return _onClick(feature, event);
    }
  });
});
GeoMapFeature.propTypes = {
  feature: PropTypes.shape({
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Feature']).isRequired,
    properties: PropTypes.object,
    geometry: PropTypes.object.isRequired
  }).isRequired,
  path: PropTypes.func.isRequired,
  fillColor: PropTypes.string.isRequired,
  borderWidth: PropTypes.number.isRequired,
  borderColor: PropTypes.string.isRequired,
  onMouseEnter: PropTypes.func.isRequired,
  onMouseMove: PropTypes.func.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
};
GeoMapFeature.displayName = 'GeoMapFeature';

var GeoMap = React.memo(function (props) {
  var width = props.width,
      height = props.height,
      partialMargin = props.margin,
      features = props.features,
      layers = props.layers,
      projectionType = props.projectionType,
      projectionScale = props.projectionScale,
      projectionTranslation = props.projectionTranslation,
      projectionRotation = props.projectionRotation,
      fillColor = props.fillColor,
      borderWidth = props.borderWidth,
      borderColor = props.borderColor,
      enableGraticule = props.enableGraticule,
      graticuleLineWidth = props.graticuleLineWidth,
      graticuleLineColor = props.graticuleLineColor,
      isInteractive = props.isInteractive,
      onClick = props.onClick,
      Tooltip = props.tooltip;
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useGeoMap = useGeoMap({
    width: width,
    height: height,
    projectionType: projectionType,
    projectionScale: projectionScale,
    projectionTranslation: projectionTranslation,
    projectionRotation: projectionRotation,
    fillColor: fillColor,
    borderWidth: borderWidth,
    borderColor: borderColor
  }),
      graticule = _useGeoMap.graticule,
      path = _useGeoMap.path,
      getFillColor = _useGeoMap.getFillColor,
      getBorderWidth = _useGeoMap.getBorderWidth,
      getBorderColor = _useGeoMap.getBorderColor;
  var theme = core.useTheme();
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleClick = React.useCallback(function (feature, event) {
    return isInteractive && onClick && onClick(feature, event);
  }, [isInteractive, onClick]);
  var handleMouseEnter = React.useCallback(function (feature, event) {
    return isInteractive && Tooltip && showTooltipFromEvent(React__default.createElement(Tooltip, {
      feature: feature
    }), event);
  }, [isInteractive, showTooltipFromEvent, Tooltip]);
  var handleMouseMove = React.useCallback(function (feature, event) {
    return isInteractive && Tooltip && showTooltipFromEvent(React__default.createElement(Tooltip, {
      feature: feature
    }), event);
  }, [isInteractive, showTooltipFromEvent, Tooltip]);
  var handleMouseLeave = React.useCallback(function () {
    return isInteractive && hideTooltip();
  }, [isInteractive, hideTooltip]);
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme
  }, layers.map(function (layer, i) {
    if (layer === 'graticule') {
      if (enableGraticule !== true) return null;
      return React__default.createElement(GeoGraticule, {
        key: "graticule",
        path: path,
        graticule: graticule,
        lineWidth: graticuleLineWidth,
        lineColor: graticuleLineColor
      });
    }
    if (layer === 'features') {
      return React__default.createElement(React.Fragment, {
        key: "features"
      }, features.map(function (feature) {
        return React__default.createElement(GeoMapFeature, {
          key: feature.id,
          feature: feature,
          path: path,
          fillColor: getFillColor(feature),
          borderWidth: getBorderWidth(feature),
          borderColor: getBorderColor(feature),
          onMouseEnter: handleMouseEnter,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          onClick: handleClick
        });
      }));
    }
    return React__default.createElement(React.Fragment, {
      key: i
    }, layer(props));
  }));
});
GeoMap.displayName = 'GeoMap';
GeoMap.propTypes = GeoMapPropTypes;
GeoMap.defaultProps = GeoMapDefaultProps;
var GeoMap$1 = core.withContainer(GeoMap);

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }
var ResponsiveGeoMap = function ResponsiveGeoMap(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(GeoMap$1, _extends({
      width: width,
      height: height
    }, props));
  });
};

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
var getFeatureFromMouseEvent = function getFeatureFromMouseEvent(event, el, features, projection) {
  var _getRelativeCursor = core.getRelativeCursor(el, event),
      _getRelativeCursor2 = _slicedToArray(_getRelativeCursor, 2),
      x = _getRelativeCursor2[0],
      y = _getRelativeCursor2[1];
  return features.find(function (f) {
    return d3Geo.geoContains(f, projection.invert([x, y]));
  });
};
var GeoMapCanvas = React.memo(function (props) {
  var width = props.width,
      height = props.height,
      partialMargin = props.margin,
      pixelRatio = props.pixelRatio,
      features = props.features,
      layers = props.layers,
      projectionType = props.projectionType,
      projectionScale = props.projectionScale,
      projectionTranslation = props.projectionTranslation,
      projectionRotation = props.projectionRotation,
      fillColor = props.fillColor,
      borderWidth = props.borderWidth,
      borderColor = props.borderColor,
      enableGraticule = props.enableGraticule,
      graticuleLineWidth = props.graticuleLineWidth,
      graticuleLineColor = props.graticuleLineColor,
      isInteractive = props.isInteractive,
      onClick = props.onClick,
      onMouseMove = props.onMouseMove,
      Tooltip = props.tooltip;
  var canvasEl = React.useRef(null);
  var theme = core.useTheme();
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useGeoMap = useGeoMap({
    width: width,
    height: height,
    projectionType: projectionType,
    projectionScale: projectionScale,
    projectionTranslation: projectionTranslation,
    projectionRotation: projectionRotation,
    fillColor: fillColor,
    borderWidth: borderWidth,
    borderColor: borderColor
  }),
      projection = _useGeoMap.projection,
      graticule = _useGeoMap.graticule,
      path = _useGeoMap.path,
      getFillColor = _useGeoMap.getFillColor,
      getBorderWidth = _useGeoMap.getBorderWidth,
      getBorderColor = _useGeoMap.getBorderColor;
  React.useEffect(function () {
    if (!canvasEl) return;
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    path.context(ctx);
    layers.forEach(function (layer) {
      if (layer === 'graticule') {
        if (enableGraticule === true) {
          ctx.lineWidth = graticuleLineWidth;
          ctx.strokeStyle = graticuleLineColor;
          ctx.beginPath();
          path(graticule());
          ctx.stroke();
        }
      } else if (layer === 'features') {
        features.forEach(function (feature) {
          ctx.beginPath();
          path(feature);
          ctx.fillStyle = getFillColor(feature);
          ctx.fill();
          var borderWidth = getBorderWidth(feature);
          if (borderWidth > 0) {
            ctx.strokeStyle = getBorderColor(feature);
            ctx.lineWidth = borderWidth;
            ctx.stroke();
          }
        });
      } else {
        layer(ctx, props);
      }
    });
  }, [canvasEl, outerWidth, outerHeight, margin, pixelRatio, theme, path, graticule, getFillColor, getBorderWidth, getBorderColor, features, layers]);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseMove = React.useCallback(function () {
    if (!isInteractive || !Tooltip) return;
    var feature = getFeatureFromMouseEvent(event, canvasEl.current, features, projection);
    if (feature) {
      showTooltipFromEvent(React__default.createElement(Tooltip, {
        feature: feature
      }), event);
    } else {
      hideTooltip();
    }
    onMouseMove && onMouseMove(feature || null, event);
  }, [showTooltipFromEvent, hideTooltip, isInteractive, Tooltip, canvasEl, features, projection]);
  var handleMouseLeave = React.useCallback(function () {
    return isInteractive && hideTooltip();
  }, [isInteractive, hideTooltip]);
  var handleClick = React.useCallback(function () {
    if (!isInteractive || !onClick) return;
    var feature = getFeatureFromMouseEvent(event, canvasEl.current, features, projection);
    if (feature) {
      onClick(feature, event);
    }
  }, [isInteractive, canvasEl, features, projection, onClick]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight,
      cursor: isInteractive ? 'auto' : 'normal'
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick
  });
});
GeoMapCanvas.displatName = 'GeoMapCanvas';
GeoMapCanvas.propTypes = GeoMapCanvasPropTypes;
GeoMapCanvas.defaultProps = GeoMapCanvasDefaultProps;
var GeoMapCanvas$1 = core.withContainer(GeoMapCanvas);

function _extends$1() { _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$1.apply(this, arguments); }
var ResponsiveGeoMapCanvas = function ResponsiveGeoMapCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(GeoMapCanvas$1, _extends$1({
      width: width,
      height: height
    }, props));
  });
};

function _extends$2() { _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$2.apply(this, arguments); }
var Choropleth = React.memo(function (_ref) {
  var width = _ref.width,
      height = _ref.height,
      partialMargin = _ref.margin,
      features = _ref.features,
      data = _ref.data,
      match = _ref.match,
      label = _ref.label,
      value = _ref.value,
      valueFormat = _ref.valueFormat,
      projectionType = _ref.projectionType,
      projectionScale = _ref.projectionScale,
      projectionTranslation = _ref.projectionTranslation,
      projectionRotation = _ref.projectionRotation,
      colors = _ref.colors,
      domain = _ref.domain,
      unknownColor = _ref.unknownColor,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      enableGraticule = _ref.enableGraticule,
      graticuleLineWidth = _ref.graticuleLineWidth,
      graticuleLineColor = _ref.graticuleLineColor,
      layers = _ref.layers,
      legends$1 = _ref.legends,
      isInteractive = _ref.isInteractive,
      onClick = _ref.onClick,
      Tooltip = _ref.tooltip;
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useGeoMap = useGeoMap({
    width: width,
    height: height,
    projectionType: projectionType,
    projectionScale: projectionScale,
    projectionTranslation: projectionTranslation,
    projectionRotation: projectionRotation,
    fillColor: function fillColor() {},
    borderWidth: borderWidth,
    borderColor: borderColor
  }),
      graticule = _useGeoMap.graticule,
      path = _useGeoMap.path,
      getBorderWidth = _useGeoMap.getBorderWidth,
      getBorderColor = _useGeoMap.getBorderColor;
  var _useChoropleth = useChoropleth({
    features: features,
    data: data,
    match: match,
    label: label,
    value: value,
    valueFormat: valueFormat,
    colors: colors,
    unknownColor: unknownColor,
    domain: domain
  }),
      getFillColor = _useChoropleth.getFillColor,
      boundFeatures = _useChoropleth.boundFeatures,
      legendData = _useChoropleth.legendData;
  var theme = core.useTheme();
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleClick = React.useCallback(function (feature, event) {
    return isInteractive && onClick && onClick(feature, event);
  }, [isInteractive, onClick]);
  var handleMouseEnter = React.useCallback(function (feature, event) {
    return isInteractive && Tooltip && showTooltipFromEvent(React__default.createElement(Tooltip, {
      feature: feature
    }), event);
  }, [isInteractive, showTooltipFromEvent, Tooltip]);
  var handleMouseMove = React.useCallback(function (feature, event) {
    return isInteractive && Tooltip && showTooltipFromEvent(React__default.createElement(Tooltip, {
      feature: feature
    }), event);
  }, [isInteractive, showTooltipFromEvent, Tooltip]);
  var handleMouseLeave = React.useCallback(function () {
    return isInteractive && hideTooltip();
  }, [isInteractive, hideTooltip]);
  return React__default.createElement(core.SvgWrapper, {
    width: outerWidth,
    height: outerHeight,
    margin: margin,
    theme: theme
  }, layers.map(function (layer, i) {
    if (layer === 'graticule') {
      if (enableGraticule !== true) return null;
      return React__default.createElement(GeoGraticule, {
        key: "graticule",
        path: path,
        graticule: graticule,
        lineWidth: graticuleLineWidth,
        lineColor: graticuleLineColor
      });
    }
    if (layer === 'features') {
      return React__default.createElement(React.Fragment, {
        key: "features"
      }, boundFeatures.map(function (feature) {
        return React__default.createElement(GeoMapFeature, {
          key: feature.id,
          feature: feature,
          path: path,
          fillColor: getFillColor(feature),
          borderWidth: getBorderWidth(feature),
          borderColor: getBorderColor(feature),
          onMouseEnter: handleMouseEnter,
          onMouseMove: handleMouseMove,
          onMouseLeave: handleMouseLeave,
          onClick: handleClick
        });
      }));
    }
    if (layer === 'legends') {
      return legends$1.map(function (legend, i) {
        return React__default.createElement(legends.BoxLegendSvg, _extends$2({
          key: i,
          containerWidth: width,
          containerHeight: height,
          data: legendData
        }, legend));
      });
    }
    return React__default.createElement(React.Fragment, {
      key: i
    }, layer({}));
  }));
});
Choropleth.displayName = 'Choropleth';
Choropleth.propTypes = ChoroplethPropTypes;
Choropleth.defaultProps = ChoroplethDefaultProps;
var Choropleth$1 = core.withContainer(Choropleth);

function _extends$3() { _extends$3 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$3.apply(this, arguments); }
var ResponsiveChoropleth = function ResponsiveChoropleth(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(Choropleth$1, _extends$3({
      width: width,
      height: height
    }, props));
  });
};

function ownKeys$2(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }
function _objectSpread$2(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys$2(source, true).forEach(function (key) { _defineProperty$2(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys$2(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }
function _defineProperty$2(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray$1(arr, i) { return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _nonIterableRest$1(); }
function _nonIterableRest$1() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit$1(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles$1(arr) { if (Array.isArray(arr)) return arr; }
var getFeatureFromMouseEvent$1 = function getFeatureFromMouseEvent(event, el, features, projection) {
  var _getRelativeCursor = core.getRelativeCursor(el, event),
      _getRelativeCursor2 = _slicedToArray$1(_getRelativeCursor, 2),
      x = _getRelativeCursor2[0],
      y = _getRelativeCursor2[1];
  return features.find(function (f) {
    return d3Geo.geoContains(f, projection.invert([x, y]));
  });
};
var ChoroplethCanvas = React.memo(function (_ref) {
  var width = _ref.width,
      height = _ref.height,
      partialMargin = _ref.margin,
      pixelRatio = _ref.pixelRatio,
      features = _ref.features,
      data = _ref.data,
      match = _ref.match,
      label = _ref.label,
      value = _ref.value,
      valueFormat = _ref.valueFormat,
      projectionType = _ref.projectionType,
      projectionScale = _ref.projectionScale,
      projectionTranslation = _ref.projectionTranslation,
      projectionRotation = _ref.projectionRotation,
      colors = _ref.colors,
      domain = _ref.domain,
      unknownColor = _ref.unknownColor,
      borderWidth = _ref.borderWidth,
      borderColor = _ref.borderColor,
      enableGraticule = _ref.enableGraticule,
      graticuleLineWidth = _ref.graticuleLineWidth,
      graticuleLineColor = _ref.graticuleLineColor,
      layers = _ref.layers,
      legends$1 = _ref.legends,
      isInteractive = _ref.isInteractive,
      onClick = _ref.onClick,
      onMouseMove = _ref.onMouseMove,
      Tooltip = _ref.tooltip;
  var canvasEl = React.useRef(null);
  var theme = core.useTheme();
  var _useDimensions = core.useDimensions(width, height, partialMargin),
      margin = _useDimensions.margin,
      outerWidth = _useDimensions.outerWidth,
      outerHeight = _useDimensions.outerHeight;
  var _useGeoMap = useGeoMap({
    width: width,
    height: height,
    projectionType: projectionType,
    projectionScale: projectionScale,
    projectionTranslation: projectionTranslation,
    projectionRotation: projectionRotation,
    fillColor: function fillColor() {},
    borderWidth: borderWidth,
    borderColor: borderColor
  }),
      projection = _useGeoMap.projection,
      graticule = _useGeoMap.graticule,
      path = _useGeoMap.path,
      getBorderWidth = _useGeoMap.getBorderWidth,
      getBorderColor = _useGeoMap.getBorderColor;
  var _useChoropleth = useChoropleth({
    features: features,
    data: data,
    match: match,
    label: label,
    value: value,
    valueFormat: valueFormat,
    colors: colors,
    unknownColor: unknownColor,
    domain: domain
  }),
      getFillColor = _useChoropleth.getFillColor,
      boundFeatures = _useChoropleth.boundFeatures,
      legendData = _useChoropleth.legendData;
  React.useEffect(function () {
    if (!canvasEl) return;
    canvasEl.current.width = outerWidth * pixelRatio;
    canvasEl.current.height = outerHeight * pixelRatio;
    var ctx = canvasEl.current.getContext('2d');
    ctx.scale(pixelRatio, pixelRatio);
    ctx.fillStyle = theme.background;
    ctx.fillRect(0, 0, outerWidth, outerHeight);
    ctx.translate(margin.left, margin.top);
    path.context(ctx);
    layers.forEach(function (layer) {
      if (layer === 'graticule') {
        if (enableGraticule === true) {
          ctx.lineWidth = graticuleLineWidth;
          ctx.strokeStyle = graticuleLineColor;
          ctx.beginPath();
          path(graticule());
          ctx.stroke();
        }
      } else if (layer === 'features') {
        boundFeatures.forEach(function (feature) {
          ctx.beginPath();
          path(feature);
          ctx.fillStyle = getFillColor(feature);
          ctx.fill();
          var borderWidth = getBorderWidth(feature);
          if (borderWidth > 0) {
            ctx.strokeStyle = getBorderColor(feature);
            ctx.lineWidth = borderWidth;
            ctx.stroke();
          }
        });
      } else if (layer === 'legends') {
        legends$1.forEach(function (legend) {
          legends.renderLegendToCanvas(ctx, _objectSpread$2({}, legend, {
            data: legendData,
            containerWidth: width,
            containerHeight: height,
            theme: theme
          }));
        });
      }
    });
  }, [canvasEl, outerWidth, outerHeight, margin, pixelRatio, theme, path, graticule, getFillColor, getBorderWidth, getBorderColor, boundFeatures, legends$1, layers]);
  var _useTooltip = tooltip.useTooltip(),
      showTooltipFromEvent = _useTooltip.showTooltipFromEvent,
      hideTooltip = _useTooltip.hideTooltip;
  var handleMouseMove = React.useCallback(function () {
    if (!isInteractive || !Tooltip) return;
    var feature = getFeatureFromMouseEvent$1(event, canvasEl.current, boundFeatures, projection);
    if (feature) {
      showTooltipFromEvent(React__default.createElement(Tooltip, {
        feature: feature
      }), event);
    } else {
      hideTooltip();
    }
    onMouseMove && onMouseMove(feature || null, event);
  }, [showTooltipFromEvent, hideTooltip, isInteractive, Tooltip, canvasEl, boundFeatures, projection]);
  var handleMouseLeave = React.useCallback(function () {
    return isInteractive && hideTooltip();
  }, [isInteractive, hideTooltip]);
  var handleClick = React.useCallback(function () {
    if (!isInteractive || !onClick) return;
    var feature = getFeatureFromMouseEvent$1(event, canvasEl.current, boundFeatures, projection);
    if (feature) {
      onClick(feature, event);
    }
  }, [isInteractive, canvasEl, boundFeatures, projection, onClick]);
  return React__default.createElement("canvas", {
    ref: canvasEl,
    width: outerWidth * pixelRatio,
    height: outerHeight * pixelRatio,
    style: {
      width: outerWidth,
      height: outerHeight,
      cursor: isInteractive ? 'auto' : 'normal'
    },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick: handleClick
  });
});
ChoroplethCanvas.displayName = 'ChoroplethCanvas';
ChoroplethCanvas.propTypes = ChoroplethCanvasPropTypes;
ChoroplethCanvas.defaultProps = ChoroplethCanvasDefaultProps;
var ChoroplethCanvas$1 = core.withContainer(ChoroplethCanvas);

function _extends$4() { _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends$4.apply(this, arguments); }
var ResponsiveChoroplethCanvas = function ResponsiveChoroplethCanvas(props) {
  return React__default.createElement(core.ResponsiveWrapper, null, function (_ref) {
    var width = _ref.width,
        height = _ref.height;
    return React__default.createElement(ChoroplethCanvas$1, _extends$4({
      width: width,
      height: height
    }, props));
  });
};

exports.Choropleth = Choropleth$1;
exports.ChoroplethCanvas = ChoroplethCanvas$1;
exports.ChoroplethCanvasDefaultProps = ChoroplethCanvasDefaultProps;
exports.ChoroplethCanvasPropTypes = ChoroplethCanvasPropTypes;
exports.ChoroplethDefaultProps = ChoroplethDefaultProps;
exports.ChoroplethPropTypes = ChoroplethPropTypes;
exports.GeoMap = GeoMap$1;
exports.GeoMapCanvas = GeoMapCanvas$1;
exports.GeoMapCanvasDefaultProps = GeoMapCanvasDefaultProps;
exports.GeoMapCanvasPropTypes = GeoMapCanvasPropTypes;
exports.GeoMapDefaultProps = GeoMapDefaultProps;
exports.GeoMapPropTypes = GeoMapPropTypes;
exports.ResponsiveChoropleth = ResponsiveChoropleth;
exports.ResponsiveChoroplethCanvas = ResponsiveChoroplethCanvas;
exports.ResponsiveGeoMap = ResponsiveGeoMap;
exports.ResponsiveGeoMapCanvas = ResponsiveGeoMapCanvas;
exports.projectionById = projectionById;
exports.useChoropleth = useChoropleth;
exports.useGeoMap = useGeoMap;

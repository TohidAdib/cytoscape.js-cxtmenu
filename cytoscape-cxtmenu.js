(function webpackUniversalModuleDefinition(root, factory) {
    if(typeof exports === 'object' && typeof module === 'object')
        module.exports = factory();
    else if(typeof define === 'function' && define.amd)
        define([], factory);
    else if(typeof exports === 'object')
        exports["@tohidAdib/cytoscapeCxtmenu"] = factory();
    else
        root["@tohidAdib/cytoscapeCxtmenu"] = factory();
})(this, function() {
    return /******/ (function(modules) { // webpackBootstrap
        /******/ 	// The module cache
        /******/ 	var installedModules = {};
        /******/
        /******/ 	// The require function
        /******/ 	function __webpack_require__(moduleId) {
            /******/
            /******/ 		// Check if module is in cache
            /******/ 		if(installedModules[moduleId]) {
                /******/ 			return installedModules[moduleId].exports;
                /******/ 		}
            /******/ 		// Create a new module (and put it into the cache)
            /******/ 		var module = installedModules[moduleId] = {
                /******/ 			i: moduleId,
                /******/ 			l: false,
                /******/ 			exports: {}
                /******/ 		};
            /******/
            /******/ 		// Execute the module function
            /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            /******/
            /******/ 		// Flag the module as loaded
            /******/ 		module.l = true;
            /******/
            /******/ 		// Return the exports of the module
            /******/ 		return module.exports;
            /******/ 	}
        /******/
        /******/
        /******/ 	// expose the modules object (__webpack_modules__)
        /******/ 	__webpack_require__.m = modules;
        /******/
        /******/ 	// expose the module cache
        /******/ 	__webpack_require__.c = installedModules;
        /******/
        /******/ 	// identity function for calling harmony imports with the correct context
        /******/ 	__webpack_require__.i = function(value) { return value; };
        /******/
        /******/ 	// define getter function for harmony exports
        /******/ 	__webpack_require__.d = function(exports, name, getter) {
            /******/ 		if(!__webpack_require__.o(exports, name)) {
                /******/ 			Object.defineProperty(exports, name, {
                    /******/ 				configurable: false,
                    /******/ 				enumerable: true,
                    /******/ 				get: getter
                    /******/ 			});
                /******/ 		}
            /******/ 	};
        /******/
        /******/ 	// getDefaultExport function for compatibility with non-harmony modules
        /******/ 	__webpack_require__.n = function(module) {
            /******/ 		var getter = module && module.__esModule ?
                /******/ 			function getDefault() { return module['default']; } :
                /******/ 			function getModuleExports() { return module; };
            /******/ 		__webpack_require__.d(getter, 'a', getter);
            /******/ 		return getter;
            /******/ 	};
        /******/
        /******/ 	// Object.prototype.hasOwnProperty.call
        /******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
        /******/
        /******/ 	// __webpack_public_path__
        /******/ 	__webpack_require__.p = "";
        /******/
        /******/ 	// Load entry module and return exports
        /******/ 	return __webpack_require__(__webpack_require__.s = 4);
        /******/ })
        /************************************************************************/
        /******/ ([
            /* 0 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                var defaults = __webpack_require__(2);
                var assign = __webpack_require__(1);

                var _require = __webpack_require__(3),
                    removeEles = _require.removeEles,
                    setStyles = _require.setStyles,
                    createElement = _require.createElement,
                    getPixelRatio = _require.getPixelRatio,
                    getOffset = _require.getOffset,
                    createArc = _require.createArc,
                    clearArc = _require.clearArc,
                    createLine = _require.createLine,
                    clearArcWithStroke = _require.clearArcWithStroke,
                    createArcWithStroke = _require.createArcWithStroke,
                    clearLine = _require.clearLine,
                    createRect = _require.createRect,
                    clearRect = _require.clearRect,
                    createBorder = _require.createBorder;

                var cxtmenu = function cxtmenu(params) {
                    var startPoint = Math.PI / 3;
                    var baseGapPosition = 10;
                    var baseGapActivePosition = 40;
                    var options = assign({}, defaults, params);
                    var cy = this;
                    var container = cy.container();
                    var target = void 0;

                    var data = {
                        options: options,
                        handlers: [],
                        container: createElement({ class: 'cxtmenu' })
                    };

                    var wrapper = data.container;
                    var parent = createElement();
                    var canvas = createElement({ tag: 'canvas' });
                    canvas.style.zIndex = options.zIndex;
                    var commands = [];
                    var submenu_commands = [];
                    var c2d = canvas.getContext('2d');
                    var r = options.menuRadius;
                    var containerSize = (r + options.activePadding) * 2 + 2 * r;
                    var activeCommandI = void 0;
                    var activeSubCommandI = void 0;
                    var offset = void 0;

                    container.insertBefore(wrapper, container.firstChild);
                    wrapper.appendChild(parent);
                    parent.appendChild(canvas);

                    setStyles(wrapper, {
                        position: 'absolute',
                        marginLeft: -containerSize / 4 + 'px',
                        marginTop: -containerSize / 4 + 'px',
                        zIndex: options.zIndex,
                        userSelect: 'none',
                        pointerEvents: 'none' // prevent events on menu in modern browsers
                    });

                    // prevent events on menu in legacy browsers
                    ['mousedown', 'mousemove', 'mouseup', 'contextmenu'].forEach(function (evt) {
                        wrapper.addEventListener(evt, function (e) {
                            e.preventDefault();
                            return false;
                        });
                    });

                    setStyles(parent, {
                        display: 'none',
                        width: containerSize + 'px',
                        height: containerSize + 'px',
                        position: 'absolute',
                        zIndex: 1,
                        marginLeft: -options.activePadding + 'px',
                        marginTop: -options.activePadding + 'px',
                        userSelect: 'none'
                    });

                    canvas.width = containerSize;
                    canvas.height = containerSize;

                    function createMenuItems() {
                        removeEles('.cxtmenu-item', parent);
                        var dtheta = 2 * Math.PI / commands.length;
                        var theta1 = startPoint;
                        var theta2 = theta1 + dtheta;

                        for (var i = 0; i < commands.length; i++) {
                            var command = commands[i];
                            var midtheta = (theta1 + theta2) / 2;
                            var rx1 = 0.66 * (r + baseGapPosition) * Math.cos(midtheta);
                            var ry1 = 0.66 * (r + baseGapPosition) * Math.sin(midtheta);
                            var item = document.createElement('div');
                            item.className = 'cxtmenu-item';
                            item.id = 'command-' + i;

                            setStyles(item, {
                                color: options.itemColor,
                                cursor: 'default',
                                display: 'table',
                                'text-align': 'center',
                                //background: 'red',
                                position: 'absolute',
                                'text-shadow': '-1px -1px 2px ' + options.itemTextShadowColor + ', 1px -1px 2px ' + options.itemTextShadowColor + ', -1px 1px 2px ' + options.itemTextShadowColor + ', 1px 1px 1px ' + options.itemTextShadowColor,
                                left: '50%',
                                top: '50%',
                                'min-height': r * 0.66 + 'px',
                                width: r * 0.66 + 'px',
                                height: r * 0.66 + 'px',
                                marginLeft: rx1 - r * 0.33 + 'px',
                                marginTop: -ry1 - r * 0.33 + 'px'
                            });

                            var content = createElement({ class: 'cxtmenu-content' });
                            if (command.content instanceof HTMLElement || command.content instanceof SVGElement) {
                                content.appendChild(command.content);
                            } else {
                                content.innerHTML = command.content;
                            }

                            setStyles(content, {
                                'width': r * 0.66 + 'px',
                                'height': r * 0.66 + 'px',
                                'vertical-align': 'middle',
                                'display': 'table-cell'
                            });

                            setStyles(content, command.contentStyle || {});
                            if (command.enabled === false) {
                                content.setAttribute('class', 'cxtmenu-content cxtmenu-disabled');
                            }

                            parent.appendChild(item);
                            item.appendChild(content);
                            theta1 += dtheta;
                            theta2 += dtheta;
                        }
                    }

                    function createSubMenuItems() {
                        var dtheta = 2 * Math.PI / commands.length;
                        var theta1 = startPoint;
                        var theta2 = theta1 + dtheta;

                        for (var i = 0; i < commands.length; i++) {
                            var command = commands[i];
                            if (command.submenu) {
                                var ddtheta = dtheta / command.submenu.length;
                                theta2 = theta1 + ddtheta;

                                // Calculate the radius for submenu items based on available space
                                var submenuRadius = 1.33 * r; // Adjust this factor as needed

                                for (var j = 0; j < command.submenu.length; j++) {
                                    var submenu = command.submenu[j];
                                    var midtheta = (theta1 + theta2) / 2;

                                    // Calculate position with proper offsets
                                    var rx1 = submenuRadius * Math.cos(midtheta);
                                    var ry1 = submenuRadius * Math.sin(midtheta);

                                    var item = createElement({ class: 'cxtmenu-item' });
                                    var sizeRatio = 1.5;
                                    var itemSize = sizeRatio * r - r;

                                    // Calculate adjusted position to keep item within canvas
                                    var adjustedX = rx1 - itemSize / 2;
                                    var adjustedY = -ry1 - itemSize / 2;

                                    setStyles(item, {
                                        color: options.itemColor,
                                        cursor: 'default',
                                        display: 'table',
                                        'text-align': 'center',
                                        // background: 'rgba(128, 128, 128, 0.7)',
                                        position: 'absolute',
                                        'text-shadow': '-1px -1px 2px ' + options.itemTextShadowColor + ', 1px -1px 2px ' + options.itemTextShadowColor + ', -1px 1px 2px ' + options.itemTextShadowColor + ', 1px 1px 1px ' + options.itemTextShadowColor,
                                        left: '50%',
                                        top: '50%',
                                        'min-height': itemSize + 'px',
                                        width: itemSize + 'px',
                                        height: itemSize + 'px',
                                        marginLeft: adjustedX + 'px',
                                        marginTop: adjustedY + 'px',
                                        'transform-origin': 'center center'
                                    });

                                    var content = createElement({ class: 'cxtmenu-content cxtmenu-submenu-content cxtmenu-' + i + '-submenu-content' });
                                    if (submenu.content instanceof HTMLElement || submenu.content instanceof SVGElement) {
                                        content.appendChild(submenu.content);
                                    } else {
                                        content.innerHTML = submenu.content;
                                    }

                                    setStyles(content, {
                                        'width': itemSize + 'px',
                                        'height': itemSize + 'px',
                                        'vertical-align': 'middle',
                                        'display': 'none'
                                    });

                                    setStyles(content, command.contentStyle || {});
                                    if (submenu.enabled === false) {
                                        content.setAttribute('class', 'cxtmenu-content cxtmenu-submenu-content cxtmenu-' + i + '-submenu-content cxtmenu-disabled');
                                    }

                                    parent.appendChild(item);
                                    item.appendChild(content);

                                    theta1 += ddtheta;
                                    theta2 += ddtheta;
                                }
                            } else {
                                theta1 += dtheta;
                                theta2 += dtheta;
                            }
                        }
                    }

                    function queueDrawBg(rspotlight) {
                        redrawQueue.drawBg = [rspotlight];
                    }

                    function drawBg(rspotlight) {
                        rspotlight = rspotlight !== undefined ? rspotlight : rs;
                        c2d.globalCompositeOperation = 'source-over';
                        c2d.clearRect(0, 0, containerSize, containerSize);
                        // draw background items
                        var dtheta = 2 * Math.PI / commands.length;
                        var theta1 = startPoint;
                        var theta2 = theta1 + dtheta;

                        var strokeStyle = options.separatorColor ? options.separatorColor : 'white';
                        var _iteratorNormalCompletion = true;
                        var _didIteratorError = false;
                        var _iteratorError = undefined;

                        try {
                            for (var _iterator = commands[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                var command = _step.value;

                                createArc(c2d, {
                                    x: 2 * r + options.activePadding,
                                    y: 2 * r + options.activePadding
                                }, r, 2 * Math.PI - theta1, 2 * Math.PI - theta2, command.fillColor ? command.fillColor : options.fillColor, true, true, true, strokeStyle);
                                theta1 += dtheta;
                                theta2 += dtheta;
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

                        updateMenuItemPositions(baseGapPosition);

                        // draw inner circle
                        createArc(c2d, {
                            x: 2 * r + options.activePadding,
                            y: 2 * r + options.activePadding
                        }, rspotlight + options.spotlightPadding, 0, Math.PI * 2, 'white');
                        clearArc(c2d, {
                            x: 2 * r + options.activePadding,
                            y: 2 * r + options.activePadding
                        }, rspotlight + options.spotlightPadding, 0, Math.PI * 2);
                    }

                    function queueDrawCommands(rx, ry, theta) {
                        redrawQueue.drawCommands = [rx, ry, theta];
                    }

                    function drawCommands(rx, ry, theta) {
                        var cx = 2 * r + options.activePadding;
                        var cy = 2 * r + options.activePadding;

                        var dtheta = 2 * Math.PI / commands.length;
                        var baseTheta = startPoint + dtheta * activeCommandI;
                        var nextTheta = baseTheta + dtheta;

                        var startAngle = 2 * Math.PI - baseTheta;
                        var endAngle = 2 * Math.PI - nextTheta;

                        // === 1. Clear the active command arc ===
                        clearArc(c2d, { x: cx, y: cy }, r + options.activePadding, startAngle, endAngle);
                        updateActiveMenuItemPosition(baseGapActivePosition);

                        // === 2. Clear slightly wider arc for hover effect ===
                        clearArc(c2d, { x: cx, y: cy }, r + 11, startAngle, endAngle);

                        // === 3. Draw the active command arc ===
                        createArc(c2d, { x: cx, y: cy }, r + 10, startAngle, endAngle, options.activeFillColor);

                        // === 4. Inner white circle for visual effect ===
                        createArc(c2d, { x: cx, y: cy }, r / 2 - 14, startAngle, endAngle, 'white');

                        // === 5. Cut out the inner white circle again ===
                        clearArc(c2d, { x: cx, y: cy }, r / 2 - 14, startAngle, endAngle);

                        // === 6. Draw lines from center to arc endpoints ===
                        var radius = r + 10;
                        var x1 = cx + radius * Math.cos(startAngle);
                        var y1 = cy + radius * Math.sin(startAngle);
                        var x2 = cx + radius * Math.cos(endAngle);
                        var y2 = cy + radius * Math.sin(endAngle);

                        clearLine(c2d, { x: cx, y: cy }, { x: x1, y: y1 }, options.separatorHoveredCommandsWidth, '', false);
                        clearLine(c2d, { x: cx, y: cy }, { x: x2, y: y2 }, options.separatorHoveredCommandsWidth, '', false);

                        // === 7. Clear indicator box (rotated square) ===
                        var rsOffset = rs + options.spotlightPadding - options.indicatorSize / 4;
                        var tx = cx + rx / r * rsOffset;
                        var ty = cy + ry / r * rsOffset;
                        var rot = Math.PI / 4 - theta;

                        clearRect(c2d, {
                            x: -options.indicatorSize / 2,
                            y: -options.indicatorSize / 2
                        }, options.indicatorSize, options.indicatorSize, { x: tx, y: ty }, rot, '');

                        clearArc(c2d, { x: cx, y: cy }, rs + options.spotlightPadding, 0, 2 * Math.PI, false, true, false);
                    }

                    // 绘制子菜单
                    function queueDrawSubmenuBg(rx, ry, theta) {
                        redrawQueue.drawSubmenuBg = [rx, ry, theta];
                    }

                    function drawSubmenuBg(rx, ry, theta) {
                        var centerX = 2 * r + options.activePadding;
                        var centerY = 2 * r + options.activePadding;

                        var dtheta = 2 * Math.PI / commands.length;
                        var ddtheta = dtheta / submenu_commands.length;

                        var theta1 = startPoint + dtheta * activeCommandI;
                        var theta2 = theta1 + dtheta;

                        var radius = r + 10;

                        var startAngle = 2 * Math.PI - theta1;
                        var endAngle = 2 * Math.PI - theta2;

                        // === Clear Existing Background Slice ===
                        clearArc(c2d, { x: centerX, y: centerY }, radius, startAngle, endAngle);

                        // === Draw Hover Background Slice ===
                        createArc(c2d, { x: centerX, y: centerY }, radius, startAngle, endAngle, options.activeFillColor);

                        // === Draw White Inner Circle ===
                        createArc(c2d, { x: centerX, y: centerY }, r / 2 - 14, startAngle, endAngle, 'white');
                        updateActiveMenuItemPosition(baseGapActivePosition);

                        // === Erase Inner Circle for Transparency ===
                        clearArc(c2d, { x: centerX, y: centerY }, r / 2 - 14, startAngle, endAngle);

                        // === Draw Separator Lines at Arc Edges ===
                        var x1 = centerX + radius * Math.cos(startAngle);
                        var y1 = centerY + radius * Math.sin(startAngle);
                        var x2 = centerX + radius * Math.cos(endAngle);
                        var y2 = centerY + radius * Math.sin(endAngle);

                        clearLine(c2d, { x: centerX, y: centerY }, { x: x1, y: y1 }, options.separatorHoveredCommandsWidth, '', false);
                        clearLine(c2d, { x: centerX, y: centerY }, { x: x2, y: y2 }, options.separatorHoveredCommandsWidth, '', false);

                        // === Clear Rotated Indicator Box ===
                        var tx = centerX + rx / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
                        var ty = centerY + ry / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
                        var rot = Math.PI / 4 - theta;

                        c2d.globalCompositeOperation = 'destination-out';
                        createRect(c2d, {
                            x: -options.indicatorSize / 2,
                            y: -options.indicatorSize / 2
                        }, options.indicatorSize, options.indicatorSize, { x: tx, y: ty }, rot, 'white');

                        // === Clear Spotlight Ring ===
                        createArc(c2d, {
                            x: centerX,
                            y: centerY
                        }, rs + options.spotlightPadding, 0, Math.PI * 2, 'white', true, true, false);

                        // === Draw Submenu Ring Arc ===
                        var mainRadius = r;
                        var outerRadius = r * 1.55;
                        var arcRadius = (outerRadius + mainRadius) / 2 + 15;
                        var outerSide = 0.08;

                        var arcStart = 2 * Math.PI - theta1 + outerSide;
                        var arcEnd = 2 * Math.PI - theta2 - outerSide;

                        clearArcWithStroke(c2d, { x: centerX, y: centerY }, arcRadius, outerRadius - mainRadius, arcStart, arcEnd);
                        // === Draw filled arc (optional, only if you want a background fill)
                        createArcWithStroke(c2d, {
                            x: centerX,
                            y: centerY
                        }, arcRadius, outerRadius - mainRadius, arcStart, arcEnd, options.fillColor);

                        // === Draw border around arc (with thin stroke)
                        createBorder(c2d, centerX, centerY, outerRadius + 14, arcStart, arcEnd, options.separatorColor ? options.separatorColor : 'white');

                        // Outer border
                        createBorder(c2d, centerX, centerY, radius + 5, arcStart, arcEnd, options.separatorColor ? options.separatorColor : 'white', 1, false);

                        // === Draw Submenu Separators ===
                        var subTheta = startPoint + dtheta * activeCommandI;
                        var separatorInnerRadius = arcRadius - (outerRadius - mainRadius) / 2;
                        var separatorOuterRadius = arcRadius + (outerRadius - mainRadius) / 2;

                        // Adjust the angles to match the arc borders
                        var adjustedStartAngle = arcStart;
                        var adjustedEndAngle = arcEnd;

                        for (var i = 1; i < submenu_commands.length; i++) {
                            subTheta += ddtheta;
                            var angle = 2 * Math.PI - subTheta;

                            var sepX1 = centerX + separatorInnerRadius * Math.cos(angle);
                            var sepY1 = centerY + separatorInnerRadius * Math.sin(angle);

                            var sepX2 = centerX + separatorOuterRadius * Math.cos(angle);
                            var sepY2 = centerY + separatorOuterRadius * Math.sin(angle);

                            var lineWidth = options.separatorWidth || 1;
                            var strokeStyle = options.separatorColor || 'white';
                            createLine(c2d, { x: sepX1, y: sepY1 }, { x: sepX2, y: sepY2 }, lineWidth, strokeStyle, false);
                        }

                        // === Draw Start Separator Line ===
                        createLine(c2d, {
                            x: centerX + separatorInnerRadius * Math.cos(adjustedStartAngle),
                            y: centerY + separatorInnerRadius * Math.sin(adjustedStartAngle)
                        }, {
                            x: centerX + separatorOuterRadius * Math.cos(adjustedStartAngle),
                            y: centerY + separatorOuterRadius * Math.sin(adjustedStartAngle)
                        }, options.separatorWidth || 1, options.separatorColor || 'white', false);

                        // === Draw End Separator Line ===
                        createLine(c2d, {
                            x: centerX + separatorInnerRadius * Math.cos(adjustedEndAngle),
                            y: centerY + separatorInnerRadius * Math.sin(adjustedEndAngle)
                        }, {
                            x: centerX + separatorOuterRadius * Math.cos(adjustedEndAngle),
                            y: centerY + separatorOuterRadius * Math.sin(adjustedEndAngle)
                        }, options.separatorWidth || 1, options.separatorColor || 'white', false);
                    }

                    //绘制活动子菜单
                    function queueDrawSubmenuCommands() {
                        redrawQueue.drawSubmenuCommands = [];
                    }

                    function drawSubmenuCommands() {
                        c2d.globalCompositeOperation = 'source-over';

                        var dtheta = 2 * Math.PI / commands.length;
                        var ddtheta = dtheta / submenu_commands.length;

                        // Compute angles for the active submenu command
                        var theta1 = startPoint + dtheta * activeCommandI + ddtheta * activeSubCommandI;
                        var theta2 = theta1 + ddtheta;

                        var cx = 2 * r + options.activePadding;
                        var cy = 2 * r + options.activePadding;
                        var mainRadius = r;
                        var outerRadius = r * 1.55;

                        // Adjust drawing angles
                        var startAngle = 2 * Math.PI - theta1;
                        var endAngle = 2 * Math.PI - theta2;

                        if (activeSubCommandI === 0) {
                            startAngle += 0.08; // Slight adjustment for first item
                        } else if (activeSubCommandI === submenu_commands.length - 1) {
                            endAngle -= 0.08; // Slight adjustment for last item
                        }

                        // Set stroke color based on submenu command or fallback option
                        var strokeStyle = options.activeFillColor;

                        // Erase underlying content with stroke (cutout effect)
                        clearArcWithStroke(c2d, {
                            x: cx,
                            y: cy
                        }, (outerRadius + mainRadius) / 2 + 15, outerRadius - mainRadius, startAngle, endAngle);

                        // Restore standard drawing mode and redraw the arc
                        createArcWithStroke(c2d, {
                            x: cx,
                            y: cy
                        }, (outerRadius + mainRadius) / 2 + 15, outerRadius - mainRadius, startAngle, endAngle, strokeStyle);
                    }

                    function updateActiveMenuItemPosition() {
                        var offsetRadius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var angularOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                        var dtheta = 2 * Math.PI / commands.length;

                        // Compute angles for the active command
                        var theta1 = startPoint + angularOffset + dtheta * activeCommandI;
                        var theta2 = theta1 + dtheta;
                        var midtheta = (theta1 + theta2) / 2;

                        // Compute new position
                        var rx1 = 0.66 * (r + offsetRadius) * Math.cos(midtheta);
                        var ry1 = 0.66 * (r + offsetRadius) * Math.sin(midtheta);

                        // Update only the active item
                        var activeItem = document.getElementById('command-' + activeCommandI);
                        if (activeItem) {
                            activeItem.style.marginLeft = rx1 - r * 0.33 + 'px';
                            activeItem.style.marginTop = -ry1 - r * 0.33 + 'px';
                        }

                        commands.forEach(function (command, index) {
                            return command.hovered = activeCommandI === index;
                        });
                    }

                    function updateMenuItemPositions() {
                        var offsetRadius = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
                        var angularOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

                        var dtheta = 2 * Math.PI / commands.length;
                        var theta1 = startPoint + angularOffset;
                        var theta2 = theta1 + dtheta;

                        for (var i = 0; i < commands.length; i++) {
                            if (i === activeCommandI) {
                                theta1 += dtheta;
                                theta2 += dtheta;
                                continue;
                            }

                            var midtheta = (theta1 + theta2) / 2;

                            var rx1 = 0.66 * (r + offsetRadius) * Math.cos(midtheta);
                            var ry1 = 0.66 * (r + offsetRadius) * Math.sin(midtheta);

                            var item = document.getElementById('command-' + i);
                            if (item) {
                                item.style.marginLeft = rx1 - r * 0.33 + 'px';
                                item.style.marginTop = -ry1 - r * 0.33 + 'px';
                            }

                            theta1 += dtheta;
                            theta2 += dtheta;
                        }
                    }

                    function updatePixelRatio() {
                        var pxr = getPixelRatio();
                        var w = containerSize;
                        var h = containerSize;

                        canvas.width = w * pxr;
                        canvas.height = h * pxr;

                        canvas.style.width = w + 'px';
                        canvas.style.height = h + 'px';

                        c2d.setTransform(1, 0, 0, 1, 0, 0);
                        c2d.scale(pxr, pxr);
                    }

                    var redrawing = true;
                    var redrawQueue = {};

                    var raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || function (fn) {
                        return setTimeout(fn, 16);
                    };

                    var redraw = function redraw() {
                        if (redrawQueue.drawBg) {
                            drawBg.apply(null, redrawQueue.drawBg);
                        }

                        if (redrawQueue.drawCommands) {
                            drawCommands.apply(null, redrawQueue.drawCommands);
                        }

                        if (redrawQueue.drawSubmenuBg) {
                            drawSubmenuBg.apply(null, redrawQueue.drawSubmenuBg);
                        }

                        if (redrawQueue.drawSubmenuCommands) {
                            drawSubmenuCommands.apply(null, redrawQueue.drawSubmenuCommands);
                        }

                        redrawQueue = {};

                        if (redrawing) {
                            raf(redraw);
                        }
                    };

                    // kick off
                    updatePixelRatio();
                    redraw();

                    var ctrx = void 0,
                        ctry = void 0,
                        rs = void 0;

                    var bindings = {
                        on: function on(events, selector, fn) {
                            var _fn = fn;
                            if (selector === 'core') {
                                _fn = function _fn(e) {
                                    if (e.cyTarget === cy || e.target === cy) // only if event target is directly core
                                    {
                                        return fn.apply(this, [e]);
                                    }
                                };
                            }

                            data.handlers.push({
                                events: events,
                                selector: selector,
                                fn: _fn
                            });

                            if (selector === 'core') {
                                cy.on(events, _fn);
                            } else {
                                cy.on(events, selector, _fn);
                            }
                            return this;
                        }
                    };

                    function addEventListeners() {
                        var grabbable = void 0;
                        var inGesture = false;
                        var zoomEnabled = void 0;
                        var panEnabled = void 0;
                        var boxEnabled = void 0;
                        var gestureStartEvent = void 0;

                        var restoreZoom = function restoreZoom() {
                            if (zoomEnabled) {
                                cy.userZoomingEnabled(true);
                            }
                        };

                        var restoreGrab = function restoreGrab() {
                            if (grabbable) {
                                target.grabify();
                            }
                        };

                        var restorePan = function restorePan() {
                            if (panEnabled) {
                                cy.userPanningEnabled(true);
                            }
                        };

                        var restoreBoxSeln = function restoreBoxSeln() {
                            if (boxEnabled) {
                                cy.boxSelectionEnabled(true);
                            }
                        };

                        var restoreGestures = function restoreGestures() {
                            restoreGrab();
                            restoreZoom();
                            restorePan();
                            restoreBoxSeln();
                        };

                        window.addEventListener('resize', updatePixelRatio);

                        bindings.on('resize', function () {
                            updatePixelRatio();
                        }).on(options.openMenuEvents, options.selector, function (e) {
                            target = this; // Remember which node the context menu is for
                            var ele = this;
                            var isCy = this === cy;

                            if (inGesture) {
                                parent.style.display = 'none';

                                inGesture = false;

                                restoreGestures();
                            }

                            if (typeof options.commands === 'function') {
                                var res = options.commands(target);
                                if (res.then) {
                                    res.then(function (_commands) {
                                        commands = _commands;
                                        openMenu();
                                    });
                                } else {
                                    commands = res;
                                    openMenu();
                                }
                            } else {
                                commands = options.commands;
                                openMenu();
                            }

                            function openMenu() {
                                if (!commands || commands.length === 0) {
                                    return;
                                }

                                zoomEnabled = cy.userZoomingEnabled();
                                cy.userZoomingEnabled(false);

                                panEnabled = cy.userPanningEnabled();
                                cy.userPanningEnabled(false);

                                boxEnabled = cy.boxSelectionEnabled();
                                cy.boxSelectionEnabled(false);

                                grabbable = target.grabbable && target.grabbable();
                                if (grabbable) {
                                    target.ungrabify();
                                }

                                var rp = void 0,
                                    rw = void 0,
                                    rh = void 0;
                                if (!isCy && ele.isNode() && !ele.isParent() && !options.atMouse) {
                                    rp = ele.renderedPosition();
                                    rw = ele.renderedWidth();
                                    rh = ele.renderedHeight();
                                } else {
                                    rp = e.renderedPosition || e.cyRenderedPosition;
                                    rw = 1;
                                    rh = 1;
                                }

                                offset = getOffset(container);
                                ctrx = rp.x;
                                ctry = rp.y;
                                createMenuItems();
                                createSubMenuItems();
                                setStyles(parent, {
                                    display: 'block',
                                    left: rp.x - r + 'px',
                                    top: rp.y - r + 'px'
                                });
                                rs = Math.max(rw, rh) / 2;
                                rs = Math.max(rs, options.minSpotlightRadius);
                                rs = Math.min(rs, options.maxSpotlightRadius);
                                queueDrawBg();
                                activeCommandI = undefined;
                                inGesture = true;
                                gestureStartEvent = e;
                            }
                        }).on('cxtdrag tapdrag', options.selector = function (e) {
                            if (!inGesture) {
                                return;
                            }

                            var origE = e.originalEvent;
                            var isTouch = origE.touches && origE.touches.length > 0;
                            var pageX = isTouch ? origE.touches[0].pageX : origE.pageX;
                            var pageY = isTouch ? origE.touches[0].pageY : origE.pageY;

                            activeCommandI = undefined;

                            var dx = pageX - offset.left - ctrx;
                            var dy = pageY - offset.top - ctry;

                            if (dx === 0) {
                                dx = 0.01;
                            }

                            var d = Math.sqrt(dx * dx + dy * dy);

                            var cosTheta = (dy * dy - d * d - dx * dx) / (-2 * d * dx);
                            var theta = Math.acos(cosTheta);

                            var rx = dx * r / d;
                            var ry = dy * r / d;

                            if (dy > 0) {
                                theta = Math.PI + Math.abs(theta - Math.PI);
                            }

                            var dtheta = 2 * Math.PI / commands.length;
                            var theta1 = startPoint;
                            var theta2 = theta1 + dtheta;
                            for (var i = 0; i < commands.length; i++) {
                                var command = commands[i];
                                if (command.submenu) {
                                    submenu_commands = command.submenu;
                                } else {
                                    submenu_commands = [];
                                }

                                var inThisCommand = theta1 <= theta && theta <= theta2 || theta1 <= theta + 2 * Math.PI && theta + 2 * Math.PI <= theta2;

                                if (command.enabled === false) {
                                    inThisCommand = false;
                                }

                                if (inThisCommand) {
                                    activeCommandI = i;
                                    break;
                                }
                                theta1 += dtheta;
                                theta2 += dtheta;
                            }
                            hideSubmenuContent();

                            if (commands[activeCommandI] !== undefined) {

                                // Do not draw indicator while mouse in inner circle or out of circle # But if a command has submenu, draw indicator util mouse out of submenu (2*r)
                                if (d < rs + options.spotlightPadding || d > options.menuRadius && !commands[activeCommandI].submenu) {
                                    queueDrawBg();
                                    cancelActiveCommand();
                                    return;
                                }

                                if (d > rs + options.spotlightPadding && d < options.menuRadius) {
                                    queueDrawBg();
                                    if (!commands[activeCommandI].submenu) {
                                        queueDrawCommands(rx, ry, theta);
                                    } else {
                                        showSubmenuContent(activeCommandI);
                                        queueDrawSubmenuBg(rx, ry, theta);
                                    }
                                    return;
                                }

                                if (d >= options.menuRadius + 160) {
                                    commands[activeCommandI].hovered = false;
                                }

                                if (d < options.menuRadius + 160 && d > options.menuRadius && commands[activeCommandI].submenu && commands[activeCommandI].hovered) {
                                    showSubmenuContent(activeCommandI);
                                    submenu_commands = commands[activeCommandI].submenu;
                                    queueDrawBg();
                                    // Judge which submenu used
                                    var ddtheta = dtheta / submenu_commands.length;
                                    var _theta = startPoint;
                                    var _theta2 = _theta + ddtheta;
                                    _theta += dtheta * activeCommandI;
                                    _theta2 += dtheta * activeCommandI;
                                    for (var _i = 0; _i < submenu_commands.length; _i++) {
                                        var submenu_command = commands[activeCommandI].submenu[_i];
                                        var inThisSubMenuCommand = _theta <= theta && theta <= _theta2 || _theta <= theta + 2 * Math.PI && theta + 2 * Math.PI <= _theta2;
                                        if (submenu_command.enabled === false) {
                                            inThisSubMenuCommand = false;
                                            activeSubCommandI = undefined;
                                        }
                                        if (inThisSubMenuCommand) {
                                            activeSubCommandI = _i;
                                            break;
                                        }
                                        _theta += ddtheta;
                                        _theta2 += ddtheta;
                                    }

                                    queueDrawSubmenuBg(rx, ry, theta);
                                    queueDrawSubmenuCommands();
                                    return;
                                }
                            }

                            cancelActiveCommand();
                            queueDrawBg();
                        }).on('cxttapend tapend', function () {
                            parent.style.display = 'none';
                            if (activeCommandI !== undefined) {
                                var select = commands[activeCommandI].select;
                                if (select) {
                                    select.apply(target, [target, gestureStartEvent]);
                                    activeCommandI = undefined;
                                } else if (commands[activeCommandI].submenu && activeSubCommandI !== undefined) {
                                    // Execute submenu select function
                                    commands[activeCommandI].submenu[activeSubCommandI].select.apply(target, [target, gestureStartEvent]);
                                    activeCommandI = undefined;
                                    activeSubCommandI = undefined;
                                }
                            }
                            inGesture = false;
                            restoreGestures();
                        });
                    }

                    function cancelActiveCommand() {
                        activeCommandI = undefined;
                        activeSubCommandI = undefined;
                    }

                    function hideSubmenuContent() {
                        var cxtmenu_submenus = document.getElementsByClassName('cxtmenu-submenu-content');
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = cxtmenu_submenus[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var cxtmenu_submenu = _step2.value;

                                setStyles(cxtmenu_submenu, {
                                    display: 'none'
                                });
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
                    }

                    function showSubmenuContent(i) {
                        var cxtmenu_submenus = document.getElementsByClassName('cxtmenu-' + i + '-submenu-content');
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            for (var _iterator3 = cxtmenu_submenus[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                var cxtmenu_submenu = _step3.value;

                                setStyles(cxtmenu_submenu, {
                                    display: 'table-cell'
                                });
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }
                    }

                    function removeEventListeners() {
                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = data.handlers[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var h = _step4.value;

                                if (h.selector === 'core') {
                                    cy.off(h.events, h.fn);
                                } else {
                                    cy.off(h.events, h.selector, h.fn);
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }

                        window.removeEventListener('resize', updatePixelRatio);
                    }

                    function destroyInstance() {
                        redrawing = false;
                        removeEventListeners();
                        wrapper.remove();
                    }

                    addEventListeners();

                    return {
                        destroy: function destroy() {
                            return destroyInstance();
                        }
                    };
                };

                module.exports = cxtmenu;

                /***/ }),
            /* 1 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


// Simple, internal Object.assign() polyfill for options objects etc.

                module.exports = Object.assign != null ? Object.assign.bind(Object) : function (tgt) {
                    for (var _len = arguments.length, srcs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        srcs[_key - 1] = arguments[_key];
                    }

                    srcs.filter(function (src) {
                        return src != null;
                    }).forEach(function (src) {
                        Object.keys(src).forEach(function (k) {
                            return tgt[k] = src[k];
                        });
                    });

                    return tgt;
                };

                /***/ }),
            /* 2 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                var defaults = {
                    menuRadius: 256, // the radius of the circular menu in pixels
                    selector: 'node', // elements matching this Cytoscape.js selector will trigger cxtmenus
                    commands: [// an array of commands to list in the menu or a function that returns the array
                        /*
                        { // example command
                          fillColor: 'rgba(200, 200, 200, 0.75)', // optional: custom background color for item
                          content: 'a command name' // html/text content to be displayed in the menu
                          contentStyle: {}, // css key:value pairs to set the command's css in js if you want
                          select: function(ele){ // a function to execute when the command is selected
                            console.log( ele.id() ) // `ele` holds the reference to the active element
                          },
                          enabled: true // whether the command is selectable
                        }
                        */
                    ], // function( ele ){ return [ /*...*/ ] }, // example function for commands
                    fillColor: 'rgba(17,20,24,0.7)', // the background colour of the menu
                    activeFillColor: 'rgba(95, 107, 124, 0.7)', // the colour used to indicate the selected command
                    activePadding: 0, // additional size in pixels for the active command
                    indicatorSize: 0, // the size in pixels of the pointer to the active command
                    separatorWidth: 1, // the empty spacing in pixels between successive commands
                    separatorHoveredCommandsWidth: 4.3,
                    separatorColor: '#000',
                    spotlightPadding: 4, // extra spacing in pixels between the element and the spotlight
                    minSpotlightRadius: 102.5, // the minimum radius in pixels of the spotlight
                    maxSpotlightRadius: 102.5, // the maximum radius in pixels of the spotlight
                    openMenuEvents: 'cxttap', // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
                    itemColor: 'white', // the colour of text in the command's content
                    itemTextShadowColor: 'transparent', // the text shadow colour of the command's content
                    zIndex: 9999, // the z-index of the ui div and canves
                    atMouse: false // draw menu at mouse position
                };

                module.exports = defaults;

                /***/ }),
            /* 3 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                var removeEles = function removeEles(query) {
                    var ancestor = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : document;

                    var els = ancestor.querySelectorAll(query);

                    for (var i = 0; i < els.length; i++) {
                        var el = els[i];

                        el.parentNode.removeChild(el);
                    }
                };

                var setStyles = function setStyles(el, style) {
                    var props = Object.keys(style);

                    for (var i = 0, l = props.length; i < l; i++) {
                        el.style[props[i]] = style[props[i]];
                    }
                };

                var createElement = function createElement(options) {
                    options = options || {};

                    var el = document.createElement(options.tag || 'div');

                    el.className = options.class || '';

                    if (options.style) {
                        setStyles(el, options.style);
                    }

                    return el;
                };

                var getPixelRatio = function getPixelRatio() {
                    return window.devicePixelRatio || 1;
                };

                var getOffset = function getOffset(el) {
                    var offset = el.getBoundingClientRect();

                    return {
                        left: offset.left + document.body.scrollLeft + parseFloat(getComputedStyle(document.body)['padding-left']) + parseFloat(getComputedStyle(document.body)['border-left-width']),
                        top: offset.top + document.body.scrollTop + parseFloat(getComputedStyle(document.body)['padding-top']) + parseFloat(getComputedStyle(document.body)['border-top-width'])
                    };
                };

                var createArc = function createArc(ctx, center, radius, startAngle, endAngle) {
                    var fillStyle = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '';
                    var counterClockwise = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
                    var closePath = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
                    var location = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
                    var strokeStyle = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : '';
                    var lineWidth = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : 1;
                    var strokeOutside = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;

                    ctx.beginPath();
                    if (location) {
                        ctx.moveTo(center.x, center.y);
                    }
                    ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
                    if (fillStyle) {
                        ctx.fillStyle = fillStyle;
                        ctx.fill();
                    }
                    if (strokeStyle && !strokeOutside) {
                        ctx.strokeStyle = strokeStyle;
                        ctx.lineWidth = lineWidth;
                        ctx.stroke();
                    }
                    if (closePath) {
                        ctx.closePath();
                    }
                };

// Clear an arc area using composite mode
                var clearArc = function clearArc(ctx, center, radius, startAngle, endAngle) {
                    var counterClockwise = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;
                    var closePath = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
                    var location = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;

                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.beginPath();
                    if (location) {
                        ctx.moveTo(center.x, center.y);
                    }
                    ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
                    if (closePath) {
                        ctx.closePath();
                    }
                    ctx.fill();
                    ctx.globalCompositeOperation = 'source-over';
                };

// Utility: draw arc with stroke on canvas
                var createArcWithStroke = function createArcWithStroke(ctx, center, radius, lineWidth, startAngle, endAngle, strokeStyle) {
                    var counterClockwise = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;
                    var closePath = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;

                    ctx.strokeStyle = strokeStyle;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
                    ctx.stroke();
                    if (closePath) {
                        ctx.closePath();
                    }
                };

// Utility: clear arc with stroke on canvas
                var clearArcWithStroke = function clearArcWithStroke(ctx, center, radius, lineWidth, startAngle, endAngle) {
                    var counterClockwise = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : true;
                    var closePath = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : true;

                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.arc(center.x, center.y, radius, startAngle, endAngle, counterClockwise);
                    ctx.stroke();
                    if (closePath) {
                        ctx.closePath();
                    }
                    ctx.globalCompositeOperation = 'source-over';
                };

// Draw a line between two points
                var createLine = function createLine(ctx, startPoint, endPoint) {
                    var lineWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
                    var strokeStyle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'black';
                    var closePath = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

                    ctx.strokeStyle = strokeStyle;
                    ctx.lineWidth = lineWidth;
                    ctx.beginPath();
                    ctx.moveTo(startPoint.x, startPoint.y);
                    ctx.lineTo(endPoint.x, endPoint.y);
                    ctx.stroke();
                    if (closePath) {
                        ctx.closePath();
                    }
                };

// Clear a line by overdrawing with destination-out
                var clearLine = function clearLine(ctx, startPoint, endPoint) {
                    var lineWidth = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 1;
                    var strokeStyle = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : 'black';
                    var closePath = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : true;

                    ctx.globalCompositeOperation = 'destination-out';
                    createLine(ctx, startPoint, endPoint, lineWidth, strokeStyle, closePath);
                    ctx.globalCompositeOperation = 'source-over';
                };

// Draw a rect between two points
                var createRect = function createRect(ctx, startPoint, width, height, translate, rotate, fillStyle) {
                    ctx.fillStyle = fillStyle;
                    ctx.translate(translate.x, translate.y);
                    ctx.rotate(rotate);

                    ctx.beginPath();
                    ctx.fillRect(startPoint.x, startPoint.y, width, height);
                    ctx.closePath();
                    ctx.fill();

                    ctx.rotate(-rotate);
                    ctx.translate(-translate.x, -translate.y);
                };

// Clear a rect by overdrawing with destination-out
                var clearRect = function clearRect(ctx, startPoint, width, height, translate, rotate, fillStyle) {
                    ctx.globalCompositeOperation = 'destination-out';
                    ctx.fillStyle = fillStyle;
                    ctx.translate(translate.x, translate.y);
                    ctx.rotate(rotate);

                    ctx.beginPath();
                    ctx.fillRect(startPoint.x, startPoint.y, width, height);
                    ctx.closePath();
                    ctx.fill();

                    ctx.rotate(-rotate);
                    ctx.translate(-translate.x, -translate.y);
                    ctx.globalCompositeOperation = 'source-over';
                };

                function createBorder(ctx, centerX, centerY, radius, arcStart, arcEnd) {
                    var strokeStyle = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : "white";
                    var lineWidth = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : 1;
                    var closePath = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
                    var counterClockwise = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;

                    ctx.beginPath();
                    ctx.arc(centerX, centerY, radius, arcStart, arcEnd, counterClockwise);
                    ctx.strokeStyle = strokeStyle;
                    ctx.lineWidth = lineWidth;
                    ctx.stroke();
                    if (closePath) {
                        ctx.closePath();
                    }
                }

                module.exports = { removeEles: removeEles, setStyles: setStyles, createElement: createElement, getPixelRatio: getPixelRatio, getOffset: getOffset, createArc: createArc, clearArc: clearArc, createLine: createLine, clearLine: clearLine, clearArcWithStroke: clearArcWithStroke, createArcWithStroke: createArcWithStroke, clearRect: clearRect, createRect: createRect, createBorder: createBorder };

                /***/ }),
            /* 4 */
            /***/ (function(module, exports, __webpack_require__) {

                "use strict";


                var cxtmenu = __webpack_require__(0);

// registers the extension on a cytoscape lib ref
                var register = function register(cytoscape) {
                    if (!cytoscape) {
                        return;
                    } // can't register if cytoscape unspecified

                    cytoscape('core', 'cxtmenu', cxtmenu); // register with cytoscape.js
                };

                if (typeof cytoscape !== 'undefined') {
                    // expose to global cytoscape (i.e. window.cytoscape)
                    register(cytoscape);
                }

                module.exports = register;

                /***/ })
            /******/ ]);
});
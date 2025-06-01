const defaults = require('./defaults');
const assign = require('./assign');
const {
    removeEles,
    setStyles,
    createElement,
    getPixelRatio,
    getOffset,
    createArc,
    clearArc,
    createLine,
    clearArcWithStroke,
    createArcWithStroke,
    clearLine,
    createRect,
    clearRect,
    createBorder,
} = require('./dom-util');

let cxtmenu = function (params) {
    const startPoint = Math.PI / 3;
    const baseGapPosition = 10;
    const baseGapActivePosition = 40;
    let options = assign({}, defaults, params);
    let cy = this;
    let container = cy.container();
    let target;

    let data = {
        options: options,
        handlers: [],
        container: createElement({ class: 'cxtmenu' }),
    };

    let wrapper = data.container;
    let parent = createElement();
    let canvas = createElement({ tag: 'canvas' });
    canvas.style.zIndex = options.zIndex;
    let commands = [];
    let submenu_commands = [];
    let c2d = canvas.getContext('2d');
    let r = options.menuRadius;
    let containerSize = (r + options.activePadding) * 2 + 2 * r;
    let activeCommandI;
    let activeSubCommandI;
    let offset;

    container.insertBefore(wrapper, container.firstChild);
    wrapper.appendChild(parent);
    parent.appendChild(canvas);

    setStyles(wrapper, {
        position: 'absolute',
        marginLeft: -containerSize / 4 + 'px',
        marginTop: -containerSize / 4 + 'px',
        zIndex: options.zIndex,
        userSelect: 'none',
        pointerEvents: 'none', // prevent events on menu in modern browsers
    });

    // prevent events on menu in legacy browsers
    ['mousedown', 'mousemove', 'mouseup', 'contextmenu'].forEach(evt => {
        wrapper.addEventListener(evt, e => {
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
        userSelect: 'none',
    });

    canvas.width = containerSize;
    canvas.height = containerSize;

    function createMenuItems() {
        removeEles('.cxtmenu-item', parent);
        let dtheta = 2 * Math.PI / (commands.length);
        let theta1 = startPoint;
        let theta2 = theta1 + dtheta;

        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            let midtheta = (theta1 + theta2) / 2;
            let rx1 = 0.66 * (r + baseGapPosition) * Math.cos(midtheta);
            let ry1 = 0.66 * (r + baseGapPosition) * Math.sin(midtheta);
            let item = document.createElement('div');
            item.className = 'cxtmenu-item';
            item.id = `command-${i}`;

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
                'min-height': (r * 0.66) + 'px',
                width: (r * 0.66) + 'px',
                height: (r * 0.66) + 'px',
                marginLeft: (rx1 - r * 0.33) + 'px',
                marginTop: (-ry1 - r * 0.33) + 'px',
            });

            let content = createElement({ class: 'cxtmenu-content' });
            if (command.content instanceof HTMLElement || command.content instanceof SVGElement) {
                content.appendChild(command.content);
            } else {
                content.innerHTML = command.content;
            }

            setStyles(content, {
                'width': (r * 0.66) + 'px',
                'height': (r * 0.66) + 'px',
                'vertical-align': 'middle',
                'display': 'table-cell',
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
        let dtheta = 2 * Math.PI / (commands.length);
        let theta1 = startPoint;
        let theta2 = theta1 + dtheta;

        for (let i = 0; i < commands.length; i++) {
            let command = commands[i];
            if (command.submenu) {
                let ddtheta = dtheta / command.submenu.length;
                theta2 = theta1 + ddtheta;

                // Calculate the radius for submenu items based on available space
                let submenuRadius = 1.33 * r; // Adjust this factor as needed

                for (let j = 0; j < command.submenu.length; j++) {
                    let submenu = command.submenu[j];
                    let midtheta = (theta1 + theta2) / 2;

                    // Calculate position with proper offsets
                    let rx1 = submenuRadius * Math.cos(midtheta);
                    let ry1 = submenuRadius * Math.sin(midtheta);

                    let item = createElement({ class: 'cxtmenu-item' });
                    const sizeRatio = 1.5;
                    const itemSize = (sizeRatio * r) - r;

                    // Calculate adjusted position to keep item within canvas
                    let adjustedX = rx1 - (itemSize / 2);
                    let adjustedY = -ry1 - (itemSize / 2);

                    setStyles(item, {
                        color: options.itemColor,
                        cursor: 'default',
                        display: 'table',
                        'text-align': 'center',
                        // background: 'rgba(128, 128, 128, 0.7)',
                        position: 'absolute',
                        'text-shadow': `-1px -1px 2px ${options.itemTextShadowColor}, 1px -1px 2px ${options.itemTextShadowColor}, -1px 1px 2px ${options.itemTextShadowColor}, 1px 1px 1px ${options.itemTextShadowColor}`,
                        left: '50%',
                        top: '50%',
                        'min-height': itemSize + 'px',
                        width: itemSize + 'px',
                        height: itemSize + 'px',
                        marginLeft: adjustedX + 'px',
                        marginTop: adjustedY + 'px',
                        'transform-origin': 'center center',
                    });

                    let content = createElement({ class: `cxtmenu-content cxtmenu-submenu-content cxtmenu-${i}-submenu-content` });
                    if (submenu.content instanceof HTMLElement || submenu.content instanceof SVGElement) {
                        content.appendChild(submenu.content);
                    } else {
                        content.innerHTML = submenu.content;
                    }

                    setStyles(content, {
                        'width': itemSize + 'px',
                        'height': itemSize + 'px',
                        'vertical-align': 'middle',
                        'display': 'none',
                    });

                    setStyles(content, command.contentStyle || {});
                    if (submenu.enabled === false) {
                        content.setAttribute('class', `cxtmenu-content cxtmenu-submenu-content cxtmenu-${i}-submenu-content cxtmenu-disabled`);
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
        let dtheta = 2 * Math.PI / (commands.length);
        let theta1 = startPoint;
        let theta2 = theta1 + dtheta;

        const strokeStyle = options.separatorColor ? options.separatorColor : 'white';
        for (let command of commands) {
            createArc(c2d, {
                x: 2 * r + options.activePadding,
                y: 2 * r + options.activePadding,
            }, r, 2 * Math.PI - theta1, 2 * Math.PI - theta2, command.fillColor ? command.fillColor : options.fillColor,true, true, true, strokeStyle);
            theta1 += dtheta;
            theta2 += dtheta;
        }
        updateMenuItemPositions(baseGapPosition);

        // draw inner circle
        createArc(c2d, {
            x: 2 * r + options.activePadding,
            y: 2 * r + options.activePadding,
        }, rspotlight + options.spotlightPadding, 0, Math.PI * 2, 'white');
        clearArc(c2d, {
            x: 2 * r + options.activePadding,
            y: 2 * r + options.activePadding,
        }, rspotlight + options.spotlightPadding, 0, Math.PI * 2);
    }

    function queueDrawCommands(rx, ry, theta) {
        redrawQueue.drawCommands = [rx, ry, theta];
    }

    function drawCommands(rx, ry, theta) {
        const cx = 2 * r + options.activePadding;
        const cy = 2 * r + options.activePadding;

        const dtheta = 2 * Math.PI / commands.length;
        const baseTheta = startPoint + dtheta * activeCommandI;
        const nextTheta = baseTheta + dtheta;

        const startAngle = 2 * Math.PI - baseTheta;
        const endAngle = 2 * Math.PI - nextTheta;

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
        const radius = r + 10;
        const x1 = cx + radius * Math.cos(startAngle);
        const y1 = cy + radius * Math.sin(startAngle);
        const x2 = cx + radius * Math.cos(endAngle);
        const y2 = cy + radius * Math.sin(endAngle);

        clearLine(c2d, { x: cx, y: cy }, { x: x1, y: y1 }, options.separatorHoveredCommandsWidth, '', false);
        clearLine(c2d, { x: cx, y: cy }, { x: x2, y: y2 }, options.separatorHoveredCommandsWidth, '', false);

        // === 7. Clear indicator box (rotated square) ===
        const rsOffset = rs + options.spotlightPadding - options.indicatorSize / 4;
        const tx = cx + (rx / r) * rsOffset;
        const ty = cy + (ry / r) * rsOffset;
        const rot = Math.PI / 4 - theta;

        clearRect(c2d, {
            x: -options.indicatorSize / 2,
            y: -options.indicatorSize / 2,
        }, options.indicatorSize, options.indicatorSize, { x: tx, y: ty }, rot, '');

        clearArc(c2d, { x: cx, y: cy }, rs + options.spotlightPadding, 0, 2 * Math.PI, false, true, false);
    }

    // 绘制子菜单
    function queueDrawSubmenuBg(rx, ry, theta) {
        redrawQueue.drawSubmenuBg = [rx, ry, theta];
    }

    function drawSubmenuBg(rx, ry, theta) {
        const centerX = 2 * r + options.activePadding;
        const centerY = 2 * r + options.activePadding;

        const dtheta = 2 * Math.PI / commands.length;
        const ddtheta = dtheta / submenu_commands.length;

        let theta1 = startPoint + dtheta * activeCommandI;
        let theta2 = theta1 + dtheta;

        const radius = r + 10;

        const startAngle = 2 * Math.PI - theta1;
        const endAngle = 2 * Math.PI - theta2;

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
        const x1 = centerX + radius * Math.cos(startAngle);
        const y1 = centerY + radius * Math.sin(startAngle);
        const x2 = centerX + radius * Math.cos(endAngle);
        const y2 = centerY + radius * Math.sin(endAngle);

        clearLine(c2d, { x: centerX, y: centerY }, { x: x1, y: y1 }, options.separatorHoveredCommandsWidth, '', false);
        clearLine(c2d, { x: centerX, y: centerY }, { x: x2, y: y2 }, options.separatorHoveredCommandsWidth, '', false);

        // === Clear Rotated Indicator Box ===
        const tx = centerX + rx / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        const ty = centerY + ry / r * (rs + options.spotlightPadding - options.indicatorSize / 4);
        const rot = Math.PI / 4 - theta;

        c2d.globalCompositeOperation = 'destination-out';
        createRect(c2d, {
            x: -options.indicatorSize / 2,
            y: -options.indicatorSize / 2,
        }, options.indicatorSize, options.indicatorSize, { x: tx, y: ty }, rot, 'white');

        // === Clear Spotlight Ring ===
        createArc(c2d, {
            x: centerX,
            y: centerY,
        }, rs + options.spotlightPadding, 0, Math.PI * 2, 'white', true, true, false);

        // === Draw Submenu Ring Arc ===
        const mainRadius = r;
        const outerRadius = r * 1.55;
        const arcRadius = (outerRadius + mainRadius) / 2 + 15;
        const outerSide = 0.08;

        const arcStart = (2 * Math.PI - theta1) + outerSide;
        const arcEnd = (2 * Math.PI - theta2) - outerSide;

        clearArcWithStroke(c2d, { x: centerX, y: centerY }, arcRadius, outerRadius - mainRadius, arcStart, arcEnd);
        // === Draw filled arc (optional, only if you want a background fill)
        createArcWithStroke(c2d, {
            x: centerX,
            y: centerY,
        }, arcRadius, outerRadius - mainRadius, arcStart, arcEnd, options.fillColor);

        // === Draw border around arc (with thin stroke)
        createBorder(c2d,centerX,centerY,outerRadius + 14, arcStart, arcEnd,options.separatorColor ? options.separatorColor : 'white');

        // Outer border
        createBorder(c2d,centerX,centerY,radius + 5, arcStart, arcEnd,options.separatorColor ? options.separatorColor : 'white',1,false);

        // === Draw Submenu Separators ===
        let subTheta = startPoint + dtheta * activeCommandI;
        const separatorInnerRadius = arcRadius - (outerRadius - mainRadius) / 2;
        const separatorOuterRadius = arcRadius + (outerRadius - mainRadius) / 2;

        // Adjust the angles to match the arc borders
        const adjustedStartAngle = arcStart;
        const adjustedEndAngle = arcEnd;

        for (let i = 1; i < submenu_commands.length; i++) {
            subTheta += ddtheta;
            const angle = 2 * Math.PI - subTheta;

            const sepX1 = centerX + separatorInnerRadius * Math.cos(angle);
            const sepY1 = centerY + separatorInnerRadius * Math.sin(angle);

            const sepX2 = centerX + separatorOuterRadius * Math.cos(angle);
            const sepY2 = centerY + separatorOuterRadius * Math.sin(angle);

            const lineWidth = options.separatorWidth || 1;
            const strokeStyle = options.separatorColor || 'white';
            createLine(c2d, { x: sepX1, y: sepY1 }, { x: sepX2, y: sepY2 }, lineWidth, strokeStyle, false);
        }

        // === Draw Start Separator Line ===
        createLine(
            c2d,
            {
                x: centerX + separatorInnerRadius * Math.cos(adjustedStartAngle),
                y: centerY + separatorInnerRadius * Math.sin(adjustedStartAngle)
            },
            {
                x: centerX + separatorOuterRadius * Math.cos(adjustedStartAngle),
                y: centerY + separatorOuterRadius * Math.sin(adjustedStartAngle)
            },
            options.separatorWidth || 1,
            options.separatorColor || 'white',
            false
        );

        // === Draw End Separator Line ===
        createLine(
            c2d,
            {
                x: centerX + separatorInnerRadius * Math.cos(adjustedEndAngle),
                y: centerY + separatorInnerRadius * Math.sin(adjustedEndAngle)
            },
            {
                x: centerX + separatorOuterRadius * Math.cos(adjustedEndAngle),
                y: centerY + separatorOuterRadius * Math.sin(adjustedEndAngle)
            },
            options.separatorWidth || 1,
            options.separatorColor || 'white',
            false
        );
    }

    //绘制活动子菜单
    function queueDrawSubmenuCommands() {
        redrawQueue.drawSubmenuCommands = [];
    }

    function drawSubmenuCommands() {
        c2d.globalCompositeOperation = 'source-over';

        const dtheta = (2 * Math.PI) / commands.length;
        const ddtheta = dtheta / submenu_commands.length;

        // Compute angles for the active submenu command
        let theta1 = startPoint + dtheta * activeCommandI + ddtheta * activeSubCommandI;
        let theta2 = theta1 + ddtheta;

        const cx = 2 * r + options.activePadding;
        const cy = 2 * r + options.activePadding;
        const mainRadius = r;
        const outerRadius = r * 1.55;

        // Adjust drawing angles
        let startAngle = 2 * Math.PI - theta1;
        let endAngle = 2 * Math.PI - theta2;

        if (activeSubCommandI === 0) {
            startAngle += 0.08; // Slight adjustment for first item
        } else if (activeSubCommandI === submenu_commands.length - 1) {
            endAngle -= 0.08; // Slight adjustment for last item
        }

        // Set stroke color based on submenu command or fallback option
        let strokeStyle = options.activeFillColor;

        // Erase underlying content with stroke (cutout effect)
        clearArcWithStroke(c2d, {
            x: cx,
            y: cy,
        }, (outerRadius + mainRadius) / 2 + 15, outerRadius - mainRadius, startAngle, endAngle);

        // Restore standard drawing mode and redraw the arc
        createArcWithStroke(c2d, {
            x: cx,
            y: cy,
        }, (outerRadius + mainRadius) / 2 + 15, outerRadius - mainRadius, startAngle, endAngle, strokeStyle);
    }

    function updateActiveMenuItemPosition(offsetRadius = 0, angularOffset = 0) {
        const dtheta = 2 * Math.PI / commands.length;

        // Compute angles for the active command
        const theta1 = startPoint + angularOffset + dtheta * activeCommandI;
        const theta2 = theta1 + dtheta;
        const midtheta = (theta1 + theta2) / 2;

        // Compute new position
        const rx1 = 0.66 * (r + offsetRadius) * Math.cos(midtheta);
        const ry1 = 0.66 * (r + offsetRadius) * Math.sin(midtheta);

        // Update only the active item
        const activeItem = document.getElementById(`command-${activeCommandI}`);
        if (activeItem) {
            activeItem.style.marginLeft = (rx1 - r * 0.33) + 'px';
            activeItem.style.marginTop = (-ry1 - r * 0.33) + 'px';
        }

        commands.forEach((command, index) => command.hovered = (activeCommandI === index));
    }

    function updateMenuItemPositions(offsetRadius = 0, angularOffset = 0) {
        let dtheta = 2 * Math.PI / commands.length;
        let theta1 = startPoint + angularOffset;
        let theta2 = theta1 + dtheta;

        for (let i = 0; i < commands.length; i++) {
            if (i === activeCommandI) {
                theta1 += dtheta;
                theta2 += dtheta;
                continue;
            }

            let midtheta = (theta1 + theta2) / 2;

            let rx1 = 0.66 * (r + offsetRadius) * Math.cos(midtheta);
            let ry1 = 0.66 * (r + offsetRadius) * Math.sin(midtheta);

            let item = document.getElementById(`command-${i}`);
            if (item) {
                item.style.marginLeft = (rx1 - r * 0.33) + 'px';
                item.style.marginTop = (-ry1 - r * 0.33) + 'px';
            }

            theta1 += dtheta;
            theta2 += dtheta;
        }
    }

    function updatePixelRatio() {
        let pxr = getPixelRatio();
        let w = containerSize;
        let h = containerSize;

        canvas.width = w * pxr;
        canvas.height = h * pxr;

        canvas.style.width = w + 'px';
        canvas.style.height = h + 'px';

        c2d.setTransform(1, 0, 0, 1, 0, 0);
        c2d.scale(pxr, pxr);
    }

    let redrawing = true;
    let redrawQueue = {};

    let raf = (
        window.requestAnimationFrame
        || window.webkitRequestAnimationFrame
        || window.mozRequestAnimationFrame
        || window.msRequestAnimationFrame
        || (fn => setTimeout(fn, 16))
    );

    let redraw = () => {
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

    let ctrx, ctry, rs;

    let bindings = {
        on: function (events, selector, fn) {
            let _fn = fn;
            if (selector === 'core') {
                _fn = function (e) {
                    if (e.cyTarget === cy || e.target === cy)  // only if event target is directly core
                    {
                        return fn.apply(this, [e]);
                    }
                };
            }

            data.handlers.push({
                events: events,
                selector: selector,
                fn: _fn,
            });

            if (selector === 'core') {
                cy.on(events, _fn);
            } else {
                cy.on(events, selector, _fn);
            }
            return this;
        },
    };

    function addEventListeners() {
        let grabbable;
        let inGesture = false;
        let zoomEnabled;
        let panEnabled;
        let boxEnabled;
        let gestureStartEvent;

        let restoreZoom = () => {
            if (zoomEnabled) {
                cy.userZoomingEnabled(true);
            }
        };

        let restoreGrab = () => {
            if (grabbable) {
                target.grabify();
            }
        };

        let restorePan = () => {
            if (panEnabled) {
                cy.userPanningEnabled(true);
            }
        };

        let restoreBoxSeln = () => {
            if (boxEnabled) {
                cy.boxSelectionEnabled(true);
            }
        };

        let restoreGestures = () => {
            restoreGrab();
            restoreZoom();
            restorePan();
            restoreBoxSeln();
        };

        window.addEventListener('resize', updatePixelRatio);

        bindings
            .on('resize', () => {
                updatePixelRatio();
            })

            .on(options.openMenuEvents, options.selector, function (e) {
                target = this; // Remember which node the context menu is for
                let ele = this;
                let isCy = this === cy;

                if (inGesture) {
                    parent.style.display = 'none';

                    inGesture = false;

                    restoreGestures();
                }

                if (typeof options.commands === 'function') {
                    const res = options.commands(target);
                    if (res.then) {
                        res.then(_commands => {
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

                    let rp, rw, rh;
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
                        left: (rp.x - r) + 'px',
                        top: (rp.y - r) + 'px',
                    });
                    rs = Math.max(rw, rh) / 2;
                    rs = Math.max(rs, options.minSpotlightRadius);
                    rs = Math.min(rs, options.maxSpotlightRadius);
                    queueDrawBg();
                    activeCommandI = undefined;
                    inGesture = true;
                    gestureStartEvent = e;
                }
            })

            .on('tapdrag', options.selector = e => {
                if (!inGesture) {
                    return;
                }

                let origE = e.originalEvent;
                let isTouch = origE.touches && origE.touches.length > 0;
                let pageX = isTouch ? origE.touches[0].pageX : origE.pageX;
                let pageY = isTouch ? origE.touches[0].pageY : origE.pageY;

                activeCommandI = undefined;

                let dx = pageX - offset.left - ctrx;
                let dy = pageY - offset.top - ctry;

                if (dx === 0) {
                    dx = 0.01;
                }

                let d = Math.sqrt(dx * dx + dy * dy);

                let cosTheta = (dy * dy - d * d - dx * dx) / (-2 * d * dx);
                let theta = Math.acos(cosTheta);

                let rx = dx * r / d;
                let ry = dy * r / d;

                if (dy > 0) {
                    theta = Math.PI + Math.abs(theta - Math.PI);
                }

                let dtheta = 2 * Math.PI / (commands.length);
                let theta1 = startPoint;
                let theta2 = theta1 + dtheta;
                for (let i = 0; i < commands.length; i++) {
                    let command = commands[i];
                    if (command.submenu) {
                        submenu_commands = command.submenu;
                    } else {
                        submenu_commands = [];
                    }

                    let inThisCommand = theta1 <= theta && theta <= theta2
                        || theta1 <= theta + 2 * Math.PI && theta + 2 * Math.PI <= theta2;

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
                    if (d < rs + options.spotlightPadding || ((d > options.menuRadius) && !commands[activeCommandI].submenu)) {
                        queueDrawBg();
                        cancelActiveCommand();
                        return;
                    }

                    if (d > rs + options.spotlightPadding && (d < options.menuRadius)) {
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

                    if ((d < options.menuRadius + 160 && d > options.menuRadius) && commands[activeCommandI].submenu && commands[activeCommandI].hovered) {
                        showSubmenuContent(activeCommandI);
                        submenu_commands = commands[activeCommandI].submenu;
                        queueDrawBg();
                        // Judge which submenu used
                        let ddtheta = dtheta / submenu_commands.length;
                        let theta1 = startPoint;
                        let theta2 = theta1 + ddtheta;
                        theta1 += dtheta * activeCommandI;
                        theta2 += dtheta * activeCommandI;
                        for (let i = 0; i < submenu_commands.length; i++) {
                            let submenu_command = commands[activeCommandI].submenu[i];
                            let inThisSubMenuCommand = theta1 <= theta && theta <= theta2
                                || theta1 <= theta + 2 * Math.PI && theta + 2 * Math.PI <= theta2;
                            if (submenu_command.enabled === false) {
                                inThisSubMenuCommand = false;
                                activeSubCommandI = undefined;
                            }
                            if (inThisSubMenuCommand) {
                                activeSubCommandI = i;
                                break;
                            }
                            theta1 += ddtheta;
                            theta2 += ddtheta;
                        }

                        queueDrawSubmenuBg(rx, ry, theta);
                        queueDrawSubmenuCommands();
                        return;
                    }
                }

                cancelActiveCommand();
                queueDrawBg();
            })

            .on('tapend', function () {
                parent.style.display = 'none';
                if (activeCommandI !== undefined) {
                    let select = commands[activeCommandI].select;
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
        let cxtmenu_submenus = document.getElementsByClassName('cxtmenu-submenu-content');
        for (let cxtmenu_submenu of cxtmenu_submenus) {
            setStyles(cxtmenu_submenu, {
                display: 'none',
            });
        }
    }

    function showSubmenuContent(i) {
        let cxtmenu_submenus = document.getElementsByClassName(`cxtmenu-${i}-submenu-content`);
        for (let cxtmenu_submenu of cxtmenu_submenus) {
            setStyles(cxtmenu_submenu, {
                display: 'table-cell',
            });
        }
    }

    function removeEventListeners() {
        for (let h of data.handlers) {
            if (h.selector === 'core') {
                cy.off(h.events, h.fn);
            } else {
                cy.off(h.events, h.selector, h.fn);
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
        destroy: () => destroyInstance(),
    };

};

module.exports = cxtmenu;

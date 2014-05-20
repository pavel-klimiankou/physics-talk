window.core = (function () {
    var
        createRenderer = function (viewport) {
            var screenX = viewport.x,
                screenY = viewport.y,
                screenWidth = viewport.width,
                screenHeight = viewport.height,
                k = viewport.scale,
                paper = Raphael(screenX, screenY, screenWidth, screenHeight),
                knownShapes = {},
                translate = function (param) {
                    return param * k;
                },
                translateX = function (x) {
                    return screenWidth/2 + translate(x);
                },
                translateY = function (y) {
                    return screenHeight/2 - translate(y);
                },
                rotateShape = function (shape, angle, x, y) {
                    return shape.transform([
                        "R" + -(angle * 180 / Math.PI), x, y
                    ].join(","));
                },
                fillStyle = {
                    fill: "#fff",
                    "fill-opacity": 0.6
                },
                strokeStyle = {
                    stroke: "#fff",
                    "stroke-width": 2
                },
                applyCustomStyles = function (renderedShape, shape) {
                    if (shape.__fill) {//dirty hack
                        renderedShape.attr({ fill: shape.__fill });
                    }
                    return renderedShape;
                },
                renderers = {
                    Rectangle: function (existingShape, shape, body) {
                        var
                            w = translate(shape.width),
                            h = translate(shape.height),
                            cx = translateX(body.position[0]),
                            cy = translateY(body.position[1]),
                            x = cx - w / 2,
                            y = cy - h / 2;

                        if (!existingShape) {
                            existingShape = paper.rect(x, y, w, h).attr(fillStyle).attr(strokeStyle);
                            applyCustomStyles(existingShape, shape);
                        } else {
                            existingShape.attr({
                                x: x,
                                y: y
                            });
                        }

                        if (body.angle) {
                            rotateShape(existingShape, body.angle, cx, cy);
                        }

                        return existingShape;
                    },
                    Convex: function (existingShape, shape, body) {
                        var cx = translateX(body.position[0]).toFixed(2),
                            cy = translateY(body.position[1]).toFixed(2),
                            px = translateX(body.previousPosition[0]).toFixed(2),
                            py = translateY(body.previousPosition[1]).toFixed(2),
                            path;

                        path = "M" + shape.vertices.map(function (f32Array) {
                            return translateX(body.position[0] + f32Array[0])
                                + ","
                                +  (translateY(body.position[1] + f32Array[1]));
                        }).join("L") + "Z";

                        if (!existingShape) {
                            existingShape = paper.path(path).attr(fillStyle).attr(strokeStyle);
                            applyCustomStyles(existingShape, shape);
                        } else if (cx !== px || cy !== py) {
                            console.log("path: ", path);
                            existingShape.attr("path", path);
                        }


                        if (body.angle) {
                            rotateShape(existingShape, body.angle, cx, cy);
                        }
                        return existingShape;
                    },
                    Circle: function (existingShape, shape, body) {
                        var x = translateX(body.position[0]),
                            y = translateY(body.position[1]),
                            r = translate(shape.radius),
                            attribs = {
                                x: x,
                                y: y,
                                cx: x,
                                cy: y,
                                r: r
                            },
                            set;

                        if (existingShape) {
                            existingShape.attr(attribs);
                        } else {
                            set = paper.set();
                            set.push(paper.circle(attribs.cx, attribs.cy, attribs.r).attr(fillStyle).attr(strokeStyle));
                            set.push(paper.rect(attribs.x, attribs.y, attribs.r, 1).attr(strokeStyle));
                            applyCustomStyles(set.items[0], shape);
                            existingShape = set;
                        }

                        if (body.angle) {
                            rotateShape(existingShape.items[1], body.angle, attribs.cx, attribs.cy);
                        }

                        return existingShape;
                    },
                    Plane: function (existingShape, shape, body) {

                        return existingShape || (function () {
                            var
                                cx = translateX(body.position[0]),
                                cy = translateY(body.position[1]),
                                width = Math.max(screenWidth, screenHeight) * 1.2,
                                height = 2;

                            return rotateShape(paper.rect(cx - width / 2, cy - height / 2, width, height).attr(strokeStyle), body.angle, cx, cy);
                        })();
                    }
                },
                getShapeRenderer = function (shape) {
                    var renderer = Object.keys(renderers).reduce(function (foundRenderer, currentRenderer) {
                        return foundRenderer || (shape instanceof p2[currentRenderer] && renderers[currentRenderer]);
                    }, null);

                    if (!renderer) {
                        throw new Error("Unknown shape: " + shape.constructor.toString());
                    }

                    return renderer;
                },
                getShapeId = function (body, shapeIndex) {
                    return "shape_" + body.id + '_' + shapeIndex;
                },
                drawGrid = function(){
                    var colors = ["rgb(106, 125, 197)", "rgb(76, 98, 186)"], x, step = 10, y,
                        colorIndex = 0;

                    for(x = step; x < screenWidth; x += step){
                        colorIndex = colorIndex % 2;
                        paper.rect(x, step, 1, screenHeight - 2 * step).attr({
                            stroke: "none",
                            fill: colors[colorIndex]
                        });
                        colorIndex += 1;
                    }

                    colorIndex = 0;
                    for(y = step; y < screenHeight; y+=step){
                        colorIndex = colorIndex % 2;
                        paper.rect(step, y, screenWidth - 2*step, 1).attr({
                            "stroke": "none",
                            fill: colors[colorIndex]
                        });
                        colorIndex += 1;
                    }
                };

            drawGrid();

            return {
                render: function (bodies) {
                    bodies.forEach(function (body) {
                        body.shapes.forEach(function (shape, itemIndex) {
                            var shapeId = getShapeId(body, itemIndex);
                            knownShapes[shapeId ] = getShapeRenderer(shape)(knownShapes[shapeId], shape, body);
                        });
                    });
                }
            };
        },
        addSurroundingPlanes = function (world, minX, maxX, minY/*, maxY*/) {
            var plane = new p2.Plane(),
                bottomLine = new p2.Body( { position: [0, minY * 0.80]}),
                leftSide = new p2.Body({
                    angle: 3 * Math.PI / 2,
                    position: [minX, 0]
                }),
                rightSide = new p2.Body( {
                    angle: Math.PI / 2,
                    position: [maxX, 0]
                });

            bottomLine.addShape(plane);
            world.addBody(bottomLine);

            rightSide.addShape(plane);
            world.addBody(rightSide);

            leftSide.addShape(plane);
            world.addBody(leftSide);

            return [rightSide, bottomLine, leftSide];
        },
        createViewport = function () {
            var x = 0, y = 0,
                availWidth = window.innerWidth - x - 2,
                availHeight = window.innerHeight - y - 2,
                w = availWidth,
                config = /scale=(\d+)x(\d+)/ig.exec(window.location.search),
                kw = config && +config[1],
                kh = config && +config[2],
                h = availHeight;

            if (kw && kh) {
                h = w / kw * kh;
                if (h > availHeight) {
                    h = availHeight;
                    w = availHeight / kh * kw;
                }
                y = (availHeight - h) / 2;
                x = (availWidth - w) / 2;
            } else {
                h = availHeight;
            }

            return {
                x: x,
                y: y,
                width: w,
                height: h,
                scale: h / 20
            };
        },
        initializers = (function () {
            var callbacks = [],
                self;

            return self = {
                push: function (callback) {
                    callbacks.push(callback);
                },
                go: function () {
                    var env = {},
                        demoViewport = createViewport(),
                        execInitializer = function (initializer) {
                            initializer(env);
                        };

                    env.minX = -demoViewport.width / 2 / demoViewport.scale;
                    env.maxX = -env.minX;
                    env.minY = -demoViewport.height / 2 / demoViewport.scale;
                    env.maxY = -env.minY;

                    env.renderer = createRenderer(demoViewport);

                    env.addSurroundingPlanes = function (world) {
                        return addSurroundingPlanes(world, env.minX, env.maxX, env.minY)
                    };

                    self.push = execInitializer;

                    while (callbacks.length) {
                        execInitializer(callbacks.shift());
                    }
                }
            };
        })();


    document.addEventListener("DOMContentLoaded", function() {
        initializers.go();
    });

    return function (callback) {
        return initializers.push(callback);
    };
})();

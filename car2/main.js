core(function (env) {
    var createVehicle = function (world) {
            var chassisBody = new p2.Body({ mass : 1, position: [env.minX + 5, 8] })
                , chassisShape = new p2.Rectangle(5, 2.0)
                , wheelBody1 = new p2.Body({ mass : 0.9, position:[chassisBody.position[0] - 2.5, chassisBody.position[1] - 1] })
                , wheelBody2 = new p2.Body({ mass : 2, position:[chassisBody.position[0] + 2.5, chassisBody.position[1] - 1] })
                , wheelShape = new p2.Circle(1)
                , localChassisPivot1 = [-2.5, -1.0]
                , localChassisPivot2 = [ 2.5, -1.0]
                , localWheelPivot = [0, 0]
                , revoluteBack = new p2.RevoluteConstraint(
                    chassisBody, localChassisPivot1,
                    wheelBody1, localWheelPivot,
                    { collideConnected: false }
                )
                , revoluteFront = new p2.RevoluteConstraint(
                    chassisBody, localChassisPivot2,
                    wheelBody2, localWheelPivot,
                    { collideConnected: false }
                )
                ;


            wheelShape.__fill = "#00F";

            chassisBody.addShape(chassisShape);
            world.addBody(chassisBody);

            wheelBody1.addShape(wheelShape);
            wheelBody2.addShape(wheelShape);
            world.addBody(wheelBody1);
            world.addBody(wheelBody2);

            world.addConstraint(revoluteBack);
            world.addConstraint(revoluteFront);

            revoluteBack.enableMotor();
            revoluteBack.setMotorSpeed(15);
        },
        createWorld = function () {
            var world = new p2.World( { broadphase : new p2.SAPBroadphase() } )
                , trampoline = new p2.Body({ position: [-9, 0], mass: 100 })
				;

            world.defaultContactMaterial.friction = 10;

            createVehicle(world);

            env.addSurroundingPlanes(world);

            trampoline.fromPolygon([
                  [-3, 0]
                , [3, 1]
                , [4, 5.5]
            ]);
            trampoline.shapes[0].__fill = "#FF0";
            world.addBody(trampoline);

            [4, 12, 14].forEach(function (x, colIndex) {
                [-6, -4, -2].concat(colIndex ? [0, 2, 4] : []).forEach(function (y) {
                    var body = new p2.Body({ position: [x, y], mass: 0.1 })
                        , rect = new p2.Rectangle(2, 2);

                    rect.__fill = "#0F0";
                    body.addShape(rect);
                    world.addBody(body);
                });
            });

            return world;
        },

        world = createWorld(),
        animate = function () {
            requestAnimationFrame(animate);
            world.step(1/60);
            env.renderer.render(world.bodies);
        };

    animate();
});

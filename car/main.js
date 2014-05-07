core(function (env) {
    var createWorld = function () {
            var world = new p2.World( { broadphase : new p2.SAPBroadphase() } )
				, chassisBody = new p2.Body({ mass : 1, position: [env.minX + 5, 1] })
				, chassisShape = new p2.Rectangle(5, 2.5)
				, wheelBody1 = new p2.Body({ mass : 1, position:[chassisBody.position[0] - 2.5, 3.5] })
				, wheelBody2 = new p2.Body({ mass : 1, position:[chassisBody.position[0] + 2.5, 3.5] })
				, wheelShape = new p2.Circle(1)
				, localChassisPivot1 = [-2.5, -1.3]
				, localChassisPivot2 = [ 2.5, -1.3]
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
			world.defaultContactMaterial.friction = 10;
			
			chassisBody.addShape(chassisShape);
			world.addBody(chassisBody);

            env.addSurroundingPlanes(world);

			wheelBody1.addShape(wheelShape);
			wheelBody2.addShape(wheelShape);
			world.addBody(wheelBody1);
			world.addBody(wheelBody2);

			world.addConstraint(revoluteBack);
			world.addConstraint(revoluteFront);

			revoluteBack.enableMotor();
			revoluteBack.setMotorSpeed(10);

			[0, 2, 3, 6, 7, 9, env.maxX - 2, env.maxX - 1].forEach(function (x) {
				var bumpShape = new p2.Rectangle(1.5, 0.5)
					, bumpBody = new p2.Body({ position: [x - 5, x], mass: 5})

                bumpShape.__fill = "#0F0";
				bumpBody.addShape(bumpShape);
				world.addBody(bumpBody);
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

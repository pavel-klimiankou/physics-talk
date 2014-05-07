core(function (env) {
    var createWorld = function () {
            var world = new p2.World()
                , circleShape = new p2.Circle(3)
                , slipperyShape = new p2.Circle(3)
                , circleMaterial = new p2.Material()
                , slipperyMaterial = new p2.Material()
                , planeMaterial = new p2.Material()
                , circleBody = new p2.Body({ mass: 2, position: [1, 2.5]})
                , slipperyBody = new p2.Body({ mass: 2, position: [-7, 2.5]})
                , normalContactMaterial
                , slipperyContactMaterial
                , planes
                ;

			slipperyShape.material = slipperyMaterial;
			circleShape.material = circleMaterial;
			planes = env.addSurroundingPlanes(world);
			planes[1].angle = -Math.PI / 32;
			planes.forEach(function (planeBody) {
				planeBody.shapes[0].material = planeMaterial;
			});


			var boxShape = new p2.Rectangle(4, 2.2),
				boxBody = new p2.Body({ mass: 1, angle: Math.PI / 2, position: [-14, 1.5]});

			boxShape.material = slipperyMaterial;

			boxBody.addShape(boxShape);

			world.addBody(boxBody);

			circleBody.addShape(circleShape);
			world.addBody(circleBody);

			slipperyBody.addShape(slipperyShape);
			world.addBody(slipperyBody);

			normalContactMaterial = new p2.ContactMaterial(planeMaterial, circleMaterial, {
				friction: 0.3,
			});

			world.addContactMaterial(normalContactMaterial);

			slipperyContactMaterial = new p2.ContactMaterial(planeMaterial, slipperyMaterial, {
				friction : 0.0,
			});

			world.addContactMaterial(slipperyContactMaterial);

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

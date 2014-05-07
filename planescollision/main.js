core(function (env) {
    var createWorld = function () {
		var world = new p2.World({ gravity: [0, -10] }),
			circleShape = new p2.Circle(2),
			circleBody = new p2.Body({ mass: 3, position: [0, env.maxY - 1] });

			circleBody.addShape(circleShape);
			world.addBody(circleBody);

			circleShape = new p2.Circle(3);
			circleBody = new p2.Body({ mass: 1.5, position: [4, 3] });
			circleBody.addShape(circleShape);
			world.addBody(circleBody);

			env.addSurroundingPlanes(world);

            return world;
		},
        world = createWorld(),
        animate = function () {
            requestAnimationFrame(animate);
            world.step(1/60);
            env.renderer.render(world.bodies);
        };

		//Surprise!
		setTimeout(function () {
			world.gravity = [1, 4];
		}, 5000);

    animate();
});

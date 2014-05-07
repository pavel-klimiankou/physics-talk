core(function (env) {
    var createWorld = function () {
		var world = new p2.World(),
			circleBody = new p2.Body({ mass: 1, position: [0, env.maxY - 1] });

		circleBody.addShape(new p2.Circle(2));
		world.addBody(circleBody);

		return world;
	},
	animate = function () {
		requestAnimationFrame(animate);
		world.step(1/60);
		env.renderer.render(world.bodies);
	},
	world = createWorld();
		
	animate();
});

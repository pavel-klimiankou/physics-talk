core(function (env) {
    var createWorld = function () {
            var world = new p2.World({ gravity: [0, -10] })
                , i
                , j
                , rows = 6 
                , cols = 10 
                , sideX = 1 
                , sideY = 1
                , fromX = env.minX + (env.maxX - env.minX) * 0.4
                , fromY
                , boxShape
                , boxBody
                , planes = env.addSurroundingPlanes(world)
                ;

            fromY = planes[1].position[1] + sideY / 2;

			for (i = 0; i < cols; i++) {
				for (j = 0; j < rows; j++) {
					boxBody = new p2.Body({ mass: 0.2, position: [fromX + i * sideX * 1.05, fromY + j * sideY] });
					boxBody.addShape(new p2.Rectangle(sideX, sideY));

					world.addBody(boxBody);
				}
			}

			var bulletsAllowed = 10,
				bulletRadius = 0.5,
				createBullet = function () {
					var 
						bulletShape = new p2.Circle(bulletRadius),
						bulletBody = new p2.Body({ mass: 1, position: [env.minX + bulletRadius * 2, fromY + rows / 4 * sideY], velocity: [100, 0]})

					bulletShape.__fill = "#F00";
					bulletBody.addShape(bulletShape);
					world.addBody(bulletBody);

					if (--bulletsAllowed) {
						setTimeout(createBullet, 1000);
					}
				};

			setTimeout(createBullet, 1000);

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

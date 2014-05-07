core(function (env) {
    var createWorld = function () {
            var world = new p2.World({ gravity: [0, -10] })
                , i
                , j
                , rows = 10
                , cols = 6
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

			setTimeout(function () {
				var explosionShape = new p2.Circle(.5),
					explosionBody = new p2.Body({ mass: 100, position: [fromX + (cols / 2 - 0.5) * sideX, fromY], velocity: [0, 100]})

				explosionShape.__fill = "#F00";
				explosionBody.addShape(explosionShape);
				world.addBody(explosionBody);


			}, 2000);

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

core(function (env) {
    var createWorld = function () {
            var world = new p2.World({ gravity: [0, -10] })
                , i
                , cols = 10
                , sideX = 2
                , fromX = env.minX + (env.maxX - env.minX - cols * sideX) / 2
                , fromY
                , boxBody
                , planes = env.addSurroundingPlanes(world)
                , previousBox
                , constraint
                ;

            fromY = planes[1].position[1] + 14;

			for (i = 0; i < cols; i++) {
                boxBody = new p2.Body({ mass: 0.1, position: [fromX + i * sideX * 1.05, fromY] });
                boxBody.addShape(new p2.Circle(sideX / 2));

				if (previousBox) {
					constraint = new p2.DistanceConstraint(previousBox, boxBody, sideX);
					world.addConstraint(constraint);
				}

				previousBox = boxBody;

                world.addBody(boxBody);
            }

            [2, 6].map(function (col) {
            	return fromX + col * sideX;
            }).forEach(function (x) {
            	var height = 8,
					colShape = new p2.Rectangle(2, height),
            		colBody = new p2.Body({ mass: 6, position: [x, planes[1].position[1] + height / 2 ] });

                    colShape.__fill = "#FF0";
				colBody.addShape(colShape);
				world.addBody(colBody);

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

core(function (env) {
    var createWorld = function () {
            var world = new p2.World({ gravity: [0, -10] })
                , rows = 10
                , sideX = 1 
                , sideY = 1
                , planes = env.addSurroundingPlanes(world)
				, fromY = planes[1].position[1] + (rows) * sideX * 1.05
                , constraints = []
                ;

                var createChain = function (fromX) {
					var i
						, boxBody
						, previousBox
						, constraint
						, firstCircle
						;
					for (i = 0; i < rows; i++) {
						boxBody = new p2.Body({ mass: !i ? 0 : 1, position: [fromX, fromY - i * sideX]});
						boxBody.addShape(new p2.Circle(sideX / 2));

						if (previousBox) {
							constraint = new p2.DistanceConstraint(previousBox, boxBody, sideY);
							world.addConstraint(constraint);
							constraints.push(constraint);
						} else {
							firstCircle = boxBody;
						}

						previousBox = boxBody;

						world.addBody(boxBody);
					}
                };

                [0, 3, 7].forEach(createChain);

			var bulletsAllowed = 5,
				bulletRadius = 0.5,
				createBullet = function () {
					var 
						bulletShape = new p2.Circle(bulletRadius),
						bulletBody = new p2.Body({ mass: 2.5, position: [env.minX + bulletRadius * 2, fromY - rows / 2 * sideX],
							velocity: [150 - 25 * bulletsAllowed, - 1 + (5 - bulletsAllowed) * 2]
						})

					bulletShape.__fill = "#F00";
					bulletBody.addShape(bulletShape);
					world.addBody(bulletBody);

					if (--bulletsAllowed) {
						setTimeout(createBullet, 1500);
					}
				};

			setTimeout(createBullet, 1500);

			world.on("postStep",function(evt){
				var i, c, eqs;

				for(i = 0; i < constraints.length; i++) {
					c = constraints[i];
					eqs = c.equations;

					if(Math.abs(eqs[0].multiplier) > 2000) {
						world.removeConstraint(c);
						constraints.splice(constraints.indexOf(c),1);
					}
				}
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

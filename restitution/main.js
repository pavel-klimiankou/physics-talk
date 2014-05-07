core(function (env) {
    var createWorld = function () {
            var world = new p2.World({ gravity: [0, -10] })
                , box1Shape = new p2.Rectangle(6, 2)
                , box1Body
                , box2Shape = new p2.Rectangle(6, 2)
                , box2Body
                , planeMaterial = new p2.Material()
                , contactMaterial
                ;

            box1Shape.material = new p2.Material();
            box1Body = new p2.Body({ mass: 1, position: [-5, 5], angularVelocity: .5 });
            box1Body.addShape(box1Shape);
            world.addBody(box1Body);

            box2Shape.material = new p2.Material();
            box2Body = new p2.Body({ mass: 1, position: [+5, 5], angularVelocity: -.5 });
            box2Body.addShape(box2Shape);
            world.addBody(box2Body);


            env.addSurroundingPlanes(world).forEach(function (plane) {
            	plane.shapes[0].material = planeMaterial;
            });

            contactMaterial = new p2.ContactMaterial(planeMaterial, box1Shape.material, {
            	restitution: 0.0,
            	stiffness: 200,
            	relaxation: 0.1
            });
            world.addContactMaterial(contactMaterial);

            contactMaterial = new p2.ContactMaterial(planeMaterial, box2Shape.material, {
            	restitution: 0.0,
            	stiffness: 200,
            	relaxation: 0.9
            });
            world.addContactMaterial(contactMaterial);


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

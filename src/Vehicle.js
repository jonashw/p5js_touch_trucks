function createVehicle(startingPosition){
    var v = {
        position: startingPosition,
        headingAngle: 0,
        stearingAngle: 0,
        velocity: 0,
        color: color(105,255,80),
        maxStearingAngleMagnitude: 25,
        stearingIncrement: 2,
        acceleration: 0,
        accelerationIncrement: 0.1,
        maxAcceleration: 0.5,
        maxVelocity: 5
    };
    function updateStearingAngle(increment){
        let vel = abs(v.velocity);
        if(0 <= vel && vel <= 0.2){
            return;
        }
        v.headingAngle += increment;
        v.stearingAngle = constrain(
            v.stearingAngle + increment,
            -v.maxStearingAngleMagnitude,
            v.maxStearingAngleMagnitude);
    }
    function deccelerate(incr){
        if(v.velocity > 0     ){ v.acceleration = Math.max(-incr, -v.maxAcceleration); }
        else if(v.velocity < 0){ v.acceleration = Math.min( incr,  v.maxAcceleration); }
    }
    function accelerate(incr){
        v.acceleration = 
            incr > 0
                ? Math.min(incr,  v.maxAcceleration)
                : Math.max(incr, -v.maxAcceleration);
    }
    v.update = () => {
        var forward = keyIsDown(UP_ARROW);
        var reverse = keyIsDown(DOWN_ARROW);
        var breaks = keyIsDown(32 /*Spacebar */);
        if(forward){
            accelerate(v.accelerationIncrement);
        } else if(reverse){
            accelerate(-v.accelerationIncrement);
        } else if(breaks){
            deccelerate(2*v.accelerationIncrement);
        } else {
            deccelerate(v.accelerationIncrement/2);
        }
        if(keyIsDown(RIGHT_ARROW)){
            updateStearingAngle(v.stearingIncrement);
        } else if(keyIsDown(LEFT_ARROW)){
            updateStearingAngle(-v.stearingIncrement);
        } else {
            v.stearingAngle = 0;
        }
        v.velocity = Math.min(v.velocity + v.acceleration, v.maxVelocity);
        let dx = v.velocity * cos(v.headingAngle);
        let dy = v.velocity * sin(v.headingAngle);
        v.position.x += dx;
        v.position.y += dy;
    };
    function drawWheel(x,y,stearing){
        push();
        translate(x,y);
        if(stearing){
            rotate(v.stearingAngle);
        }
        fill(0);
        rect(0,0,20,10);
        pop();
    }
    v.draw = () => {
        push();
        noStroke();
        fill(v.color);
        translate(
            v.position.x,
            v.position.y);
        rotate(v.headingAngle);
        drawWheel(-15, 15,false);
        drawWheel(-15,-15,false);
        drawWheel(15, 15,true);
        drawWheel(15,-15,true);
        rect(0, 0, 50, 30);
        pop();
    };
    return v;
}
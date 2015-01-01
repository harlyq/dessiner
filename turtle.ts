function copy(a) {
    var b = {}
    for (var key in a)
        b[key] = a[key];
    return b;
}

function Turtle(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.reset();
}

Turtle.prototype.reset = function() {
    this.style = {
        x: 0,
        y: 0,
        rot: 0, // clockwise degrees, 0 is north
        width: 1,
        pen: true,
        distance: 10, // pixels
        angle: 10, // degrees
        color: 'black'
    };

    this.memory = [];
}

Turtle.prototype.draw = function(commands) {
    var cx = this.canvas.width / 2,
        cy = this.canvas.height / 2,
        style = this.style,
        ctx = this.ctx;

    ctx.lineWidth = style.lineWidth;
    ctx.strokeStyle = style.color;

    ctx.beginPath();
    ctx.moveTo(cx, cy);

    for (var i = 0; i < commands.length; ++i) {
        var c = commands[i];

        switch (c) {
            case 'f':
            case 'b':
                var d = (c === 'f' ? style.distance : -style.distance);

                style.x += d * Math.sin(style.rot / 180 * Math.PI);
                style.y -= d * Math.cos(style.rot / 180 * Math.PI);

                if (style.pen)
                    ctx.lineTo(~~(cx + style.x), ~~(cy + style.y));
                else
                    ctx.moveTo(~~(cx + style.x), ~~(cy + style.y));

                break;

            case '-':
            case '+':
                style.rot += (c === '-' ? -style.angle : style.angle);
                break;

            case '[':
                this.memory.push(copy(style));
                break;

            case ']':
                if (this.memory.length === 0)
                    break;

                style = this.style = this.memory.pop();
                ctx.moveTo(cx + style.x, cy + style.y);
                break;

                // case '-':
                // case '+':
                //     ctx.stroke();
                //     style.width += (c === '+' ? 1 : (style.width > 1 ? -1 : 0));
                //     ctx.lineStyle = style.width;
                //     ctx.beginPath();
                //     break;

            case 'u':
                style.pen = false;
                break;

            case 'd':
                style.pen = true;
                break;
        }
    }

    ctx.stroke();
}

Turtle.prototype.clear = function() {
    var w = this.canvas.width,
        h = this.canvas.height,
        ctx = this.ctx;

    ctx.clearRect(0, 0, w, h);

    this.reset();
}

import React, {MouseEventHandler, useEffect, useRef, useState} from 'react';
import './App.css';

type TWeapon = {
    type: 0 | 1 | 2 | 3;
    speed: number;
    quantity: number;
    aim: boolean;
    power: number
}

class Shoot {
    private static q: number = 0;
    x: number;
    y: number;
    width: number;
    height: number;
    id: number;
    blink: boolean;
    speed: number;
    power: number;
    quantity: number;

    constructor(x: number, y: number, weapon: TWeapon) {
        this.x = x - 2;
        this.y = y;
        this.width = 4;
        this.height = 20;
        this.id = Shoot.q++;
        this.blink = false;
        this.speed = weapon.speed;
        this.power = weapon.power;
        this.quantity = weapon.quantity;
    }

    moveUp() {
        this.y = this.y - this.speed;
        this.blink = !this.blink;
    }

    getColor(type: number) {
        switch (type) {
            case 0: return '#63ff33'
            case 1: return '#AAff33'
            case 2: return '#e6ff45'
            case 3: return '#FFFF00'
            case 4: return '#FFBB33'
            case 5: return '#FF0000'
            default: return '#a66eff'
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.blink ? '#EDFDEF' : this.getColor(this.power)
        ctx.shadowColor = this.getColor(this.quantity)
        ctx.shadowBlur = 10;

        ctx.fillRect(this.x, this.y, this.width, this.height)
        ctx.fillStyle = this.getColor(this.speed)
        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
        ctx.fillRect(this.x + 1, this.y, this.width / 2, this.height - (this.height / 4))
    }
}

class Pod {
    x: number;
    y: number;
    width: number;
    height: number;
    weapon: TWeapon

    constructor() {
        this.x = 180;
        this.y = 342;
        this.width = 40;
        this.height = 8;
        this.weapon = {
            type: 0,
            speed: 1,
            quantity: 1,
            aim: false,
            power: 1
        }
    }

    getPower() {
        const power = (this.weapon.type + this.weapon.power + this.weapon.type + this.weapon.speed)/4
        if(power >= 4) {
            this.weapon.type = 3
        }
        return power
    }

    upgrade(type: number) {
        switch (type) {
            case 0:
                this.weapon.speed++
                break;
            case 1:
                this.weapon.quantity++
                break;
            case 2:
                if (this.weapon.type < 2) {
                    this.weapon.type++
                }
                break;
            case 3:
                this.weapon.aim = !this.weapon.aim;
                break;
            case 4:
                if (this.weapon.power < 5) {
                    this.weapon.power++
                }
                break;
        }
    }

    resetWeapon() {
        const {type, speed, quantity, power} = this.weapon
        this.weapon = {
            // @ts-ignore
            type: type > 0 ? type - 1 : type,
            speed: speed > 1 ? speed - 1 : 1,
            quantity: quantity > 1 ? quantity - 1 : 1,
            aim: false,
            power: power > 1 ? power - 1 : 1
        }
    }

    setX(x: number) {
        this.x = x - (this.width / 2);
    }

    setWeaponType(type: 0 | 1 | 2) {
        this.weapon.type = type;
    }

    setWeaponSpeed(speed: number) {

    }

    setWeaponQuantity(quantity: number) {

    }

    setWidth(width: number) {
        this.width = width;
    }

    getColor(color: string) {

        const modifier = Math.floor(this.getPower()*30)

        let r, g, b;

        r = parseInt(color.substring(1,3),16) + modifier
        g = parseInt(color.substring(3,5),16) - (modifier*2)
        b = parseInt(color.substring(5,7),16) + modifier

        if (r > 200) {
            r = 200;
        }
        if (g < 20) {
            g = 20;
        }
        if (b > 255) {
            b = 255;
        }

        return `#${r.toString(16) + g.toString(16) + b.toString(16)}`.substring(0,7)
    }

    draw(ctx: CanvasRenderingContext2D) {


        ctx.fillStyle = this.getColor("#63ff33")

        if(this.weapon.type == 3) {
            ctx.shadowColor = "#61edff";
            ctx.shadowBlur = this.getPower();
        }

        ctx.beginPath()
        // @ts-ignore
        ctx.roundRect(this.x, this.y, this.width, this.height, 3)
        ctx.fill()
        ctx.closePath()

        switch (this.weapon.type) {
            case 0: ctx.fillRect(this.x + 18, this.y-3, 4, this.height + 2)
                break;
            case 1:
                ctx.fillRect(this.x, this.y-3, 4, this.height + 2)
                ctx.fillRect(this.x + 36, this.y-3, 4, this.height + 2)
                break
            case 2:
                ctx.fillRect(this.x + 18, this.y-5, 4, this.height + 2)
                ctx.fillRect(this.x, this.y-3, 4, this.height + 2)
                ctx.fillRect(this.x + 36, this.y-3, 4, this.height + 2)
                break
            case 3:

                ctx.fillStyle = "#ff2f00"
                ctx.fillRect(this.x + 18, this.y-5, 4, this.height + 2)
                ctx.fillRect(this.x, this.y-3, 4, this.height + 2)
                ctx.fillRect(this.x + 36, this.y-3, 4, this.height + 2)

                ctx.beginPath()
                ctx.moveTo(this.x, this.y+5)

                ctx.lineTo(this.x + 5, this.y-2)
                ctx.lineTo(this.x + 5, this.y+5)

                ctx.lineTo(this.x + this.width/2, this.y-5)

                ctx.lineTo(this.x + this.width - 5, this.y+5)
                ctx.lineTo(this.x + this.width - 5, this.y-2)
                ctx.lineTo(this.x + this.width, this.y+5)

                ctx.fill()
                ctx.closePath()

                ctx.beginPath()
                ctx.fillStyle = "#61edff"
                ctx.ellipse(this.x + this.width/2, this.y+1, 2, 4, 0, 0, 360)
                ctx.fill()
                ctx.closePath()
        }
        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
    }

    shoot(objects: Shoot[]) {

        switch (this.weapon.type) {
            case 0:
                objects.push(new Shoot(this.x + this.width / 2, this.y, this.weapon))
                break;
            case 1:
                objects.push(new Shoot(this.x, this.y, this.weapon))
                objects.push(new Shoot(this.x + this.width, this.y, this.weapon))
                break;
            case 2:
                objects.push(new Shoot(this.x + this.width / 2, this.y, this.weapon))
                objects.push(new Shoot(this.x, this.y, this.weapon))
                objects.push(new Shoot(this.x + this.width, this.y, this.weapon))
                break;
            case 3:
                objects.push(new Shoot(this.x + this.width / 2, this.y, this.weapon))
                objects.push(new Shoot(this.x, this.y, this.weapon))
                objects.push(new Shoot(this.x + this.width, this.y, this.weapon))
                break;
        }
    }
}

class Enemy {
    private static q: number = 0;
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    score: number;
    private range: number;
    speed: number;
    armor: number;
    rotation: number;
    private phase: boolean;
    powerUp: number | null;

    constructor(level: number, podPower: number) {
        this.id = Enemy.q++;
        this.x = 200;
        this.y = 50;
        this.width = 12;
        this.height = 6;
        this.range = 0;
        this.speed = 0.4 + (level * 0.1);
        this.armor = 1;
        this.rotation = 0.01;
        this.phase = Math.random() > 0.5;
        this.score = 200;
        this.powerUp = this.getPowerUp(level, podPower);
    }

    private getPowerUp(level: number, podPower: number) {

        if(podPower > 4) return null

        const hasPowerUp = Math.random() > 0.20 + ( level < 7 ? level*0.1 : 0) + (podPower * 0.1);
        if (hasPowerUp) {
            const random = Math.floor(Math.random()*10)

            if(random % 7 == 0) {
                return 4
            }
            if(random % 5 == 0) {
                return 2
            }
            if(random % 3 == 0) {
                return 0
            }
            if(random % 4 == 0) {
                return 1
            }
            if(random % 9 == 0) {
                return Math.floor(Math.random()*10) % 9 ? 5 : 3
            }

            return null;
            // return Math.floor(Math.random() * 5);
        }
        return null;
    }

    setXY(x: number, y: number) {
        this.x = x - (this.width / 2);
        this.y = y;
    }

    setWidth(width: number) {
        this.width = width;
    }

    setPhase() {
        if (this.x < 0 || this.x > 400) {
            this.phase = !this.phase;
        }
        if (this.rotation > 0.5) {
            this.phase = false;
        }
        if (this.rotation < -0.5) {
            this.phase = true;
        }
    }

    move() {
        this.y = this.y + this.speed;
        if (this.phase) {
            this.x = this.x + this.speed * 2;
        }
        if (!this.phase) {
            this.x = this.x - this.speed * 2;
        }

        if (this.phase) {
            this.rotation = this.rotation + 0.01
        } else {
            this.rotation = this.rotation - 0.01
        }

        this.setPhase()
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "#E0FFD6";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "#9abd00"
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, this.width, this.height, this.rotation, 0, 360)
        ctx.stroke()
        ctx.closePath()
        if (this.powerUp != null) {
            ctx.beginPath()
            ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, -this.rotation, 0, 360)
            ctx.stroke()
            ctx.closePath()
        }

        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
    }
}

class EasyEnemy extends Enemy {
    constructor(level: number, podPower: number) {
        super(level, podPower);
        this.width = 12;
        this.height = 12;
        this.speed = 1 + (level * 0.1);
        this.score = 100;
    }

    move() {
        this.y = this.y + this.speed;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "#E0FFD6";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = "#9abd00"
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, this.width, this.height, 0, 0, 360)
        ctx.stroke()
        ctx.closePath()

        if (this.powerUp != null) {
            ctx.beginPath()
            ctx.ellipse(this.x, this.y, this.width / 2, this.height / 2, 0, 0, 360)
            ctx.stroke()
            ctx.closePath()
        }

        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
    }
}

class ArmoredEnemy extends Enemy {
    constructor(level: number, podPower: number) {
        super(level, podPower);
        this.width = 12;
        this.height = 12;
        this.speed = 0.2 + (level * 0.1);
        this.armor = 2 + level;
        this.score = 300;
    }

    move() {
        this.y = this.y + this.speed;
        this.rotation = this.rotation + 0.01
    }

    getColor() {
        const seed = 255 - this.armor * 30
        return seed > 0 ? `#${seed.toString(16)}bd00` : "#fff"
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "#E0FFD6";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = this.getColor()
        ctx.beginPath()
        // @ts-ignore
        ctx.roundRect(this.x, this.y, this.width, this.height + (this.armor * 3), 3)
        ctx.stroke()
        ctx.closePath()

        if (this.powerUp != null) {
            ctx.beginPath()
            // @ts-ignore
            ctx.roundRect(this.x+2, this.y+2, this.width-4, this.height + (this.armor * 3) - 4, 3)
            ctx.stroke()
            ctx.closePath()
        }

        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
    }
}

class PowerUp {
    type: number;
    x: number;
    y: number;
    speed: number;

    constructor(x: number, y: number, type: number) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.speed = 1;
    }

    move() {
        this.y = this.y + this.speed;
    }

    getIcon() {
        switch (this.type) {
            case 0:
                return "S"
            case 1:
                return "Q"
            case 2:
                return "W"
            case 3:
                return "A"
            case 4:
                return "P"
            case 4:
                return "+"
            default:
                return ""
        }
    }

    getColor() {
        switch (this.type) {
            case 0:
                return "#61edff"
            case 1:
                return "#a66eff"
            case 2:
                return "#ff9c51"
            case 3:
                return "#ffdc00"
            case 4:
                return "#ff0000"
            default:
                return ""
        }
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.getColor()
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, 8, 8, 0, 0, 360)
        ctx.font = "10px Arial"
        ctx.strokeText(this.getIcon(), this.x - 4, this.y + 4)
        ctx.stroke()
        ctx.closePath()
    }
}

class Blast {
    x: number;
    y: number;
    sequence: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.sequence = 10
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.shadowColor = "#E0FFD6";
        ctx.shadowBlur = 10;
        ctx.strokeStyle = this.sequence % 2 == 0 ? "#a2ff00" : "#ffdc00"
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, 15, 7, 3.14 - (314 / this.sequence), 0, 360)
        ctx.stroke()
        ctx.closePath()

        ctx.shadowColor = "none";
        ctx.shadowBlur = 0;
        this.sequence = this.sequence - 1
    }
}

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    let ctx: CanvasRenderingContext2D | null;
    if (canvasRef.current) {
        ctx = canvasRef.current.getContext("2d");
    }

    const [pod, setPod] = useState<Pod>(new Pod())
    const [score, setScore] = useState(0)
    const [kills, setKills] = useState(0)
    const [lives, setLives] = useState(3)
    const [level, setLevel] = useState(1)
    const [nextLevelGoal, setNextLevelGoal] = useState(10000)

    const [shots, setShots] = useState<Shoot[]>([])
    const [enemies, setEnemies] = useState<Enemy[]>([])
    const [blasts, setBlasts] = useState<Blast[]>([])
    const [powerUps, setPowerUps] = useState<PowerUp[]>([])

    const [tick, setTick] = useState(true)
    const [run, setRun] = useState(false)

    useEffect(() => {
        drawBackground()
        draw()
        cycle()
    }, [tick, run])

    useEffect(() => {
        if (kills && kills % 20 == 0) {
            setLevel(level + 1)
        }
    }, [kills])

    useEffect(() => {
        if(score >= nextLevelGoal) {
            setLives(lives + 1)
            setNextLevelGoal(score + 10000*level)
        }
    }, [score])

    const liveLost = () => {
        setLives(lives - 1)
        enemies.forEach(enemy => {
            blasts.push(new Blast(enemy.x, enemy.y))
        })
        blasts.push(new Blast(pod.x, pod.y))
        blasts.push(new Blast(pod.x + pod.width, pod.y))
        blasts.push(new Blast(pod.x + pod.width/2, pod.y))
        setEnemies([])
        pod.resetWeapon()
    }

    const cycle = () => {
        if (!run) return
        if (lives <= 0) {
            setRun(false)
        }
        setTimeout(() => {
            shots.forEach(obj => {
                obj.moveUp()
                if (obj.y < 0 - obj.height) {
                    shots.splice(shots.findIndex(o => o.id === obj.id), 1)
                }
            })

            enemies.forEach(enemy => {
                enemy.move();
                if (enemy.y > 350) {
                    enemies.splice(enemies.findIndex(o => o.id === enemy.id), 1)
                    liveLost()
                }
            })

            blasts.forEach(blast => {
                if (blast.sequence <= 0) {
                    blasts.splice(blasts.findIndex(o => o.x === blast.x), 1)
                }
            })

            powerUps.forEach(powerUp => {
                powerUp.move();
                if (powerUp.y > 350) {
                    powerUps.splice(powerUps.findIndex(o => o.x === powerUp.x), 1)
                }
            })

            enemyShotCollisionCheck()
            podPowerUpCollisionCheck()
            addEnemy()
            setTick(!tick)
        }, 10)
    }

    const addEnemy = () => {
        if (!run) return

        if (enemies.length <= level*pod.getPower() && Math.floor(Math.random() * 100) == 19) {
            let enemy
            const random = Math.floor(Math.random() * 3);
            switch (random) {
                case 0:
                    enemy = new EasyEnemy(level, pod.getPower());
                    break;
                case 1:
                    enemy = new ArmoredEnemy(level, pod.getPower());
                    break;
                default:
                    enemy = new Enemy(level, pod.getPower());
            }

            enemy.setXY(Math.floor(Math.random() * 350) + 25, 0)
            setEnemies([...enemies, enemy])
        }
    }

    const enemyShotCollisionCheck = () => {
        enemies.forEach(enemy => {
            shots.forEach(shot => {
                if (enemy.x - enemy.width / 2 < shot.x + shot.width
                    && enemy.x + enemy.width > shot.x
                    && enemy.y < shot.y + shot.height
                    && enemy.y + enemy.height > shot.y) {
                    if(pod.weapon.type != 3) {
                        shots.splice(shots.findIndex(o => o.id === shot.id), 1)
                    }
                    enemy.armor -= shot.power
                    if (enemy.armor <= 0) {
                        enemies.splice(enemies.findIndex(o => o.id === enemy.id), 1)
                        blasts.push(new Blast(enemy.x, enemy.y))
                        if (enemy.powerUp != null) {
                            powerUps.push(new PowerUp(enemy.x, enemy.y, enemy.powerUp))
                        }
                        setScore(score + enemy.score)
                        setKills(kills + 1)
                    }
                }
            })
        })
    }

    const podPowerUpCollisionCheck = () => {
        powerUps.forEach(powerUp => {
            if (pod.x - pod.width / 2 < powerUp.x + 8
                && pod.x + pod.width > powerUp.x
                && pod.y < powerUp.y + 8
                && pod.y + pod.height > powerUp.y
            ) {
                if(powerUp.type == 5) {
                    setLives(lives + 1)
                } else {
                    pod.upgrade(powerUp.type)
                }
                powerUps.splice(powerUps.findIndex(o => o.x === powerUp.x), 1)
            }
        })
    }

    const [frame, setFrame] = useState(0)
    const [yFrame, setYFrame] = useState(0)
    const drawBackground = () => {
        if (!ctx) return
        ctx.clearRect(0, 0, 400, 350)
        ctx.fillStyle = "#1e441e"
        ctx.fillRect(0, 0, 400, 350);

        //Y-axis
        for (let i = yFrame; i < 400; i += 25) {
            ctx.setLineDash([1,4])
            ctx.strokeStyle = "#119822"
            ctx.beginPath()
            ctx.moveTo(i, -25+frame)
            ctx.lineTo(i, 350)

            ctx.stroke()
            ctx.closePath()
        }

        //X-axis
        for (let i = frame; i < 350; i += 25) {
            ctx.strokeStyle = "#119822"
            ctx.beginPath()
            ctx.moveTo(0, i)
            ctx.lineTo(400, i)

            ctx.stroke()
            ctx.closePath()
        }

        if(run){
            setFrame(frame < 24 ? frame + 1 : 0)
        }

        ctx.setLineDash([])

        if (lives <= 0) {
            ctx.shadowColor = "#E0FFD6";
            ctx.shadowBlur = 10;
            ctx.fillStyle = "#63ff33"
            ctx.beginPath()
            ctx.font = "40px Arial"
            ctx.fillText("ИГРА ОКОНЧЕНА!", 24, 175)
            ctx.fill();
            ctx.closePath()
            ctx.shadowColor = "#none";
            ctx.shadowBlur = 0;
        }
    }

    const draw = () => {
        if (!ctx) return
        drawObjects(ctx);
        pod.draw(ctx);
    }

    const drawObjects = (ctx: CanvasRenderingContext2D) => {

        shots.forEach(obj => {
            obj.draw(ctx)
        })

        enemies.forEach(enemy => {
            enemy.draw(ctx)
        })

        blasts.forEach(blast => {
            blast.draw(ctx)
        })

        powerUps.forEach(power => {
            power.draw(ctx)
        })
    }

    const handleMouseMove = (event: any) => {
        pod.setX(event.clientX > 400 ? 400 : event.clientX - event.target.offsetLeft)
        setYFrame(Math.floor((pod.x - 180)/8))
    }

    const handleClick = (event: any) => {
        if (!run) return
        if (shots.length >= pod.weapon.quantity * (pod.weapon.type+1)) return
        pod.shoot(shots)
    }

    const reset = () => {
        setLives(3)
        setScore(0)
        setEnemies([])
        setBlasts([])
        setShots([])
        setLevel(1)
        setPowerUps([])
        setPod(new Pod)
    }

    const runControl = () => {
        if (lives <= 0) {
            reset()
        }
        setRun(!run)
    }

    return (
        <div>
            <div style={{
                display: "grid",
                gridTemplateColumns: "4fr 3fr 2fr",
                width: 400,
                color: "#63ff33",
                backgroundColor: "#1e441e",
                userSelect: "none"
            }}>
                <span style={{paddingLeft: 8}}>
                    Очки: {score}
                </span>
                <span onClick={runControl} style={{cursor: "pointer"}}>
                    {run ? "ПАУЗА" : "СТАРТ"}
                </span>
                <span>
                    Жизни: {lives}
                </span>
            </div>
            <div style={{
                outline: "none",
                cursor: run
                    ? pod.weapon.aim
                        ? "crosshair"
                        : "none"
                    : "default",
                height: "350px"
            }} onMouseMove={handleMouseMove} onClick={handleClick}>
                <canvas
                    ref={canvasRef}
                    width="400"
                    height="350"
                />
            </div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                width: 400,
                fontSize: 12,
                color: "#63ff33",
                backgroundColor: "#1e441e",
                userSelect: "none"
            }}>
                <span style={{paddingLeft: 8}}>
                    Уровень: {level}
                </span>
                <span style={{paddingRight: 8}}>
                    Оружие: S:{pod.weapon.speed} | Q:{pod.weapon.quantity} | L:{pod.weapon.type} | P:{pod.weapon.power}
                </span>
            </div>
        </div>
    );
}

export default App;


radio.onReceivedNumber(function (receivedNumber) {
    if (running && !(coach_mode) && control.deviceSerialNumber() == receivedNumber) {
        radio.sendNumber(down_time / data_count)
    } else if (running && coach_mode) {
        data_points[players.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))] = receivedNumber
    }
})
input.onButtonPressed(Button.A, function () {
    if (!(running) && !(coach_mode)) {
        radio.sendString("add")
        initial_pitch = input.rotation(Rotation.Pitch)
        calibrated = 1
        front = 1
        basic.showIcon(IconNames.Yes)
    } else if (!(running) && coach_mode) {
        running = true
        radio.sendString("start")
        basic.showIcon(IconNames.Square)
    }
})
function mean () {
    sum_ = 0
    for (let value of data_points) {
        sum_ += value
    }
    return sum_ / data_points.length
}
input.onButtonPressed(Button.AB, function () {
    if (!(running) && !(coach_mode)) {
        coach_mode = true
        players = []
        basic.showString("C")
    }
})
radio.onReceivedString(function (receivedString) {
    if (receivedString == "add") {
        if (coach_mode) {
            if (players.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber)) == -1) {
                players.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
                basic.showNumber(players.length)
                data_points.push(0)
            }
        }
    } else if (receivedString == "start") {
        down_time = 0
        data_count = 0
        running = true
    }
})
input.onButtonPressed(Button.B, function () {
    if (running && coach_mode) {
        basic.showNumber(mean())
    } else if (!(running) && !(coach_mode)) {
        initial_pitch = input.rotation(Rotation.Pitch)
        calibrated = 1
        front = 0
        radio.sendString("add")
        basic.showIcon(IconNames.Sword)
    }
})
input.onLogoEvent(TouchButtonEvent.Touched, function () {
    if (running && coach_mode) {
        basic.showNumber(mean())
    } else {
        basic.showNumber(down_time / data_count)
    }
})
let c_pitch = 0
let sum_ = 0
let front = 0
let calibrated = 0
let players: number[] = []
let data_points: number[] = []
let data_count = 0
let down_time = 0
let initial_pitch = 0
let running = false
let coach_mode = false
coach_mode = false
running = false
radio.setGroup(31)
radio.setTransmitSerialNumber(true)
let threshold = 20
initial_pitch = 0
down_time = 0
data_count = 0
basic.forever(function () {
    if (running && !(coach_mode)) {
        let pause2 = 0
        if (calibrated == 1 && pause2 == 0) {
            c_pitch = input.rotation(Rotation.Pitch)
            if (front == 1) {
                if (c_pitch - initial_pitch >= threshold) {
                    down_time += 1
                }
            } else {
                if (initial_pitch - c_pitch >= threshold) {
                    down_time += 1
                }
            }
            data_count += 1
        }
    } else if (running && coach_mode) {
        for (let value of players) {
            radio.sendNumber(value)
            basic.pause(100)
        }
    }
})

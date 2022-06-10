const fs = require('fs');

const path = require('path');
const PATH = path.join(__dirname, '../data/user.json');

module.exports.checkAge = (age) => {
    if (!age) {
        return false;
    }
    if (age < 0 || age > 100) {
        return false;
    }
    if (isNaN(age)) {
        return false;
    }
    if (!Number.isInteger(age)) {
        return false;
    }
    return true;
}

module.exports.checkCoordinate = (coordinate) => {
    if (!coordinate) {
        return false;
    }
    if (!isNaN(coordinate)) {
        return false;
    }
    const coordinateArr = coordinate.split(':');
    if (coordinateArr.length < 2) {
        return false;
    }
    if (coordinateArr[0].length !== 3 || coordinateArr[1].length !== 3) {
        return false;
    }
    if (isNaN(coordinateArr[0]) || isNaN(coordinateArr[1])) {
        return false;
    }
    if (!Number.isInteger(+coordinateArr[0]) || !Number.isInteger(+coordinateArr[1])) {
        return false;
    }
    if (+coordinateArr[0] < 0 || +coordinateArr[0] > 999 || +coordinateArr[1] < 0 || +coordinateArr[1] > 999) {
        return false;
    }
    return true;
}

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
module.exports.distance = (pointCurrentUser, point) => {
    const pointCurrentUserX = +pointCurrentUser.split(':')[0];
    const pointCurrentUserY = +pointCurrentUser.split(':')[1];
    const pointX = +point.split(':')[0];
    const pointY = +point.split(':')[1];
    return Math.sqrt(Math.pow(pointCurrentUserX - pointX, 2) + Math.pow(pointCurrentUserY - pointY, 2));
}

module.exports.getListUsers = () => {
    try {
        const listUser = fs.readFileSync(PATH);
        const parsedListUser = JSON.parse(listUser);
        return parsedListUser;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports.customResponse = (success = true, data = null, error = null) => {
    return {
        success,
        data,
        error
    }
}
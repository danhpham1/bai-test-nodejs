const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');
const ultils = require('../commands/ultils');

const PATH = path.join(__dirname, '../data/user.json');

module.exports.createUser = async (req, res) => {
    const { firstname, lastname, age, coordinate } = req.body;
    if (!firstname || !lastname || !age || !coordinate) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing required fields'));
    }
    if (!ultils.checkAge(age)) {
        return res.status(400).json(ultils.customResponse(false, null, 'Invalid age'));
    }
    if (!ultils.checkCoordinate(coordinate)) {
        return res.status(400).json(ultils.customResponse(false, null, 'Invalid coordinate'));
    }
    const id = uuidv4();
    const user = {
        id,
        firstname,
        lastname,
        age,
        coordinate
    };

    try {
        if (fs.existsSync(PATH)) {
            const users = fs.readFileSync(PATH);
            const parsedUsers = JSON.parse(users);
            parsedUsers.push(user);
            fs.writeFileSync(PATH, JSON.stringify(parsedUsers));
        } else {
            fs.writeFileSync(PATH, JSON.stringify([user]));
        }
        return res.status(201).json(ultils.customResponse(true, user, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}

module.exports.findUser = async (req, res) => {
    const { id } = req.query;
    if (!id) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing id query'));
    }
    try {
        const listUser = ultils.getListUsers();
        const user = listUser.find(user => user.id === id);
        if (!user) {
            return res.status(200).json(ultils.customResponse(false, null, 'User not found'));
        }
        return res.status(200).json(ultils.customResponse(true, user, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}

module.exports.searchUser = async (req, res) => {
    const { name } = req.query;
    if (!name) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing name query'));
    }
    try {
        const listUser = ultils.getListUsers();
        const users = listUser.filter(user => user.firstname.toLowerCase().includes(name.toLowerCase()) || user.lastname.toLowerCase().includes(name.toLowerCase()));
        if (!users) {
            return res.status(200).json(ultils.customResponse(false, null, 'User not found'));
        }
        const sortedUsers = users.sort((a, b) => {
            let firstnameA = a.firstname.toLowerCase(),
                firstnameB = b.firstname.toLowerCase();

            if (firstnameA < firstnameB) {
                return 1;
            }
            if (firstnameA > firstnameB) {
                return -1;
            }
            return 0;
        })
        return res.status(200).json(ultils.customResponse(true, sortedUsers, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}

module.exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const { firstname, lastname, age, coordinate } = req.body;
    if (!id) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing id params'));
    }
    try {
        const listUser = ultils.getListUsers();
        const user = listUser.find(user => user.id === id);
        if (!user) {
            return res.status(200).json(ultils.customResponse(false, null, 'User not found'));
        }
        if (firstname) {
            user.firstname = firstname;
        }
        if (lastname) {
            user.lastname = lastname;
        }
        if (age && ultils.checkAge(age)) {
            user.age = age;
        }
        if (coordinate && ultils.checkCoordinate(coordinate)) {
            user.coordinate = coordinate;
        }
        const indexUser = listUser.findIndex(user => user.id === id);
        listUser[indexUser] = user;
        fs.writeFileSync(PATH, JSON.stringify(listUser));
        return res.status(200).json(ultils.customResponse(true, user, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}

module.exports.deleteUser = async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing id params'));
    }
    try {
        const listUser = ultils.getListUsers();
        const indexUser = listUser.findIndex(user => user.id === id);
        if (indexUser < 0) {
            return res.status(200).json(ultils.customResponse(false, null, 'User not found'));
        }
        listUser.splice(indexUser, 1);
        fs.writeFileSync(PATH, JSON.stringify(listUser));
        return res.status(200).json(ultils.customResponse(true, id, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}

module.exports.findUserWithCoordinate = async (req, res) => {
    const { n, userId } = req.query;
    if (!n || !userId) {
        return res.status(400).json(ultils.customResponse(false, null, 'Missing n or userId query'));
    }
    try {
        const listUser = ultils.getListUsers();
        const user = listUser.find(user => user.id === userId);
        if (!user) {
            return res.status(200).json(ultils.customResponse(false, null, 'User not found'));
        }
        const usersNearUserId = listUser.filter(u => u.id !== user.id).sort((a, b) => {
            const da = ultils.distance(a.coordinate, user.coordinate);
            const db = ultils.distance(b.coordinate, user.coordinate);
            if (da < db) return -1;
            if (da > db) return 1;
            return 0;
        });
        const usersNearUserIdWithN = usersNearUserId.slice(0, n);
        return res.status(200).json(ultils.customResponse(true, usersNearUserIdWithN, null));
    } catch (error) {
        return res.status(500).json(ultils.customResponse(false, null, error.message));
    }
}
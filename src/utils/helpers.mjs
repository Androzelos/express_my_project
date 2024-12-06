import bcrypt from 'bcrypt';

const saltRounds = 10;

export const hashPassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    return bcrypt.hashSync(password, salt);
}

export const comparePassword = (plain, hashed) => {
    return bcrypt.compareSync(plain, hashed);
}

export const isAuthed = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('You have to be logged in to access this resource');
}

export const isNotAuthed = (req, res, next) => {
    if (!req.isAuthenticated()) {
        return next();
    }
    res.status(401).send('You have to be logged out to access this resource');
}
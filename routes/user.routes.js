import { Router } from "express";

const userRouter = Router();

// GET /users -> get all users
// GET /users/:id -> get user by id

userRouter.get('/', (req, res) => {
    res.send({
        title: 'GET all users'
    });
});

userRouter.get('/:id', (req, res) => {
    res.send({
        title: 'GET user details'
    });
});

userRouter.post('/', (req, res) => {
    res.send({
        title: 'CREATE new users'
    });
});

// PUT /users/:id -> update user by id
userRouter.put('/:id', (req, res) => {
    res.send({
        title: 'UPDATE a user'
    });
});

userRouter.delete('/:id', (req, res) => {
    res.send({
        title: 'DELETE users'
    });
});

export default userRouter;
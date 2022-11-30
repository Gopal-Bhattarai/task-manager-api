const express = require('express')
const router = new express.Router()
const Task = require('../models/tasks')
const auth = require('../middleware/auth')
const { update } = require('../models/users')


router.post('/tasks', auth, async (req,res) => {
    const task = new Task({
        ...req.body, 
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send('Task added: '+task)
    } catch(e) {
        res.status(400).send('myerror: '+e)
    }
})

//GET /tasks?completed=true/false
//GET /tasks?limit=10&skip-20
//GET /tasks?sortBy=createdAt:desc
router.get('/tasks', auth, async (req,res)=> {
    const match = {}
    const sort = {}

    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }

    try {
        // const tasks = await Task.find({owner: req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send('myerror:' + e)
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id

    try {
        const task = await Task.findOne({_id, owner: req.user._id })

        if(!task) {
            return res.status(404).send('Task not found : ' + _id)
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send('MyError : ' + e)
    }
})

router.patch('/tasks/:id', auth, async(req,res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update) )

    if(!isValidOperation) {
        return res.status(400).send({ Error: 'Invalid Operation@!'})
    }

    try {
       const task = await Task.findOne({_id: req.params.id, owner: req.user._id}) 
       
    if(!task) {
       return res.status(404).send('Error')
    }

    updates.forEach((update)=> task[update] = req.body[update])
    await task.save()
    res.status(200).send(task)
    } catch (e) {
        res.status(400).send('MyError: ' + e)
    }
})

router.delete('/tasks/:id', auth, async(req,res) => {
    try {
        const task = await Task.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!task) {
            return res.status(404).send('Task not found')
        }
        res.status(200).send('TaskDeleted: ' + task)
    } catch (e) {
        res.status(400).send('TaskDeleteError: ' + e)
    }
})

module.exports = router;
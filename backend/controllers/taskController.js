const Task = require('../models/Task');

//create a task
const createTask = async (req,res)=>{
    try{
        const {title,description,status,priority,dueDate}=req.body;
        const task = await Task.create({
            user: req.user._id,
            title, description, status, priority, dueDate,
        });
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//get all taks for logged-in user
const getTasks=async (req,res)=>{
    try{
        const tasks =await Task.find({user:req.user._id}).sort({createdAt:-1});
        res.json(tasks);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//get single task by id
const getTaskById = async (req,res)=> {
    try {
        const task = await Task.findById(req.params.id);

        if (!task){
            return res.status(404).json({message:'Task not found'});
        }

        //make sure the task belongs to logged-in user
        if (task.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:'Not Authorized'});
        }
        res.json(task);
    } catch (error){
        res.status(500).json({message:error.message});
    }
};

//update task
const updateTask = async (req,res)=>{
    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message:'Task Not found'});
        }
        if (task.user.toString()!==req.user._id.toString()) {
            return res.status(401).json({message:'Not authorized'});
        }
        const wasCompleted = task.status === 'completed';
        task.title=req.body.title || task.title;
        task.description=req.body.description || task.description;
        task.status=req.body.status || task.status;
        task.priority=req.body.priority || task.priority;
        if ('dueDate' in req.body) task.dueDate = req.body.dueDate;
        if (task.status==='completed' && !wasCompleted) {
            task.completedAt=new Date();
        } else if (task.status !== 'completed' && wasCompleted) {
            task.completedAt = undefined;
        }
        const updatedTask =await task.save();
        res.json(updatedTask);
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};

//delete a task
const deleteTask = async (req,res)=> {
    try {
        const task =await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({message:'Task not found'});
        }
        if (task.user.toString()!==req.user._id.toString()){
            return res.status(401).json({message:'Not authorized'});
        }
        await task.deleteOne();
        res.json({message:'Task removed'});
    } catch (error) {
        res.status(500).json({message:error.message});
    }
};
module.exports={createTask,getTasks,getTaskById,updateTask,deleteTask};
const express = require('express');
const { Todo } = require('../mongo')
const { getAsync, setAsync } = require('../redis')
const router = express.Router();

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })

  /* Redis todo counter */
  const currentCounter = await getAsync('todoCounter');
  if(!currentCounter){
    await setAsync('todoCounter', 1)
  } 
  else {
    await setAsync('todoCounter', parseInt(currentCounter) + 1)

  }
  
  res.send(todo);
});


router.get('/statistics', async (req, res) => {
  const added_todos = await getAsync('todoCounter')
  if(!added_todos) res.send({ added_todos: "0" })

  res.send({ added_todos })
})

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)

  if (!req.todo) return res.sendStatus(404)

  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo. */
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
});

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  const body = req.body

  const updatedTodo = await Todo.findByIdAndUpdate(req.todo._id, body, { new: true })
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)


module.exports = router;

import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import {
  getBooksOwnedBy,
  searchForSaleBooks,
  addBook,
  sellNewBook,
  sellExistBook,
  getMyBookShelf,
  getMyStoreShelf,
  unsellBook,
  searchForSaleBooksWithOLID,
  buyBook,
  feed,
  deleteBook
} from "./resolvers/Book.js"
import jwt from 'jsonwebtoken'

import {
  getUserByEmail,
  getUserByUsername,
  getUsers
} from "./resolvers/User.js"
import { signup, login } from './resolvers/Mutation.js'

const app = express();
const APP_SECRET = process.env.APP_SECRET
// app.use(session({
//   key: 'book_exchange_session',
//   secret: 'ucantcthis',
//   store: new MySQLStore({
//     host: 'localhost',
//     port: 33060,
//     user: 'root',
//     password: 'password',
//     database: 'book_exchange'
//   }),
//   resave: false,
//   saveUnitialized: false,
//   cookie: {
//     maxAge: 1000 * 60 * 60 * 24
//   }
// }))
// app.use(passport.initialize());
// app.use(passport.session())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json())

function authenticateUser(req, res, next) {
  const Authorization = req.headers.authorization;
  if (Authorization) {
	const token = Authorization.replace('Bearer ', '')
	const {userId} = jwt.verify(token, APP_SECRET)
	req.userId = userId
	next();
  }
  else {
	// throw new Error('Not authenticated')
	res.status(401).json({ error: 'Not authenticated' })
  }
}

const errorHandler = (err, req, res, next) => {
  res.status(500).json({ error: err })
}

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.post('/login', async (req, res) => {
  const email = req.body.email
  const password = req.body.password
  try
  {
	  res.json(await login(email, password))
  }
  catch(err)
  {
	  res.status(400).send(err)
  }
})

app.post('/signup', async (req, res) => {
  const user = req.body
  res.json(await signup(user))
})

app.get('/my/bookshelf', authenticateUser, async (req, res) => {
  res.json(await getMyBookShelf(req.userId))
})

app.get('/my/storeshelf', authenticateUser, async (req, res) => {
  res.send(await getMyStoreShelf(req.userId))
})

app.post('/addBookToShelf', authenticateUser, async (req, res) => {
  const book = req.body
  res.json(await addBook(0, book.ol_id, req.userId))
})

app.post('/sellNewBook', authenticateUser, async (req, res) => {
  const book = req.body
  res.json(await sellNewBook(book.ol_id, req.userId, book.price || 0, book.condition))
})

app.post('/book/:bookId/sell', authenticateUser, async (req, res) => {
  const book = req.body
  res.json(await sellExistBook(req.userId, req.params.bookId, book.price || 0, book.condition))
})

app.post('/book/:bookId/unsell', authenticateUser, async (req, res) => {
  res.json(await unsellBook(req.userId, req.params.bookId))
})

app.post('/book/:bookId/buy', authenticateUser, async (req, res) => {
  try {
	res.json(await buyBook(req.userId, req.params.bookId))
  }
  catch (err) {
	res.status(400).send(err.toString())
  }
})

app.get('/users', async (req, res) => {
  res.send(await getUsers())
})

app.get('/user/:username', async (req, res) => {
  res.send(await getUserByUsername(req.params.username))
})

app.get('/forSale/:OL_ID', authenticateUser, async (req, res) => {
  if (req.userId)
  {
    res.send(await searchForSaleBooksWithOLID(req.userId, req.params.OL_ID));
  }
  else
  {
    res.status(401).send("Not authenticated")
  }
})

app.get('/feed', async (req, res) => {
  const Authorization = req.headers.authorization;
  if (Authorization) {
	const token = Authorization.replace('Bearer ', '')
	const { userId } = jwt.verify(token, APP_SECRET)
	req.userId = userId
	res.send(await feed(req.userId))
  }
  else {
	res.send(await searchForSaleBooks())
  }
})

app.post('/book/:bookId/delete', authenticateUser, async (req, res) => {
  res.json(await deleteBook(req.userId, req.params.bookId))
})

// TODO: Delete book
// TODO: Change password
// TODO: Buy book

app.use(errorHandler)

app.listen({ port: process.env.serverPORT || 4000 }, () => {
  console.log(`🚀 Server ready at port ${process.env.serverPORT || 4000}`);
})
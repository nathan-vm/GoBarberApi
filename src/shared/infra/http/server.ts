import 'dotenv/config'
import 'reflect-metadata'
import express, { Request, Response, NextFunction } from 'express'
import 'express-async-errors'
import cors from 'cors'
import { errors } from 'celebrate'

import rateLimiter from '@shared/infra/http/middlewares/rateLimiter'
import AppError from '@shared/errors/AppError'
import uploadConfig from '@config/upload'
import routes from './routes'
import '@shared/infra/typeorm'
import '@shared/container'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/files', express.static(uploadConfig.uploadsFolder))
app.use(rateLimiter)
app.use(routes)
app.use(errors())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'Error',
      message: err.message,
    })
  }

  console.error(err)

  return response.status(500).json({
    status: 'Error',
    message: 'Inernal server error',
  })
})

app.listen(3333, () => console.log('🚀 Server started on port :3333'))
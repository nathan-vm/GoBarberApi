import path from 'path'
import multer, { StorageEngine } from 'multer'
import crypto from 'crypto'

const tmpFolder = path.resolve(__dirname, '..', '..', 'tmp')
const uploadsFolder = path.resolve(tmpFolder, 'uploads')

interface IUploadConfig {
  driver: 's3' | 'disk'
  tmpFolder: string
  uploadsFolder: string
  multer: {
    storage: StorageEngine
  }
  config: {
    disk: {}
    aws: {
      bucket: string
    }
  }
}

export default {
  driver: process.env.STORAGE_DRIVER,

  tmpFolder: tmpFolder,
  uploadsFolder: uploadsFolder,

  multer: {
    storage: multer.diskStorage({
      destination: tmpFolder,
      filename(request, file, callback) {
        const fileHash = crypto.randomBytes(10).toString('HEX')
        const fileName = `${fileHash}-${file.originalname}`

        return callback(null, fileName)
      },
    }),
  },

  config: {
    disk: {},
    aws: {
      bucket: 'app-gobarber-nathan-vm',
    },
  },
} as IUploadConfig

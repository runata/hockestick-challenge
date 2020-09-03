const express = require('express')
const fs = require('fs')
const cors = require('cors')
const multer = require('multer')
const Jimp = require('jimp')

const port = process.env.PORT || 8001
const app = express()
app.use(cors())

app.post('/image/convert', (req, res) => {
    let fileName = ''
    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
        cb(null, 'public')
      },
      filename: function (req, file, cb) {
        fileName = Date.now() + '-' + file.originalname
        cb(null, fileName)
      }
    })
    
    const upload = multer({ storage: storage }).single('file')

    upload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(500).json(err)
        } else if (err) {
            return res.status(500).json(err)
        }
        const convertedFile = `${fileName.replace(/\.[^/.]+$/, "")}.${req.headers['extension']}`
        Jimp.read(`./public/${fileName}`, (err, convert) => {
            if (err) throw err
            convert.write(`./public/${convertedFile}`, () => {
                res.sendFile(`${__dirname}\\public\\${convertedFile}`)
            })
        })
    })
})

app.listen(port, () => {
    console.log(`REST API running on port ${port}`)
})
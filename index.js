//import required module
const express = require('express');
const app = express();
const bodyParser = require('body-parser'); //post body handler
const Sequelize = require('sequelize'); //Database ORM
const { check, validationResult } = require('express-validator/check'); //form validation
const { matchedData, sanitize } = require('express-validator/filter'); //sanitize form params
const multer  = require('multer'); //multipar form-data
const path = require('path');
const crypto = require('crypto');

//Set body parser for HTTP post operation
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//set static assets to public directory
app.use(express.static('public'));
const uploadDir = '/img/';
const storage = multer.diskStorage({
    destination: "./public"+uploadDir,
    filename: function (req, file, cb) {
      crypto.pseudoRandomBytes(16, function (err, raw) {
        if (err) return cb(err)  

        cb(null, raw.toString('hex') + path.extname(file.originalname))
      })
    }
})

const upload = multer({storage: storage, dest: uploadDir });

//Set app config
const port = 3000;
const baseUrl = 'http://localhost:'+port;

//Connect to database
const sequelize = new Sequelize('kumpulanTugas', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    }
});

//Define models
const tugas = sequelize.define('tugas', {
    'id': {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    'nama': Sequelize.STRING,
    'matkul': Sequelize.STRING,
    'dosen': Sequelize.STRING,
    'jenis_tugas': Sequelize.STRING,
    'status': Sequelize.STRING,
    'deskripsi': Sequelize.TEXT,
    'tanggal_pengumpulan': Sequelize.DATE,
    'createdAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },    
    'updatedAt': {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
    },   
    
}, {
    //prevent sequelize transform table name into plural
    freezeTableName: true,
})

/**
 * Set Routes for CRUD
 */

//get all books
app.get('/tugas/', (req, res) => {
    tugas.findAll().then(tugas => {
        res.json(tugas)
    })
})

//get book by isbn
app.get('/tugas/:matkul', (req, res) => {
    tugas.findOne({where: {matkul: req.params.matkul}}).then(tugas => {
        res.json(tugas)
    })
})

//Insert operation
app.post('/tugas/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    // upload.single('image'),

    //Set form validation rule
    // check('isbn')
    //     .isLength({ min: 5 })
    //     .isNumeric()
    //     .custom(value => {
    //         return book.findOne({where: {isbn: value}}).then(b => {
    //             if(b){
    //                 throw new Error('ISBN already in use');
    //             }            
    //         })
    //     }
    // ),
    check('nama')
        .isLength({min: 2}),
    check('matkul')
        .isLength({min: 2}),
    check('dosen')
        .isLength({min: 2}),
    check('jenis_tugas')
        .isLength({min: 2}),
    check('status')
        .isLength({min: 2})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }

    tugas.create({
        nama: req.body.nama,
        matkul: req.body.matkul,
        dosen: req.body.dosen,
        jenis_tugas: req.body.jenis_tugas,
        status: req.body.status,
        tanggal_pengumpulan: req.body.tanggal_pengumpulan,
        deskripsi: req.body.deskripsi
    }).then(tugasBaru => {
        res.json({
            "status":"success",
            "message":"Tugas sudah ditambahkan",
            "data": tugasBaru
        })
    })
})

//Update operation
app.put('/tugas/', [
    //File upload (karena pakai multer, tempatkan di posisi pertama agar membaca multipar form-data)
    // upload.single('image'),

    //Set form validation rule
    check('id')
        .isLength({ min: 1 })
        .isNumeric()
        .custom(value => {
            return tugas.findOne({where: {id: value}}).then(b => {
                if(!b){
                    throw new Error('Tugas tidak ada');
                }            
            })
        }
    ),
    check('nama')
        .isLength({min: 2}),
    check('matkul')
        .isLength({min: 2}),
    check('dosen')
        .isLength({min: 2}),
    check('jenis_tugas')
        .isLength({min: 2}),
    check('status')
        .isLength({min: 2})

],(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
    }
    const update = {
        id: req.body.id,
        nama: req.body.nama,
        matkul: req.body.matkul,
        dosen: req.body.dosen,
        jenis_tugas: req.body.jenis_tugas,
        status: req.body.status,
        tanggal_pengumpulan: req.body.tanggal_pengumpulan,
        deskripsi: req.body.deskripsi
    }
    tugas.update(update,{where: {id: req.body.id}})
        .then(affectedRow => {
            return tugas.findOne({where: {id: req.body.id}})      
        })
        .then(b => {
            res.json({
                "status": "success",
                "message": "Tugas telah diperbaharui",
                "data": b
            })
        })
})

app.delete('/tugas/:id',[
    //Set form validation rule
    check('id')
        .isLength({ min: 1 })
        .isNumeric()
        .custom(value => {
            return tugas.findOne({where: {id: value}}).then(b => {
                if(!b){
                    throw new Error('Tugas tidak ada');
                }            
            })
        }
    ),
], (req, res) => {
    tugas.destroy({where: {id: req.params.id}})
        .then(affectedRow => {
            if(affectedRow){
                return {
                    "status":"success",
                    "message": "Tugas sudah dihapus",
                    "data": null
                } 
            }

            return {
                "status":"error",
                "message": "Failed",
                "data": null
            } 
                
        })
        .then(r => {
            res.json(r)
        })
})


app.listen(port, () => console.log("kumpulan-tugas run on "+baseUrl ))
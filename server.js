const express = require('express');
const { PrismaClient } = require("@prisma/client");
const bodyParser = require("body-parser");
const crypto = require("crypto-js");
require("dotenv").config();

function encodeData(data) { return crypto.AES.encrypt(data, process.env.SECRET_KEY).toString(); }

function decodeData(data) { return crypto.AES.decrypt(data, process.env.SECRET_KEY).toString(crypto.enc.Utf8); }

function encodePs(data) { return crypto.enc.Base64.stringify(crypto.HmacSHA256(data,process.env.SECRET_KEY)); }


const app = express()
app.use(bodyParser.json())
const prisma = new PrismaClient();
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/user', async (req, res) => {
    const data = await prisma.$queryRaw`select id, username, cardid from user`;
    const finalData = await data.map(record => ({ 
      ...record, 
      cardId: decodeData(record.cardId), username : decodeData(record.username) }));
    res.json({
        message: 'okay',
        data: finalData
    });
});

app.post('/user', async (req, res) => {
    console.log(req.body)
    const response = await prisma.user.create({
        data: {
            username: encodeData(req.body.username),
            password: encodePs(req.body.password),
            cardId: encodeData(req.body.cardId)
        }
    });
    if (response) {
        res.json({
            message: "add successfully"
        })
    } else {
        res.json9({
            message: "failed"
        })
    }
});

app.put('/user', async (req, res) => {
    const response = await prisma.user.update({
        select: {
            password: true,
            id: true
        },
        where: {
            id: req.body.id
        },
        data: {
            password: req.body.password
        }
    });
    if (response) {
        res.json({
            message: "update sucessfully"
        })
    } else {
        res.json({
            message: "update fail"
        })
    }
});

app.delete('/user', async (req, res) => {
    const response = await prisma.user.delete({
        where: {
            id: req.body.id
        },
        select: {
            username: true
        }
    });
    if (response) {
        res.json({
            message: "dalete sucessfully"
        })
    } else {
        res.json({
            message: "dalete fail"
        })
    }
});

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})

/*const express = require("express");
const {PrismaClient} = require("@prisma/client");
const bodyParser = require("body-parser");

const app = new express();
const port = 3000
app.use(bodyParser.json());
const prisma = new PrismaClient();


app.get('/', (req, res) => {
  res.send('Server is Runing');
});

app.post('/user', async (req, res) => {
    console.log(req.body)
    const response = await prisma.user.create({
      data:{
        username: req.body.username,
        password: req.body.password
      }
    });
    if (response) {
      res.json({
        message: "Add Successfully"
      })
    }else {
      res.json({
        message: "failed"
      })
    }
});

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});

app.get('/user', async (req, res) => {
    const data = await prisma.user.findMany();
    res.json({
        message: 'Ok Bro',
        data
    })
});*/
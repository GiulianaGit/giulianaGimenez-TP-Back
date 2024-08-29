var express = require('express');
var router = express.Router();
var novedadesModel = require('../models/novedadesModel'); 
const cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

//para listar las novedades
router.get('/novedades', async function(req, res, next) {

    var novedades = await novedadesModel.getNovedades();

    novedades = novedades.map(novedades => {
        if (novedades.img_id){
            const imagen = cloudinary.image(novedades.img_id, {
                width: 960,
                height: 200,
                crop: 'fill'
            });
            return {
                ...novedades,
                imagen
            }
        }else{
            return {
                ...novedades,
                imagen: '' //Todo: propiedad devolver una imagen: 'No disponible'
            }
        }
    });

    res.json(novedades);

});

router.post('/contacto', async (req,res)=>{
    const mail = {
        to: 'mailTest@yopmail.com',
        subject:'Contacto web',
        html: `${req.body.nombre} se contacto a traves de la web y quiere más información a este correo: ${req.body.email} <br> Además. hizo el siguiente comentario: ${req.body.comentario} <br> Su tel es: ${req.body.telefono}`
    }

    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMT_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }); //cierra transp

    await transport.sendMail(mail)

    res.status(201).json({
        error:false,
        message: 'Mensaje enviado'
    });
})


module.exports = router;
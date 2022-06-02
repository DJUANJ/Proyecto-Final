const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const trasport = nodemailer.createTransport(
    nodemailerSendgrid({
        apiKey: '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'
    })
);


const createTransp = ()=>{

    // const transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true, // true for 465, false for other ports
    //     auth: {
    //       user: process.env.Email, // generated ethereal user
    //       pass: process.env.Email_Pass, // generated ethereal password
    //     },
    //   });

    const transporter = nodemailer.createTransport(
        nodemailerSendgrid({
            apiKey: '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'
        })
    );
      return transporter;

};

const sendEmail = async (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) =>{
    const transporter = createTransp();
      // send mail with defined transport object
    const info = await transporter.sendMail({
    from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
    to: Email, // list of receivers
    subject: "Encargado de un evento", // Subject line
    text: `Academic Events \nHas sido seleccionado para el rol de Encargado en la conferencia ${tema}, el cual se llevará a cabo del ${fechaInicio} al ${fechaFinal}.\nOrganizador del Evento: ${NombreEncargado}\nEnlace de la reunión: ${enlace}\n\n¡Agradecemos tu colaboración!`, // plain text body
    //html: "<b>Hello world?</b>", // html body
  });
  
  return
}

const sendEmailCP = async (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) =>{
  const transporter = createTransp();
    // send mail with defined transport object
  const info = await transporter.sendMail({
  from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
  to: Email, // list of receivers
  subject: "Encargado de un evento", // Subject line
  text: `Academic Events \nHas sido seleccionado para el rol de Encargado en la conferencia ${tema}, el cual se llevará a cabo del ${fechaInicio} al ${fechaFinal}.\nOrganizador del Evento: ${NombreEncargado}\nLugar de la reunión: ${enlace}\n\n¡Agradecemos tu colaboración!`, // plain text body
  //html: "<b>Hello world?</b>", // html body
});

return
}
const sendEmailTV = async (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) =>{
  const transporter = createTransp();
    // send mail with defined transport object
  const info = await transporter.sendMail({
  from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
  to: Email, // list of receivers
  subject: "Encargado de un evento", // Subject line
  text: `Academic Events \nHas sido seleccionado para el rol de Encargado en el taller ${tema}, el cual se llevará a cabo del ${fechaInicio} al ${fechaFinal}.\nOrganizador del Evento: ${NombreEncargado}\nEnlace de la reunión: ${enlace}\n\n¡Agradecemos tu colaboración!`, // plain text body
  //html: "<b>Hello world?</b>", // html body
});

return
}

const sendEmailTP = async (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) =>{
const transporter = createTransp();
  // send mail with defined transport object
const info = await transporter.sendMail({
from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
to: Email, // list of receivers
subject: "Encargado de un evento", // Subject line
text: `Academic Events \nHas sido seleccionado para el rol de Encargado en el taller ${tema}, el cual se llevará a cabo del ${fechaInicio} al ${fechaFinal}.\nOrganizador del Evento: ${NombreEncargado}\nLugar de la reunión: ${enlace}\n\n¡Agradecemos tu colaboración!`, // plain text body
//html: "<b>Hello world?</b>", // html body
});

return
}

const sendEmailIns = async (Email,tema,fechaInicio,fechaFinal) =>{
  const transporter = createTransp();
    // send mail with defined transport object
  const info = await transporter.sendMail({
  from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
  to: Email, // list of receivers
  subject: "Inscripción exitosa", // Subject line
  text: `Academic Events\nTe has inscrito con éxito a ${tema}, vigente desde el ${fechaInicio} al ${fechaFinal}.\nPuedes verificar la información del evento y las conferencias o talleres del mismo en Mis inscripciones, ubicado dentro del menú principal de la página.\n\n¡Gracias por utilizar Academic Events!`, // plain text body
  //html: "<b>Hello world?</b>", // html body
  });
  
  return
  }

  const sendEmailEC = async (Email,tema,fechaInicio,fechaFinal,NombreEncargado) =>{
    const transporter = createTransp();
      // send mail with defined transport object
    const info = await transporter.sendMail({
    from: '"Academic Events" <academic.events.edu@gmail.com>', // sender address
    to: Email, // list of receivers
    subject: "Invitación a evento cerrado", // Subject line
    text: `Academic Events\nHas sido invitado al evento cerrado: ${tema}, el cual se llevará a cabo del ${fechaInicio} al ${fechaFinal}.\nOrganizador del evento:${NombreEncargado}\n¡Agradeceremos tu presencia!`, // plain text body
    //html: "<b>Hello world?</b>",  , vigente desde el // html body
    });
    
    return
    }



exports.sendEmail = (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) => sendEmail(Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
exports.sendEmailCP = (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) => sendEmailCP(Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
exports.sendEmailTV = (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) => sendEmailTV(Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
exports.sendEmailTP = (Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace) => sendEmailTP(Email,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
exports.sendEmailIns = (Email,tema,fechaInicio,fechaFinal) => sendEmailIns(Email,tema,fechaInicio,fechaFinal);
exports.sendEmailEC = (Email,tema,fechaInicio,fechaFinal,NombreEncargado) => sendEmailEC(Email,tema,fechaInicio,fechaFinal,NombreEncargado);
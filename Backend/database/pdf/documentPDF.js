//Define font files para la libreria pdfmake
var fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  },
  Courier: {
    normal: 'Courier',
    bold: 'Courier-Bold',
    italics: 'Courier-Oblique',
    bolditalics: 'Courier-BoldOblique'
  },
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  },
  Times: {
    normal: 'Times-Roman',
    bold: 'Times-Bold',
    italics: 'Times-Italic',
    bolditalics: 'Times-BoldItalic'
  },
  Symbol: {
    normal: 'Symbol'
  },
  ZapfDingbats: {
    normal: 'ZapfDingbats'
  }
};

//solicitamos la libreria pdfmake
const PdfPrinter = require('pdfmake');
///instanciamos un objeto pdf y sus fuentes
const printer = new PdfPrinter(fonts);
///requerimos el manejador de archivos de node js
const fs = require('fs');




///funcion de nombre aleatorio
function NombreArchivo(nombre,id) {
    // uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
   // return ('Suscripciones'+nombre+ '-' +uniqueSuffix+'.pdf')
    return ('Suscripciones'+nombre+id+'.pdf')
    
    }

    function NombreArchivo2(nombre,id) {
      // uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
     // return ('Suscripciones'+nombre+ '-' +uniqueSuffix+'.pdf')
      return ('Participantes'+nombre+id+'.pdf')
      
      }


function formatDate(date){
  const months = ["ENE", "FEB", "MAR","ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    let formatted_date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
    return formatted_date;
}


///funcio que genera el archivo pdf
function listaPdf (ObjetoLista){
  try{
    ///Nombre del evento 
    const jason=ObjetoLista;
    var nombreEvento=jason[0].Nombre_Evento;
    var idEvento=jason[0].ID_Evento;
    var descripcion=jason[0].Descripcion_Evento;
    var FechaI=formatDate(jason[0].Fecha_Inicio);
    var FechaF=formatDate(jason[0].Fecha_Final);
    const filename= NombreArchivo(nombreEvento,idEvento);
/// creamos la tabla de participantes con sus encabezados
    var table =[["No.","Nombre", "Correo"]];
    var n= 1;
    // Iteramos el objeto para instanciar la lista
    for (const itemObj of jason) {
        
        table.push([n,itemObj['Nombre_Usuario'],itemObj['Email_Usuario']]);
    n=n+1;
    }
    ///Termina el ciclo for

    console.log(table)
///Definicion del contenido del pdf   
var docDefinition = {
    content: [{
        // Imagen
        image: './Backend/database/pdf/baner.png',
        width: 500
      },
      '\n\n',
      {text:"Nombre del Evento: "+nombreEvento,style: 'header',
			alignment: 'center',fontSize: 15,
			bold: true},
      '\n',
      {text: 'Descripcion del evento:', style: 'header'},
      '\n',
      {text:'Del '+FechaI+ ' al '+ FechaF,fontSize: 11,style: 'header'},
      '\n',
      {text: descripcion,alignment: 'justify'},
      '\n\n\n',
      {text:'Listado de participantes inscritos al evento:',alignment: 'center', bold: true},
      '\n',
      {
          style: 'tableExample',alignment: 'left',layout: 'lightHorizontalLines',
          table: { 
              widths: [ 30, '*', '*' ],
              body: table
          }
      },
      {text:'--------------------------------------------------------------------------------------------------------------------------------',alignment: 'center'}
      ],
    defaultStyle: {
      font: 'Helvetica'
    }
  };
  
  var options = {
    // ...
  }
  ////Se Crea el documento
  var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream('./Backend/database/pdf/ListaEvento/'+filename));
  pdfDoc.end();
  return filename
  

}catch(error){
  console.log('Error al crear/leer archivo o no existe')
  return 'error.pdf'
}
}
////////

//funcio que genera el listado de participantes archivo pdf
function listaConferenciaPdf (ObjetoLista){
  try{
    ///Nombre del evento 
    const jason=ObjetoLista;
    var nombreEvento=jason[0].Nombre_Evento;
    var idEvento=jason[0].ID_Evento;
    var descripcion=jason[0].Descripcion_Evento;
    var FechaI=formatDate(jason[0].F_Inicio_Evento);
    var FechaF=formatDate(jason[0].F_Final_Evento);
    var id_conferencia=jason[0].ID_Conferencia;
    var nombreConferencia=jason[0].Nombre_Conferencia;
    var descripcionReunion=jason[0].Descripcion_Reunion;
    var descripcionConferencia=jason[0].Descripcion;
    const filename= NombreArchivo2(nombreConferencia,id_conferencia);
    var FechaIC=formatDate(jason[0].F_Inicio_Conferencia);
    var FechaFC=formatDate(jason[0].F_Final_Conferencia);
    var HoraIC=jason[0].Hora_Inicio;
    var HoraFC=jason[0].Hora_Final;
/// creamos la tabla de participantes con sus encabezados
    var table =[["No.","Nombre", "Correo"]];
    var n= 1;
    // Iteramos el objeto para instanciar la lista
    for (const itemObj of jason) {
        
        table.push([n,itemObj['Nombre_Usuario'],itemObj['Email_Usuario']]);
    n=n+1;
    }
    ///Termina el ciclo for

    console.log(table)
///Definicion del contenido del pdf   
var docDefinition = {
    content: [{
        // Imagen
        image: './Backend/database/pdf/baner.png',
        width: 500
      },
      '\n\n',
      {text:"Nombre del Evento: "+nombreEvento,style: 'header',
			alignment: 'center',fontSize: 15,
			bold: true},
      '\n',
      {text: 'Descripcion del evento:', style: 'header'},
      '\n',
      {text:'Del '+FechaI+ ' al '+ FechaF,fontSize: 11,style: 'header'},
      '\n',
      {text: descripcion,alignment: 'justify'},
      '\n\n\n',
      ///
      {text:"Nombre de "+descripcionReunion+": "+nombreConferencia,style: 'header',
			alignment: 'center',fontSize: 15,
			bold: true},
      '\n',
      {text:"Descripcion de "+descripcionReunion +": ", style: 'header'},
      '\n',
      {text:'Del '+FechaIC+ ' al '+ FechaFC,fontSize: 11,style: 'header'},
      '\n',
      {text:'Hora Inicio: '+HoraIC+ ' Hora Final: '+ HoraFC ,fontSize: 11,style: 'header'},
      '\n',
      {text: descripcionConferencia,alignment: 'justify'},
      '\n\n\n',
      ///
      {text:'Listado de participantes presentes en la conferencia/taller:',alignment: 'center', bold: true},
      '\n',
      {
          style: 'tableExample',alignment: 'left',layout: 'lightHorizontalLines',
          table: { 
              widths: [ 30, '*', '*' ],
              body: table
          }
      },
      {text:'--------------------------------------------------------------------------------------------------------------------------------',alignment: 'center'}
      ],
    defaultStyle: {
      font: 'Helvetica'
    }
  };
  
  var options = {
    // ...
  }
  ////Se Crea el documento
  var pdfDoc = printer.createPdfKitDocument(docDefinition, options);
  pdfDoc.pipe(fs.createWriteStream('./Backend/database/pdf/ListaConferencia/'+filename));
  pdfDoc.end();
  return filename
  

}catch(error){
  //console.log('Error al crear/leer archivo o no existe')
  console.log(error)
  return 'error.pdf'
}
}
////////
///Exportamos la funcion
module.exports = {
    "listaPdf": listaPdf, "listaConferenciaPdf": listaConferenciaPdf
};

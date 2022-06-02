const pdf = require('html-pdf');
const path = require('path');

function formatDate(date){
    const months = ["ENE", "FEB", "MAR","ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
      let formatted_date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
      return formatted_date;
  }

///funcion de nombre aleatorio
function NombreArchivo(id,nombre) {
        //uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return ('InfoEvento'+id+ '-' +nombre+'.pdf')
    }

function Crearpdf(result, resu, rimg){
    try{

    const conferencia = result;
    const evento = resu;
    const imagen = rimg;
    var nombreevento = evento[0].Nombre_Evento
    var Institucion = evento[0].Institucion
    var Descripcion = evento[0].Descripcion_Evento
    var Imagen = imagen[0].Url_Evento
    var FechaInicio = formatDate(evento[0].Fecha_Inicio)
    var FechaFinal = formatDate(evento[0].Fecha_Final)
    var TipoEvento = evento[0].Descripcion;
    var Organizador = evento[0].Nombre_Usuario;
    var filename = NombreArchivo(evento[0].ID_Evento,nombreevento);
    

    var temporal = '';
    console.log(result)
    for(itemfila of conferencia){
        var nombreconferencia = itemfila['Nombre_Conferencia'];
        var descripcionC = itemfila['Descripcion'];
        var tiporeunion = itemfila['Descripcion_Reunion'];
        var encargado = itemfila['Email_Encargado'];
        var fechainicio = formatDate(itemfila['Fecha_Inicio']);
        var fechafinal = formatDate(itemfila['Fecha_Final']);
        var horainicio = itemfila['Hora_Inicio'];
        var horafinal = itemfila['Hora_Final'];
        var limiteparticipantes = itemfila['Limite_Participante'];
        var descripcionM = itemfila['Descripcion_Modalidad'];
        var enlace = itemfila['Enlace'];
        var limitacion = ''
        var cantidad = ''
        if(limiteparticipantes == 0){
            limitacion = 'No'
            cantidad = 0
        }else{
            limitacion = 'Si'
            cantidad = limiteparticipantes
        }

        temporal = temporal + `
        <tr>
                        <th>
                            <div class="control3">
                                <h2>Conferencia/taller del evento</h2>
                            </div>
                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Tipo de reunión:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+tiporeunion+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Tema a tratar:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+nombreconferencia+`</p>
                            </div>

                            <div class="control2">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Descripción:</p>
                                <div class="conte-descripcion">
                                    <p style="font-size: 19px; text-align: justify; font-weight: lighter;">
                                    `+descripcionC+`
                                    </p>
                                </div>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Correo electrónico del encargado:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+encargado+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Fecha de inicio:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+fechainicio+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Fecha de finalización:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+fechafinal+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Hora de inicio:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+horainicio+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Hora final:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+horafinal+`</p>
                            </div>

                            <div class="control">
                                
                                    <p style="font-size: 19px; font-weight: bold; text-align: left;">La reunión limita participantes:</p>
                                    <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+limitacion+`</p>
                                
                            </div>

                            <div class="control">
                                    <p style="font-size: 19px; font-weight: bold; text-align: left;">Límite de participantes:</p>
                                    <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+cantidad+`</p>

                            </div>


                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Modalidad de la reunión:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+descripcionM+`</p>
                            </div>

                            <div class="control">
                                <p style="font-size: 19px; font-weight: bold; text-align: left;">Enlace o lugar de reunión:</p>
                                <p style="font-size: 20px; text-align: left; font-weight: lighter;">`+enlace+`</p>
                            </div>
                            <hr class="lineahorizontal" style="border: solid 1px black;">
                        </th>
                    </tr>
        `
    }
    var content = `
    <!doctype html>
    <html>
        <head>
            <meta charset="utf-8">
            <title>PDF</title>

            <style>
                h1 {
                    color: #2a4374;
                    text-align: center;
                }

                h2{
                    color: #489c95;
                    text-align: center;
                }

                .logo{
                    width: 10%;
                    height: auto;
                }

                .contenedor-contenido{
                    width: 88%;
                    height: auto;
                    margin-left: 60px;
                }

                .control{
                    width: 100%;
                    height: 60px;
                    margin-bottom: 40px;
                }

                .control2{
                    width: 100%;
                    height: auto;
                    margin-bottom: 50px;
                }

                .control3{
                    width: 100%;
                    height: 40px;
                    margin-bottom: 25px;
                    border-bottom: solid 2px #424242;
                }

                .imagen{
                    width: 70%;
                    height: 300px;
                    background: gray;
                    margin-left: 130px;
                }

                .acomodar{
                    width: 100%;
                    height: 300px;
                }

                .conte-descripcion{
                    width: 100%;
                    height: auto; 
                    text-align: justify;
                }

                .contenido-conferencias{
                    width: 100%;
                    height: auto;
                }
            </style>

        </head>

        <body>
            <div id="pageHeader" style="border-bottom: 2px solid #ddd; height: 100px;">
            
                <p style="font-size: 40px; margin-left: 20px; color: #2a4374;"><img src="{{image}}" class="logo"> Academic Events</p>
            </div>
            <div id="pageFooter" style="border-top: 2px solid #ddd; padding-top: 5px;">
                <p style="color: #666; width: 70%; margin: 0; padding-bottom: 5px; text-align: let; font-family: sans-serif; font-size: .65em; float: left;"></p>
                <p style="color: #666; margin: 0; padding-bottom: 5px; text-align: right; font-family: sans-serif; font-size: .65em">Página {{page}} de {{pages}}</p>
            </div>

            <div class="contenedor-contenido">
                <div class="control3">
                    <h1>`+nombreevento+`</h1>
                </div>

                <div class="imagen">
                    <img src="{{imageTitulo}}" class="acomodar">
                </div>

                <div class="control">
                    <p style="font-size: 19px; font-weight: bold;">Evento llevado a cabo por la Institución:</p>
                    <p style="font-size: 20px;">`+Institucion+`</p>
                </div>

                <div class="control2">
                    <p style="font-size: 19px; font-weight: bold;">Descripción del evento:</p>
                    <div class="conte-descripcion">
                        <p style="font-size: 19px;">
                            `+Descripcion+`
                        </p>
                    </div>
                </div>
                
                <div class="control">
                    <p style="font-size: 19px; font-weight: bold;">Fecha de inicio:</p>
                    <p style="font-size: 20px;">`+FechaInicio+`</p>
                </div>

                <div class="control">
                    <p style="font-size: 19px; font-weight: bold;">Fecha de finalización:</p>
                    <p style="font-size: 20px;">`+FechaFinal+`</p>
                </div>

                <div class="control">
                    <p style="font-size: 19px; font-weight: bold;">Tipo de evento:</p>
                    <p style="font-size: 20px;">`+TipoEvento+`</p>
                </div>

                <div class="control">
                    <p style="font-size: 19px; font-weight: bold;">Organizado por:</p>
                    <p style="font-size: 20px;">`+Organizador+`</p>
                </div>

                <table class="contenido-conferencias" id="lista-conferencias">
                    <tbody id="contenido-conferencia">
                        `+temporal+`
                    </tbody>
                </table>
            </div>
        </body>
    </html>
    `;
    
////traemos el directorio para las imagenes
    var image = path.join('file://', __dirname,'..','..','..','/Frontend/img','logo.png')
    content= content.replace('{{image}}', image)
    var imageTitulo = path.join('file://', __dirname,'..','..','..','/Frontend/img_Eventos',Imagen)
    content= content.replace('{{imageTitulo}}', imageTitulo)

  

    pdf.create(content).toFile('./Backend/database/pdf/InfoEventos/'+filename, function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });

    return filename;
}catch(error){
    console.log('Ha Ocurrido Un Error')
return error.pdf
}

}




module.exports = {
    "Crearpdf": Crearpdf
};
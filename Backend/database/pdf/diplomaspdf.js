const pdf = require('html-pdf');
const path = require('path');

function formatDate(date){
    const months = ["JAN", "FEB", "MAR","APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
      let formatted_date = date.getDate() + "-" + months[date.getMonth()] + "-" + date.getFullYear()
      return formatted_date;
  }

///funcion de nombre aleatorio
function NombreArchivo(id,nombre) {
        //uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        return ('Diploma'+id+ '-' +nombre+'.pdf')
    }

function CrearDiplomaPdf(result,resultado,nfirmas,nombreF1,cargo1,nombreF2,cargo2,nombreF3,cargo3){
    const resultConferencia= result;
    const resultadoEvento=resultado;
    var nfirmasD= nfirmas;
    var nombre1=nombreF1;
    var cargoF1= cargo1;
    var nombre2=nombreF2;
    var cargoF2=cargo2;
    var nombre3=nombreF3;
    var cargoF3=cargo3;
    const id=resultConferencia[0].ID_Conferencia
    const n=resultConferencia[0].Nombre_Conferencia;
    var filename = NombreArchivo(id,n)
    try{
var diplo=''

if (nfirmasD==3){
    for(item1 of resultConferencia){
diplo=diplo+`<body>
<div class="conte-diploma">
            <div class="barra-superior"></div>
            <div class="barra-superior2">
                <div class="barra-ovalo">
                    <div class="logo-GD"><img src="{{image}}" class="logo-GD"></div>
                    <p style="font-weight: bold; text-align: center;font-size: 20px;" >Otorga el presente:</p>
                </div>
            </div>
            <div class="conte-palabradiploma">
                <h1 style="font-size: 45px; text-align: center;">DIPLOMA</h1>
            </div>
            <div class="contenido-GD">
                <p style="float: left; margin-top: 35px; font-weight: bold; font-size: 20px;">A:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox-GD" value="`+item1['Nombre_Usuario']+`" readonly>
            </div>
            <div class="contenido2-GD">
                <p style="font-size: 20px; font-weight: bold; text-align: center; margin-top:40px;">Por su destacada participación en la conferencia/taller:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox1-GD" value="`+item1['Nombre_Conferencia']+`" readonly>
            </div>
            <div class="contenido1-GD">
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">A través de la modalidad:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['Descripcion_Modalidad']+`" readonly>
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">, en la fecha:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['F_Final_Conferencia'].toISOString().split('T')[0]+`" readonly>
            </div>
            <div class="blancodiploma"></div>
<div class="conte-tablafirmas">
    <table id="tabla-firmas" class="tabla-firmas" CELLSPACING=9>
        <thead>
            <tr>
                <th class="celda-firma">
                <div class="textbox-firma"></div>
                <p style="font-size: 20px; font-weight: lighter;">`+nombre3+`<br>`+cargoF3+`</p>
                </th>
                <th class="celda-firma">
                    <div class="textbox-firma"></div>
                <p style="font-size: 20px; font-weight: lighter;">`+nombre2+`<br>`+cargoF2+`</p>
                </th>
                <th class="celda-firma">
                    <div class="textbox-firma"></div>
                <p style="font-size: 20px; font-weight: lighter;">`+nombre1+`<br>`+cargoF1+`</p>
                </th>
            </tr>
        </thead>
    </table>
</div>
<div class="barra-inferior"></div>
<div class="barra-inferior2"></div>
</div>   
</body> `
    }
}else{
    if(nfirmasD==2){
        for(item1 of resultConferencia){
            diplo=diplo+`<body>
            <div class="conte-diploma">
            <div class="barra-superior"></div>
            <div class="barra-superior2">
                <div class="barra-ovalo">
                    <div class="logo-GD"><img src="{{image}}" class="logo-GD"></div>
                    <p style="font-weight: bold; text-align: center;font-size: 20px;" >Otorga el presente:</p>
                </div>
            </div>
            <div class="conte-palabradiploma">
                <h1 style="font-size: 45px; text-align: center;">DIPLOMA</h1>
            </div>
            <div class="contenido-GD">
                <p style="float: left; margin-top: 35px; font-weight: bold; font-size: 20px;">A:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox-GD" value="`+item1['Nombre_Usuario']+`" readonly>
            </div>
            <div class="contenido2-GD">
                <p style="font-size: 20px; font-weight: bold; text-align: center; margin-top:40px;">Por su destacada participación en la conferencia/taller:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox1-GD" value="`+item1['Nombre_Conferencia']+`" readonly>
            </div>
            <div class="contenido1-GD">
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">A través de la modalidad:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['Descripcion_Modalidad']+`" readonly>
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">, en la fecha:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['F_Final_Conferencia'].toISOString().split('T')[0]+`" readonly>
            </div>
            <div class="blancodiploma"></div>
            <div class="conte-tablafirmas">
                <table id="tabla-firmas" class="tabla-firmas" CELLSPACING=9>
                    <thead>
                        <tr>
                            <th class="celda-firma">
                                <div class="textbox-firma"></div>
                                <p style="font-size: 20px; font-weight: lighter;">`+nombre2+`<br>`+cargoF2+`</p>
                            </th>
                            <th class="celda-firma">
                                <div class="textbox-firma"></div>
                                <p style="font-size: 20px; font-weight: lighter;">`+nombre1+`<br>`+cargoF1+`</p>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="barra-inferior"></div>
            <div class="barra-inferior2"></div>
            </div>   
            </body> `
                }
    }else{
        for(item1 of resultConferencia){
            diplo=diplo+`<body>
            <div class="conte-diploma">
            <div class="barra-superior"></div>
            <div class="barra-superior2">
                <div class="barra-ovalo">
                    <div class="logo-GD"><img src="{{image}}" class="logo-GD"></div>
                    <p style="font-weight: bold; text-align: center;font-size: 20px;" >Otorga el presente:</p>
                </div>
            </div>
            <div class="conte-palabradiploma">
                <h1 style="font-size: 45px; text-align: center;">DIPLOMA</h1>
            </div>
            <div class="contenido-GD">
                <p style="float: left; margin-top: 35px; font-weight: bold; font-size: 20px;">A:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox-GD" value="`+item1['Nombre_Usuario']+`" readonly>
            </div>
            <div class="contenido2-GD">
                <p style="font-size: 20px; font-weight: bold; text-align: center; margin-top:40px;">Por su destacada participación en la conferencia/taller:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox1-GD" value="`+item1['Nombre_Conferencia']+`" readonly>
            </div>
            <div class="contenido1-GD">
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">A través de la modalidad:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['Descripcion_Modalidad']+`" readonly>
                <p style="float: left; margin-top: 10px; font-weight: bold; font-size: 20px;">, en la fecha:</p>
                <input type="text" id="txtNombreGD" name="NombreGD" class="textbox2-GD" value="`+item1['F_Final_Conferencia'].toISOString().split('T')[0]+`" readonly>
            </div>
            <div class="blancodiploma"></div>
            <div class="conte-tablafirmas">
                <table id="tabla-firmas" class="tabla-firmas" CELLSPACING=9>
                    <thead>
                        <tr>
                            <th class="celda-firma">
                                <div class="textbox-firma"></div>
                                <p style="font-size: 20px; font-weight: lighter;">`+nombre1+`<br>`+cargoF1+`</p>
                            </th>
                        </tr>
                    </thead>
                </table>
            </div>
            <div class="barra-inferior"></div>
            <div class="barra-inferior2"></div>
            </div>   
            </body>`
                }
    }
}

var content=`
<!doctype html>
    <html>
       <head>
            <meta charset="utf-8">
            <title>PDF Result Template</title>

            <style>
                .conte-diploma{
                    width: 100%;
                    height: 710px;
                    background: #ffffff;
                    border: solid 1px #a1a1a1;
                    page-break-inside: avoid;
                }

                .barra-superior{
                    width: 100%;
                    height: 40px;
                    background: #2a4374;
                }

                .barra-superior2{
                    width: 100%;
                    height: 70px;
                    background: #489c95;
                }

                .barra-ovalo{
                    width: 98.6%;
                    height: 120px;
                    background: #ffffff;
                    border-radius: 300px/50px;
                    margin-top: 15px;
                    position: absolute;
                }

                .conte-palabradiploma{
                    width: 30%;
                    height: 45px;
                    margin: auto;
                    margin-top: 65px;
                }

                .logo-GD{
                    width: 70px;
                    height: 70px;
                    margin: auto;
                }

                .contenido-GD{
                    width: 65%;
                    height: 50px;
                    margin: auto;
                    margin-top: 10px;
                }

                .contenido2-GD{
                    width: 64.5%;
                    height: 70px;
                    margin: auto;
                    margin-top: 20px;
                }

                .contenido1-GD{
                    width: 70%;
                    height: 40px;
                    margin-left: 16.5%;
                    margin-top: 30px;

                }

                .blancodiploma{
                    width:100%;
                    height: 40px;
                }

                .textbox-GD{
                    width: 91%;
                    height: 30px;
                    border:none;
                    text-align: center;
                    font-family: cambria;
                    font-size: 25px;
                    border-bottom: 1px solid #000000;
                    outline: none;
                    float: left;
                    margin-left: 1%;
                    padding-bottom: 5px;
                    margin-top:25px;
                }

                .textbox1-GD{
                    width: 91%;
                    height: 30px;
                    border:none;
                    text-align: center;
                    font-family: cambria;
                    font-size: 20px;
                    border-bottom: 1px solid #000000;
                    outline: none;
                    margin-left: 4.5%;
                }

                .textbox2-GD{
                    width: 25%;
                    height: 30px;
                    border:none;
                    text-align: center;
                    font-family: cambria;
                    font-size: 20px;
                    border-bottom: 1px solid #000000;
                    outline: none;
                    float: left;
                    margin-left: 1%;
                }

                .textbox-firma{
                    width: 250px;
                    height: 30px;
                    border-bottom: 1px solid #000000;
                    background: #ffffff;
                    margin: auto;
                    margin-top:15px;
                }

                .conte-tablafirmas{
                    width: 96%;
                    height: auto;
                    margin: auto;
                }

                .tabla-firmas{
                    width: 100%;  
                }

                .barra-inferior{
                    width: 100%;
                    height: 25px;
                    background: #489c95;
                }
                
                .barra-inferior2{
                    width: 100%;
                    height: 33px;
                    background: #2a4374
                }

            </style>
        </head>
        `+diplo+`
    </html>
`
    var options = {
        "height": "15.6cm",        // allowed units: mm, cm, in, px
        "width": "21cm",
        "border": {
            "top": "0.2cm",            // default is 0, units: mm, cm, in, px
            // "right": "1in",
            // "bottom": "0.1cm",
            // "left": "1.5in"
        },
    }

////traemos el directorio para las imagenes
    var image = path.join('file://', __dirname,'..','..','..','/Frontend/img','logo.png')
    content= content.replaceAll('{{image}}', image)
    // content= content.replace('{{image1}}', image)
    // var imageTitulo = path.join('file://', __dirname,'..','..','..','/Frontend/img_Eventos',Imagen)
    // content= content.replace('{{imageTitulo}}', imageTitulo)



    pdf.create(content,options).toFile('./Backend/database/pdf/Diplomas/'+filename, function(err, res) {
        if (err){
            console.log(err);
        } else {
            console.log(res);
        }
    });
    console.log(filename)
    return filename;

}catch(error){
    console.log(error)
return "error.pdf"
}

}




module.exports = {
    "CrearDiplomaPdf": CrearDiplomaPdf
};
//1 invocamos express
const express = require('express');
const app = express();

//Jorge: requerimos la libreria multer que esta en el archivo storage para el manejo de archivos
const upload = require('./Backend/database/storage');

//Manu: requerimos la libreria multer para la parte de Eventos (storageE)
const uploadE = require('./Backend/database/storageE');

//Manu : Requerimos la libreria Nodemailer para enviar Emails
const Mailer = require('./Backend/Mailer');

///Jorge; requiero documentPDF
const pdf= require('./Backend/database/pdf/documentPDF')

//Juan: Requiere pdfevento
const pdfEvento= require('./Backend/database/pdf/pdfevento')

///Jorge; requiero documentPDF
const pdfdiploma= require('./Backend/database/pdf/diplomaspdf')

//Excel
app.get('/download', function(req, res){
    var file ='./Frontend/img_Eventos/Participantes.xlsx';
    res.download(file); // Set disposition and send it.
});


//2. setamos urlencode para capturar los datos del formulario
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//3. invocamos a dotenv
const dotenv = require('dotenv');
dotenv.config({path:'./Backend/env/.env'}) 

//4. directorio publico
app.use('/static', express.static('Frontend'));
app.use('/static', express.static(__dirname + '/Frontend'));

//Jorge: Establecemos la ruta estica a las fotos privadas de perfil
app.use('/files',express.static('/Backend/database/uploads'));
app.use('/files', express.static(__dirname + '/Backend/database/uploads'));

//Manu: Establecemos la ruta estatica a las fotos de los eventos
app.use('/filesE',express.static('/Frontend/img_Eventos'));
app.use('/filesE', express.static(__dirname + '/Frontend/img_Eventos'));

//5. establecer el motor de plantillas
app.set('views', './Frontend/views');
app.set('view engine', 'ejs');

//6. invocamos a bcryptjs
const bcryptjs = require('bcryptjs');

//7. variables de session
const session= require('express-session');
app.use(session({
    secret: 'secret', //en esta parte decimos que es una clave secreta y queriendo podriamos utilizar un algoritmo que nos genere un algoritmo aleatorio
    resave: true,
    saveUninitialized: true
}));

//8 invocamos el modulo de conexion
const conexion = require('./Backend/database/db');
const { parse } = require('path/posix');
const { types } = require('mime-types');

//9. Establecemos las rutas a los paginas 
app.get('/', (req, res)=>{
    conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
        if(error){
            throw error
        }else{
            //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
            res.render('principal', {r:result});
        }
    });
});

///Jorge Modifique esto con variables de inicio de sesion
app.get('/Login', (req, res)=>{
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        res.render('Menu',{
            //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
        });
    }else{
        res.render('IniciarSesion');
    }
});
///Jorge Modifique esto con variables de inicio de sesion
app.get('/Registro', (req, res)=>{
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        res.render('Menu',{
            //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
        });
    }else{
        res.render('Registro');
    }
});

///Jorge: Ruta al menu despues de hacer login 
app.get('/Menu', (req, res)=>{
    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        res.render('Menu',{
            //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/Terminos', (req, res)=>{
    res.render('terminos');
});

////Jorge: Imprimir lista de Participantes
app.get('/DescargaListaEvento/:ID/:Nombre', (req, res)=>{
    var EventoID = req.params.ID;
    conexion.query(`SELECT eventos.ID_Evento,eventos.Nombre_Evento,eventos.Descripcion_Evento,eventos.Fecha_Inicio,eventos.Fecha_Final,registro_usuario.ID_Usuario,registro_usuario.Nombre_Usuario, registro_usuario.Email_Usuario ,registro_usuario.Fotografia_Usuario FROM participante_evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario inner join eventos on eventos.ID_Evento= participante_evento.ID_Evento WHERE participante_evento.ID_Evento ='${EventoID}'`, (error,result)=>{
        if(error){
            var data =fs.readFileSync(__dirname +'/Backend/database/pdf/ListaEvento/error.pdf');
                res.contentType("application/pdf");
                res.send(data); 
        }else{
                const nombrePdf=pdf.listaPdf(result);
                setTimeout(function() {
                var data =fs.readFileSync(__dirname +'/Backend/database/pdf/ListaEvento/'+nombrePdf);
                res.contentType("application/pdf");
                res.send(data);  
                }, 4000);
                }
            })
            
        }
        )
    ///funcion de pdf
    

app.get('/EventosAcademicos', (req, res)=>{
   
    if(req.session.loggedin){
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                            if(error){

                            }else{
                                //Eventos cerrados del loguaeado
                                var EmailU = req.session.email;
                                conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                    if(error){
                                        throw error
                                    }else{
                                        //Nombre del encargado del evento (Organizador del evento)
                                        conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                            if(error){
                                                throw error
                                            }else{
                                                res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                    login: true,
                                                    User: req.session.name,
                                                    ID: req.session.id, 
                                                    fotoUser: req.session.fotoUser
                                                });
                                            }
                                        })      
                                    }
                                })
                                //fin de los eventos cerrados
                            }
                        });
                    }
                });
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
        
    }
    
});

app.get('/MisEventos', (req, res)=>{

    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario INNER JOIN tipo_evento ON eventos.ID_Tipo = tipo_evento.ID_Tipo WHERE Email_Usuario =  '${EmailU}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE registro_usuario.Email_Usuario = '${EmailU}'`, (err, results)=>{
                    res.render('MisEventos', {r:result,re:results, 
                        login: true,
                        User: req.session.name,
                        ID: req.session.id, 
                        fotoUser: req.session.fotoUser,
                        email: req.session.email
                    });
                });
                
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});


//Estadisticas a nivel de evento
app.get('/EstadisticasEventosCoT/:ID', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.ID;

    if(req.session.loggedin){
        //Nombre del evento
        conexion.query(`SELECT * FROM eventos WHERE ID_Evento = '${IdEvento}'`,(error, rEvento)=>{
            if(error){
                throw error;
            }else{
                //Conferencias del evento
                conexion.query(`SELECT * FROM conferencias_evento WHERE ID_Evento = '${IdEvento}'`,(error, rConferencias)=>{
                    if(error){
                        throw error;
                    }else{
                        //Participantes del evento COUNT(*) as count
                        conexion.query(`SELECT COUNT(*) as count FROM participante_evento WHERE ID_Evento ='${IdEvento}'`,(error, rPartiEven)=>{
                            if(error){
                                throw error;
                            }else{
                                //Todas las conferencias en general 
                                conexion.query(`SELECT * FROM participantes_conferencia`,(error, rPartiCoT)=>{
                                    if(error){
                                        throw error;
                                    }else{
                                        conexion.query(`SELECT * FROM imagen_evento WHERE ID_Evento = '${IdEvento}' LIMIT 1`, (error, rImgEvent)=>{
                                            if (error) {
                                                throw error
                                            }else{
                                                var img = rImgEvent[0].Url_Evento;
                                                var listCoT = [];
                                                var listPartCoT = [];
                                                //contador de participantes
                                                var contador = 0;
                                                //contadores de Conferencias y talleres
                                                var taller = 0;
                                                var conferencia = 0;
                                                rConferencias.forEach(function(CoT){
                                                    console.log(CoT.Nombre_Conferencia);
                                                    listCoT.push(CoT.Nombre_Conferencia);
                                                    contador = 0;
                                                    rPartiCoT.forEach(function(parCoT){
                                                        if(CoT.ID_Conferencia == parCoT.ID_Conferencia){
                                                            contador= contador+1;
                                                        }
                                                    })
                                                    
                                                    listPartCoT.push(contador)

                                                    if(CoT.ID_Reunion == 1){
                                                        conferencia=conferencia+1;
                                                    }else{
                                                        taller=taller+1;
                                                    }
                                                    
                                                })
                                                
                                                res.render('EstadisticasEventos', {EnventoNombre:rEvento[0].Nombre_Evento, PartiEvento:rPartiEven[0].count,
                                                    listCOT:rConferencias, listaCoT:listCoT, listaPartCoT:listPartCoT, totalTaller:taller, totalConferencia:conferencia,
                                                    login: true, img:img
                                                    });

                                            }
                                        });
                                        
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/descargarpdf/:Id/:nombre', function(req, res){
    var IdEvento = req.params.Id;

    if(req.session.loggedin){
        conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON registro_usuario.ID_Usuario = eventos.ID_Organizador INNER JOIN tipo_evento ON tipo_evento.ID_Tipo = eventos.ID_Tipo WHERE eventos.ID_Evento ='${IdEvento}'`, (error, resu)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM imagen_evento WHERE ID_Evento = '${IdEvento}' LIMIT 1`, (error, rimg) =>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM conferencias_evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion INNER JOIN modalidad on modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad WHERE conferencias_evento.ID_Evento=${IdEvento}`, (error,result)=>{
                            if(error){
                                throw error
                            }else{
                                conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${IdEvento}'`, (error, results)=>{
                                    if(error){
                                        throw error
                                    }else{
                                            const nombrePdf=pdfEvento.Crearpdf(result, resu, rimg);
                                            setTimeout(function() {
                                            var data = fs.readFileSync(__dirname +'/Backend/database/pdf/InfoEventos/'+nombrePdf);
                                            res.contentType("application/pdf");
                                            res.send(data);  
                                            }, 4000);
                                        }
                                })
                                
                            }
                        });
                    }
                });
            }
        });
    }
    else{

    }
});

//Creamos la variable global la cual tendra el Id del evento al cual queremos crear una conferencia o taller
global.ID_Evento_CrearConferencia = new Number();

app.get('/AgregarConferencia/:Id', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.Id;
    
    //Le pasamos el valor del id a la variable global;
    ID_Evento_CrearConferencia = IdEvento;

    if(req.session.loggedin){
        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
            if(error){
                throw error
            }else{
                res.render('AgregarConferencia', { Evento:results[0].Nombre_Evento })
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

//Metodo para ver las conferencias disponibles desde MisEventos
app.get('/InformacionConferencias/:Id', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.Id;
    
    //Le pasamos el valor del id a la variable global;
    ID_Evento_CrearConferencia = IdEvento;

    if(req.session.loggedin){
        conexion.query(`SELECT * FROM conferencias_evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion INNER JOIN modalidad on modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad WHERE conferencias_evento.ID_Evento=${ID_Evento_CrearConferencia}`, (error,result)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        res.render('InformacionConferencias', {
                            r:result, Evento:results[0].Nombre_Evento, idEvento:ID_Evento_CrearConferencia
                        })
                    }
                })
                
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});



app.get('/InformacionConferenciasPublico/:Id', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.Id;
    
    //Le pasamos el valor del id a la variable global;
    ID_Evento_CrearConferencia = IdEvento;

    if(req.session.loggedin){
        conexion.query(`SELECT * FROM conferencias_evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion INNER JOIN modalidad on modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad WHERE conferencias_evento.ID_Evento=${ID_Evento_CrearConferencia}`, (error,result)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        res.render('InformacionConferenciasPublico', {
                            r:result, Evento:results[0].Nombre_Evento
                        })
                    }
                })
                
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

//metodo para ver el perfil publico

app.get('/Organizador/PerfilPublico/:ID', (req, res)=>{
    var ID_Organizador= req.params.ID;
    console.log(ID_Organizador)
    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM registro_usuario WHERE ID_Usuario='${ID_Organizador}'`, (error, result)=>{
            if(error){
                throw error;
            }else{
                res.render('PerfilPublico',{Nombre:result[0].Nombre_Usuario, 
                                            Institucion:result[0].Institucion_Academica,
                                            Formacion:result[0].Formacion,
                                            Descripcion:result[0].Descripcion_Usuario,
                                            Fotografia:result[0].Fotografia_Usuario});
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/Organizador/PerfilPublicoInscripciones/:ID', (req, res)=>{
    var ID_Organizador= req.params.ID;
    console.log(ID_Organizador)
    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM registro_usuario WHERE ID_Usuario='${ID_Organizador}'`, (error, result)=>{
            if(error){
                throw error;
            }else{
                res.render('PerfilPublicoInscripciones',{Nombre:result[0].Nombre_Usuario, 
                                            Institucion:result[0].Institucion_Academica,
                                            Formacion:result[0].Formacion,
                                            Descripcion:result[0].Descripcion_Usuario,
                                            Fotografia:result[0].Fotografia_Usuario});
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});
///Jorge Menu Perfil publico 
app.get('/PerfilPersonal',(req,res)=>{
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        res.render('PerfilPersonal',{
            //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
            Instituto: req.session.instituto,
            Formacion: req.session.formacion,
            Descripcion:req.session.descripcion
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
});

///Jorge: Editar Perfil 
app.get('/EditarPerfil',(req,res)=>{
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        res.render('EditarPerfil',{
            //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
            Instituto: req.session.instituto,
            Formacion: req.session.formacion,
            Descripcion:req.session.descripcion,
            Email:req.session.email,
            Password: req.session.pass,
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
});

app.get('/MisInscripciones', (req, res)=>{

    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`,(error,resultadoId)=>{
            if(error){
                throw error
            }else{
                var IDusuario = resultadoId[0].ID_Usuario;
                conexion.query(`SELECT * FROM participante_evento INNER JOIN eventos on participante_evento.ID_Evento = eventos.ID_Evento INNER JOIN tipo_evento on eventos.ID_Tipo = tipo_evento.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE participante_evento.ID_Usuario ='${IDusuario}'`, (error, result)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM participante_evento INNER JOIN imagen_evento on imagen_evento.ID_Evento = participante_evento.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE registro_usuario.Email_Usuario='${EmailU}'`, (err, results)=>{
                            res.render('MisInscripciones', {r:result,re:results, 
                                login: true,
                                User: req.session.name,
                                ID: req.session.id, 
                                fotoUser: req.session.fotoUser,
                                email: req.session.email
                            });
                        });
                        
                    }
                });
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/CancelarInscripcion/:ID', (req, res)=>{
    var EventoID= req.params.ID;
    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`,(error,resultadoId)=>{
            if(error){
                throw error
            }else{
                var IDusuario = resultadoId[0].ID_Usuario;
                conexion.query(`DELETE FROM participante_evento WHERE ID_Usuario='${IDusuario}' AND ID_Evento='${EventoID}'`, (error,rdeleteEvento)=>{
                    if(error){
        
                    }else{
                        conexion.query(`SELECT * FROM participante_evento INNER JOIN eventos on participante_evento.ID_Evento = eventos.ID_Evento INNER JOIN tipo_evento on eventos.ID_Tipo = tipo_evento.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE participante_evento.ID_Usuario ='${IDusuario}'`, (error, result)=>{
                            if(error){
                                throw error
                            }else{
                                conexion.query(`SELECT * FROM participante_evento INNER JOIN imagen_evento on imagen_evento.ID_Evento = participante_evento.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE registro_usuario.Email_Usuario='${EmailU}'`, (err, results)=>{
                                    res.render('MisInscripciones', {r:result,re:results, 
                                        login: true,
                                        User: req.session.name,
                                        ID: req.session.id, 
                                        fotoUser: req.session.fotoUser,
                                        email: req.session.email,
                                        ///Esta alerta no es necesaria
                                        // alert: true,
                                        // alertTitle: "Inscripcion cancelada",
                                        // alertMessage: "La inscripcion ha sido cancelado con éxito",
                                        // alertIcon: 'success',
                                        // showConfirmButton:false,
                                        // timer:1500
                                    });
                                });
                                
                            }
                        });
                    }
                })
                
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

///Jorge: Ruta con autenticacion
app.get('/OrganizarEvento', (req, res)=>{
    if(req.session.loggedin){
        res.render('OrganizarEvento',{
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
});

app.get('/HistorialEventos', (req, res)=>{
    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        var EmailU = req.session.email;
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario ='${EmailU}'`, (error,rUsuario)=>{
            if(error){
                throw error
            }else{
                var UsuarioID = rUsuario[0].ID_Usuario;
                conexion.query(`SELECT * FROM eventos INNER JOIN participante_evento on participante_evento.ID_Evento = eventos.ID_Evento INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE eventos.ID_Estado = 3 AND registro_usuario.ID_Usuario ='${UsuarioID}'`,(error, rHistorial)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado = 3`, (error, rNombreUsuario)=>{
                            if(error){
                                throw error
                            }else{
                                res.render('Historial',{
                                    re:rNombreUsuario,
                                    r:rHistorial,
                                    login: true,
                                });
                            }
                        })
                        
                    }
                })
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/EliminarHistorial/:ID', (req, res)=>{
    var EventoID= req.params.ID;
    if(req.session.loggedin){
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`,(error,resultadoId)=>{
            if(error){
                throw error
            }else{
                var IDusuario = resultadoId[0].ID_Usuario;
                conexion.query(`DELETE FROM participante_evento WHERE ID_Usuario='${IDusuario}' AND ID_Evento='${EventoID}'`, (error,rdeleteEvento)=>{
                    if(error){
        
                    }else{
                        conexion.query(`SELECT * FROM eventos INNER JOIN participante_evento on participante_evento.ID_Evento = eventos.ID_Evento INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE eventos.ID_Estado = 3 AND registro_usuario.ID_Usuario ='${IDusuario}'`,(error, rHistorial)=>{
                            if(error){
                                throw error
                            }else{
                                conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado = 3`, (error, rNombreUsuario)=>{
                                    if(error){
                                        throw error
                                    }else{
                                        res.render('Historial',{
                                            re:rNombreUsuario,
                                            r:rHistorial,
                                            login: true,
                                            alert:true,
                                            alertTitle:"Historial eliminado",
                                            alertMessage:"Se ha eliminado el evento del historial con exito",
                                            alertIcon:'success',
                                            showConfirmButton:true,
                                            timer: 1500,
                                        });
                                    }
                                })
                                
                            }
                        })
                    }
                })
                
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});
app.get('/Estadisticas/:IDCoT', (req,res)=>{
    var IdCoT= req.params.IDCoT;
    if(req.session.loggedin){
        conexion.query(`SELECT COUNT(*) as count FROM participante_evento WHERE ID_Evento = '${ID_Evento_CrearConferencia}'`, (error, rParEven)=>{
            if(error){
                throw error;
            }else{
                conexion.query(`SELECT COUNT(*) as count FROM participantes_conferencia WHERE ID_Conferencia = '${IdCoT}'`,(error, rPartCoT)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error,rEventoNombre)=>{
                            if(error){
                                throw error
                            }else{
                                conexion.query(`SELECT * FROM conferencias_evento WHERE ID_Conferencia ='${IdCoT}'`,(error,rNombreCoT)=>{
                                    if(error){
                                        throw error
                                    }else{
                                        var nombreE = rEventoNombre[0].Nombre_Evento;
                                        var nombreCoT = rNombreCoT[0].Nombre_Conferencia;

                                        var participantesEvento= rParEven[0].count;
                                        var participantesCoT = rPartCoT[0].count;
                                        var porcentajePresente = ((participantesCoT/participantesEvento)*100);
                                        var porcentajeNoPresentes = 100 - porcentajePresente;
                                        console.log(rParEven)
                                        if(rParEven[0].count == 0){
                                            participantesEvento= 0;
                                            participantesCoT = 0;
                                            porcentajePresente = 0;
                                            porcentajeNoPresentes = 0;
                                        }
                                        
                                        
                                        res.render(`Estadisticas`,{
                                            pE:participantesEvento,
                                            pCoT:participantesCoT,
                                            pP:porcentajePresente.toFixed(2),
                                            pNP:porcentajeNoPresentes.toFixed(2),
                                            nCot:nombreCoT,
                                            nE:nombreE,
                                            idE:ID_Evento_CrearConferencia,
                                            idconferencia:IdCoT
                                        });
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
})

app.get('/ListaDeParticipantes/:ID', (req, res)=>{
    var EventoID = req.params.ID;
    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        conexion.query(`SELECT * FROM participante_evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE participante_evento.ID_Evento ='${EventoID}'`, (error,rP)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento='${EventoID}'`,(error,rEvento)=>{
                    if(error){
                        throw errorr
                    }else{
                        var contador = 0;
                        res.render('ParticipantesInscritos',{r:rP,Evento:rEvento[0].Nombre_Evento,contador:contador, ID_Evento:EventoID});
                    }
                })
                
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});

app.get('/ListaDeParticipantesPresentes/:ID/:IDConferencia?', (req, res)=>{
    var EventoID = req.params.ID;
    var IDCoT = req.params.IDConferencia;
    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        conexion.query(`SELECT * FROM participante_evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE participante_evento.ID_Evento ='${EventoID}'`, (error,rP)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento='${EventoID}'`,(error,rEvento)=>{
                    if(error){
                        throw errorr
                    }else{
                        var contador = 0;
                        //Query para ver los participantes presentes en la conferencia
                        conexion.query(`SELECT * FROM participantes_conferencia WHERE ID_Conferencia ='${IDCoT}'`, (error, resu) =>{
                            if (error){
                                throw error
                            }else{
                                var tamano = resu.length;
                                var final = 0;
                                var checke = false;
                                res.render('ParticipantesInscritosParticipantes',{r:rP,Evento:rEvento[0].Nombre_Evento,contador:contador, ID_Evento:EventoID, idEvento:EventoID,
                                    t:tamano, f:final, ch:checke,rpar:resu,IDCoT:IDCoT});
                                
                                }
                            })
                    }
                })
                
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});


app.get('/AgregarEliminarParticipacion/:Id/:IDEvento?/:IDUsuario?', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdConferencia = req.params.Id;
    const IDevento = req.params.IDEvento;
    const IDusuario = req.params.IDUsuario;

    if(req.session.loggedin){
        var EmailU = req.session.email;
        //Query para obtener el ID del logeado
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`,(error,resultadoId)=>{
            if(error){
                throw error
            }else{
                //ID de usuario logeado
                var usuarioID = resultadoId[0].ID_Usuario;

                conexion.query(`SELECT * FROM participante_evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE participante_evento.ID_Evento ='${IDevento}'`, (error,rP)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento='${IDevento}'`,(error,rEvento)=>{
                            if(error){
                                throw errorr
                            }else{
                                var contador = 0;
                                conexion.query(`SELECT * FROM participantes_conferencia WHERE ID_Usuario = '${IDusuario}'  AND ID_Conferencia = '${IdConferencia}'`, (error, rveri)=>{
                                    if(rveri == ''){
                                        //Query para insertar el usuario y la conferencia de la tabla
                                        conexion.query('INSERT INTO participantes_conferencia SET ?', {ID_Usuario:IDusuario, ID_Conferencia:IdConferencia}, (error, rinsert) =>{
                                            if(error){
                                                throw error
                                            }else{
                                                //Query para ver los participantes presentes en la conferencia
                                                conexion.query(`SELECT * FROM participantes_conferencia WHERE ID_Conferencia ='${IdConferencia}'`, (error, resu) =>{
                                                if (error){
                                                    throw error
                                                }else{
                                                    var tamano = resu.length;
                                                    var final = 0;
                                                    var checke = false;
                                                    res.render('ParticipantesInscritosParticipantes',{r:rP,Evento:rEvento[0].Nombre_Evento,contador:contador, ID_Evento:IDevento, idEvento:IDevento,
                                                        t:tamano, f:final, ch:checke,rpar:resu,IDCoT:IdConferencia});
                                                    
                                                    }
                                                })
                                            }
                                        })
                                    }else{
                                        //Query para borrar el usuario y la conferencia de la tabla
                                        conexion.query(`DELETE FROM participantes_conferencia WHERE ID_Usuario ='${IDusuario}' AND ID_Conferencia = '${IdConferencia}'`, (error, rinsert) =>{
                                            if(error){
                                                throw error
                                            }else{
                                                //Query para ver los participantes presentes en la conferencia
                                                conexion.query(`SELECT * FROM participantes_conferencia WHERE ID_Conferencia ='${IdConferencia}'`, (error, resu) =>{
                                                    if (error){
                                                        throw error
                                                    }else{
                                                        var tamano = resu.length;
                                                        var final = 0;
                                                        var checke = false;
                                                        res.render('ParticipantesInscritosParticipantes',{r:rP,Evento:rEvento[0].Nombre_Evento,contador:contador, ID_Evento:IDevento, idEvento:IDevento,
                                                            t:tamano, f:final, ch:checke,rpar:resu,IDCoT:IdConferencia});
                                                        
                                                        }
                                                    })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                        
                    }
                })

                
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    } 
});

app.get('/InformacionConferenciasInscripcion/:Id', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.Id;
    
    //Le pasamos el valor del id a la variable global;
    ID_Evento_CrearConferencia = IdEvento;

    if(req.session.loggedin){
        var EmailU = req.session.email;
        //Query para obtener el ID del logeado
        conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`,(error,resultadoId)=>{
            if(error){
                throw error
            }else{
                //ID de usuario logeado
                var usuarioID = resultadoId[0].ID_Usuario;
                //Query para traer la informacion de las conferencias segun el evento
                conexion.query(`SELECT * FROM conferencias_evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion INNER JOIN modalidad on modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad WHERE conferencias_evento.ID_Evento=${ID_Evento_CrearConferencia}`, (error,result)=>{
                    if(error){
                        throw error
                    }else{
                        //Query para traer  el nombre del evento
                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                            if(error){
                                throw error
                            }else{
                                //Query para ver los participantes presentes en la conferencia
                                conexion.query(`SELECT * FROM participantes_conferencia INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participantes_conferencia.ID_Usuario WHERE registro_usuario.ID_Usuario = '${usuarioID}'`, (error, resu) =>{
                                if (error){
                                    throw error
                                }else{
                                    console.log("Estos son los resultados de participante conferencia=", resu);
                                    console.log("Estos son los resultados de conferencias evento=", result);
                                    console.log("Estos son los resultados de el nombre del evento=", results);
                                    var tamano = resu.length;
                                    var final = 0;
                                    var checke = false;
                                    res.render('InformacionConferenciasInscripciones', {
                                            r:result, Evento:results[0].Nombre_Evento, rpar:resu, t:tamano, f:final, ch:checke
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            }
        });
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
});




//Metodos

//metodo de actualizacion y filtrado de datos en la tabla de eventos de la pagina principal
app.post("/search", (req,res)=>{
    var search = req.body.filtrar;
    var texto = req.body.bucarEvento;
    if(search=="Nombre"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Nombre_Evento LIKE '%${texto}%'`, (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result});
            }
        });
    }else if(search=="Estado"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Descripcion='${texto}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result});
            }
        });
    }else if(search=="Fecha"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Fecha_Inicio='${texto}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result});
            }
        });
    }
});

//metodo de actualizacion y filtrado de datos en la tabla de eventos de la pagina de EventosAcademicos
app.post("/searchEvento", (req,res)=>{
    var search = req.body.filtrar;
    var texto = req.body.buscarEvento;
    if(search=="Nombre"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Nombre_Evento LIKE '%${texto}%'`, (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                            if(error){
                                throw error
                            }else{
                                 //Eventos cerrados del loguaeado
                                 var EmailU = req.session.email;
                                 conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                     if(error){
                                         throw error
                                     }else{
                                         //Nombre del encargado del evento (Organizador del evento)
                                         conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                             if(error){
                                                 throw error
                                             }else{
                                                 res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                     login: true,
                                                     User: req.session.name,
                                                     ID: req.session.id, 
                                                     fotoUser: req.session.fotoUser
                                                 });
                                             }
                                         })      
                                     }
                                 })
                                 //fin de los eventos cerrados
                            }
                        });
                    }
                });
            }
        });
    }else if(search=="Estado"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Descripcion='${texto}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                            if(error){

                            }else{
                                 //Eventos cerrados del loguaeado
                                 var EmailU = req.session.email;
                                 conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                     if(error){
                                         throw error
                                     }else{
                                         //Nombre del encargado del evento (Organizador del evento)
                                         conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                             if(error){
                                                 throw error
                                             }else{
                                                 res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                     login: true,
                                                     User: req.session.name,
                                                     ID: req.session.id, 
                                                     fotoUser: req.session.fotoUser
                                                 });
                                             }
                                         })      
                                     }
                                 })
                                 //fin de los eventos cerrados
                            }
                        });
                    }
                });
            }
        });
    }else if(search=="Fecha"){
        conexion.query(`SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2 AND Fecha_Inicio='${texto}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                            if(error){

                            }else{
                                 //Eventos cerrados del loguaeado
                                 var EmailU = req.session.email;
                                 conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                     if(error){
                                         throw error
                                     }else{
                                         //Nombre del encargado del evento (Organizador del evento)
                                         conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                             if(error){
                                                 throw error
                                             }else{
                                                 res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                     login: true,
                                                     User: req.session.name,
                                                     ID: req.session.id, 
                                                     fotoUser: req.session.fotoUser
                                                 });
                                             }
                                         })      
                                     }
                                 })
                                 //fin de los eventos cerrados
                            }
                        });
                    }
                });
            }
        });
    }
});





/// Jorge sirve para borrar archivos 
const fs = require('fs');
const { Console } = require('console');

//Jorge: Registro de Usuario Respuesta al llamado del metodo post se llama al middleware upload para subir la imagen
app.post('/Registro',upload.single('avatar'),async(req,res)=>{
    ///Se capturan los datos del formulario
        const usuario = req.body.usuario;
        const correo = req.body.correo;
        const institucion = req.body.instituto;
        const formacion = req.body.formacion;
        const descripcion = req.body.descripcion;
        const pass = req.body.pass;
        let passwordHash = await bcryptjs.hash(pass, 8);
        /// Se recibe el nombre del archivo subido
        const foto =req.file.filename;
        ///Consultamos si el correo ya existe 
        conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
            ///Si es igual a 0 no existe    
            if(results.length == 0){
                //// Insertaos en la tabla
                    conexion.query('INSERT INTO registro_usuario SET ?',{Nombre_Usuario:usuario,Email_Usuario:correo,
                        Institucion_Academica:institucion,Formacion:formacion,Descripcion_Usuario:descripcion,
                        Password_Usuario:passwordHash,Fotografia_Usuario:foto,
                        ///Verificamos si hay error en al ingresar
                        }, async(error,result)=>{
                            if(error){
                                res.send('Error al ingresar');
                            }else{
                                conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                                    if(results.length == 0 || !(await bcryptjs.compare(pass,results[0].Password_Usuario))){
                                        res.render('IniciarSesion',{
                                            alert:true,
                                            alertTitle:"Error",
                                            alertMessage:"Usuario y/o contraseña incorrecta, intente de nuevo",
                                            alertIcon:'error',
                                            showConfirmButton:true,
                                            timer:2000,
                                            ruta:'Login'
                                    });
                                }else{
                                    ///Creamos las variables de inicio de session 
                                    req.session.loggedin= true;
                                    req.session.name = results[0].Nombre_Usuario;
                                    req.session.id= results[0].ID_Usuario;
                                    req.session.fotoUser= results[0].Fotografia_Usuario;
                                    req.session.email=results[0].Email_Usuario;
                                    req.session.instituto= results[0].Institucion_Academica;
                                    req.session.formacion= results[0].Formacion;
                                    req.session.descripcion= results[0].Descripcion_Usuario;
                                    req.session.pass= pass;
                                    res.render('Registro',{
                                        alert:true,
                                        alertTitle:"Registro exitoso",
                                        alertMessage:"¡Bienvenido a Academic Events!",
                                        alertIcon:'success',
                                        showConfirmButton:true,
                                        timer: 1500,
                                        ruta:'Menu'
                                    });
                                }
                            })
                        }
                    });
            }else{
            ///Si ya existe te redirije al login 
            console.log('./Backend/database/uploads/'+foto)
            fs.unlink('./Backend/database/uploads/'+foto,function(err){
                if(err) return console.log(err);
                console.log('file deleted successfully');
                });  
                    res.render('Registro',{
                        alert: true,
                        alertTitle:"Registro",
                        alertMessage:"El correo ya está registrado",
                        alertIcon:'warning',
                        showConfirmButton: false,
                        timer: 2000,
                        ruta:'Login'
                    });
                }
            });
    });
    
    
    
    
    
    ///Metodo de login 
    app.post('/auth',async(req,res)=>{
        // traemos las variables del formulario
        const correo = req.body.correo;
        const pass= req.body.pass;
        let passwordHash = await bcryptjs.hash(pass,8);
        /// verificamos si las credenciales estan ingresadas en los textbox
        if(correo && pass){
            ///verificamos si el Registro existe o la contraseña es incorrecta
            conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                if(results.length == 0 || !(await bcryptjs.compare(pass,results[0].Password_Usuario))){
                    res.render('IniciarSesion',{
                        alert:true,
                        alertTitle:"Error",
                        alertMessage:"Usuario y/o contraseña incorrecta, intente de nuevo",
                        alertIcon:'error',
                        showConfirmButton:true,
                        timer:2000,
                        ruta:'Login'
                });
            }else{
                ///Creamos las variables de inicio de session 
                req.session.loggedin= true;
                req.session.name = results[0].Nombre_Usuario;
                req.session.id= results[0].ID_Usuario;
                req.session.fotoUser= results[0].Fotografia_Usuario;
                req.session.email=results[0].Email_Usuario;
                req.session.instituto= results[0].Institucion_Academica;
                req.session.formacion= results[0].Formacion;
                req.session.descripcion= results[0].Descripcion_Usuario;
                req.session.pass=pass;
                res.render('IniciarSesion',{
                    alert:true,
                    alertTitle:"Inicio de sesión exitoso",
                    alertMessage:"¡Bienvenido a Academic Events!",
                    alertIcon:'success',
                    showConfirmButton:false,
                    timer: 1500,
                    ruta:'Menu'
                    });
                }
            })
        }
        
    })


////logout 
app.get('/logout',(req,res)=>{
    req.session.destroy(()=>{
        res.redirect('/')
    })
})

///Jorge Requerimos xlsx para manejo de documentos excel
const XLSX= require('xlsx');
///Jorge Funcion Leer Excel 
function leerExcel(ruta,idEventoCreado){
    const workbook=XLSX.readFile('./Frontend/img_Eventos/'+ruta);
    const workbookSheets=workbook.SheetNames;
    const sheet= workbookSheets[0];
    const dataExcel= XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
    //console.log(dataExcel)
    for (const itemFila of dataExcel){
        //console.log(itemFila['Nombre'])
        //console.log(itemFila['Correo'])
        var nombre=itemFila['Nombre'];
        var correo=itemFila['Correo'];
        conexion.query('INSERT INTO lista_blanca SET?',{ID_Evento:idEventoCreado,Email_Participante:correo,Nombre_Participante:nombre},
        async(error,results)=>{
            if(error){
                console.log('Error al escribir excel en la base de datos')
            }else{
                console.log('Excel escrito Correctamente');
                conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Evento='${idEventoCreado}'`,(error,rEvento)=>{
                    if(error){
                        throw error
                    }else{
                        var nombreEvento = rEvento[0].Nombre_Evento;
                        var fechainicio = rEvento[0].Fecha_Inicio;
                        var fechafinal = rEvento[0].Fecha_Final;
                        var nombreEncargado = rEvento[0].Nombre_Usuario;
                        var email = itemFila['Correo']
                        Mailer.sendEmailEC(email,nombreEvento,fechainicio.toISOString().split('T')[0],fechafinal.toISOString().split('T')[0],nombreEncargado)
                    }
                })
            }
        })

    }
}

////


////Actualizar este metodo 

//Metodo Crear Evento
app.post('/OrganizarEvento',uploadE.fields([{ name: 'Galeria', maxCount: 10 }, { name: 'generarLista', maxCount: 1 }]),(req, res)=>{
    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        var EmailU = req.session.email;
        conexion.query(`SELECT ID_Usuario FROM registro_usuario WHERE Email_Usuario ='${EmailU}'`, (errorr, resul)=>{
            //Se setea Con los valores del query con la info del organizador el id
            var Idorganizador = resul[0].ID_Usuario; 
            ///Se traen los Valores del formulario para crear el evento
            const nombre = req.body.NombreEvento
            const institucion = req.body.institucion
            const descripcion = req.body.descripcionEvento
            const fechainicio = req.body.fechaInicio
            const fechafinal = req.body.fechaFinal
            ///arreglo de imagenes
            const imagenes = req.files['Galeria'];
            ////Recibe el excel 
            var excel="";
            try{
                listablanca = req.files['generarLista'];
                excel=listablanca[0].filename
            console.log(excel);
            }catch(error){
                console.log("Error No se Subio ningun excel")
            }
    
            const tipoEvento = req.body.tipoEvento;
            const FechaActual = new Date()
            var fecha = FechaActual.getFullYear() + '-' + ( FechaActual.getMonth() + 1 ) + '-' + FechaActual.getDate();
            var estado_evento = new Number();

            var fechaA = new Date(fecha);
            var fechaIEN = new Date(fechainicio);

            fechaIEN.setMinutes(fechaIEN.getMinutes() + fechaIEN.getTimezoneOffset())
            	
            console.log('Actual');
            console.log(fechaA);
            console.log('Evento');
            console.log(fechaIEN);

            
            // validamos las fechas
            if(fechaA.valueOf()>fechaIEN.valueOf()){
                console.log('Este es el if de error de fecha')
                res.render('OrganizarEvento', {
                    login: true,
                    User: req.session.name,
                    ID: req.session.id, 
                    fotoUser: req.session.fotoUser,
                    email: req.session.email,
                    alert: true,
                    alertTitle: "Error en la fecha",
                    alertMessage: "No se puede crear un evento con una fecha inicial anterior a la actual",
                    alertIcon: 'error',
                    showConfirmButton:false,
                    timer:3500,
                    ruta:''
                })
            }else{            
                console.log('Este es el if de de validacion')
                if(fechaA.valueOf()==fechaIEN.valueOf()){
                    estado_evento= 1;
                }else{
                    estado_evento= 2;
                }

                if(tipoEvento =='Abierto'){
                    TipoEventoFinal= 1;
                }else if(tipoEvento=='Cerrado'){
                    TipoEventoFinal= 2;
                }

                conexion.query('INSERT INTO eventos SET ?', {ID_Organizador:Idorganizador,Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
                    ID_Tipo:TipoEventoFinal, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:estado_evento}, async(error, results)=>{
                        if(error){
                            console.log(error);
                        }else{
                            //buscamo el ultimo ID_Evento en la base de datos (Fue el que crceamos en la consulta anterior)
                            conexion.query('SELECT ID_Evento FROM eventos WHERE ID_Evento = (SELECT max(ID_Evento) FROM eventos)',(error,resulta)=>{
                                if(error){
                                    console.log(error);
                                }else{
                                    imagenes.forEach(element => {
                                        conexion.query('INSERT INTO imagen_evento set ?',{ID_Evento:resulta[0].ID_Evento,Url_Evento:element.filename}, (error, resultIMG)=>{
                                            if(error){
                                                console.log(error)
                                            }else{
                                                
                                            }
                                        });
                                    });
                                    ///
                                    const idEventoExcel=resulta[0].ID_Evento;
                                    //// Si se sube documento
                                    if(excel !=""){
                                        leerExcel(excel,idEventoExcel);   
                                    }
                                    setTimeout(function() {
                                        fs.unlink('./Frontend/img_Eventos/'+excel,function(err){
                                        if(err) return console.log(err);
                                        console.log('file deleted successfully');
                                    });},4000) 
                                }
                            });
            
                            res.render('OrganizarEvento', {
                                login: true,
                                User: req.session.name,
                                ID: req.session.id, 
                                fotoUser: req.session.fotoUser,
                                email: req.session.email,
                                alert: true,
                                alertTitle: "Evento creado",
                                alertMessage: "El evento ha sido creado con éxito",
                                alertIcon: 'success',
                                showConfirmButton:false,
                                timer:1500,
                                ruta:'Menu'
                            })
                            
                        }
                    })
            } 
        })
        
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
    
    
});

//Metodo de Eliminar evento
app.get('/Delete/:ID',(req,res)=>{
    
    if(req.session.loggedin){
        var IDevento = req.params.ID;
        //si la variable es verdadera ingresa a la pagina    
        var EmailU = req.session.email;
        //si la variable es verdadera ingresa a la pagina
        conexion.query(`DELETE eventos FROM eventos WHERE eventos.ID_Evento= '${IDevento}'`, (error,resltado)=>{
            if(error){

            }else{
                conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario INNER JOIN tipo_evento ON eventos.ID_Estado = tipo_evento.ID_Tipo WHERE Email_Usuario = '${EmailU}'`, (error, result)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE registro_usuario.Email_Usuario = '${EmailU}'`, (err, results)=>{
                            res.render('MisEventos', {r:result,re:results, 
                                login: true,
                                User: req.session.name,
                                ID: req.session.id, 
                                fotoUser: req.session.fotoUser,
                                email: req.session.email,
                                // alert: true,
                                // alertTitle: "Evento eliminado",
                                // alertMessage: "El evento ha sido eliminado con éxito",
                                // alertIcon: 'success',
                                // showConfirmButton:false,
                                // timer:1500
                            });
                        });
                                
                    }
                });
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos LEFT JOIN estado_evento on eventos.ID_Estado=estado_evento.ID_Estado", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }

});

//metodo de crear evento
app.post('/CrearConferenciaTaller', (req, res)=>{
    var fechaInicio = req.body.FechaInicioAC;
    var horaInicio = req.body.HoraInicioAC;
    var fechaFinal = req.body.FechaFinalAC;
    var horaFinal = req.body.HoraFinalAC;
    var tema = req.body.TemaAC;
    var correoEncargado = req.body.EncargadoAC;
    var tipoReunion = req.body.TipoReunion;
    var modalidad = req.body.Modalidad;
    var descripcionCoT = req.body.DescripcionConferencia;
    var limitarP = req.body.LimitarParticipantes;
    var maxParticipantes = req.body.MaximoParticipantes;
    var enlace = req.body.EnlaceAC;

    var IdTipoReunion = new Number();
    var IdModalidad = new Number();
    var limite = 0;

    var EmailU = req.session.email;

    console.log('El id del evento capturado de forma global')
    console.log(ID_Evento_CrearConferencia);

    if(req.session.loggedin){
        conexion.query(`Select * from registro_usuario where email_Usuario ='${correoEncargado}'`,(error,resultadoC)=>{
            if(resultadoC !=""){
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error,result)=>{
                    if(error){
                        throw error
                    }else{
                        console.log(result[0])
                        var fechaInicialEvento = result[0].Fecha_Inicio;
                        var fechaFinalEvento = result[0].Fecha_Final;

                        

                        var fechaIE =  fechaInicialEvento.getFullYear() + '-' + ( fechaInicialEvento.getMonth() + 1 ) + '-' + fechaInicialEvento.getDate();
                        var fechaFE = fechaFinalEvento.getFullYear() + '-' + ( fechaFinalEvento.getMonth() + 1 ) + '-' + fechaFinalEvento.getDate();
                        
                        
                        
                        //Evento
                        var fechaIEN = new Date(fechaIE);
                        var fechaFEN = new Date(fechaFE);
                        
                        fechaFEN.setMinutes(fechaFEN.getMinutes() + fechaFEN.getTimezoneOffset())
                        console.log(fechaIEN.valueOf());
                        console.log(fechaFEN.valueOf());
                        
                        //Formulario
                        var fechaIFN = new Date(fechaInicio);
                        var fechaFFN = new Date(fechaFinal);
                        fechaIFN.setMinutes(fechaIFN.getMinutes() + fechaIFN.getTimezoneOffset())
                        fechaFFN.setMinutes(fechaFFN.getMinutes() + fechaFFN.getTimezoneOffset())
                        console.log(fechaIFN.valueOf());
                        console.log(fechaFFN.valueOf());
                        
                        if(fechaIFN.valueOf()<fechaIEN.valueOf()){
                            console.log('la Fecha es mayor a la delevento');
                            conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                                if(error){
                                    throw error
                                }else{
                                    res.render('AgregarConferencia', {Evento:results[0].Nombre_Evento,
                                        login: true,
                                        User: req.session.name,
                                        ID: req.session.id, 
                                        fotoUser: req.session.fotoUser,
                                        email: req.session.email,
                                        alert: true,
                                        alertTitle: "Error al crear la conferencia o taller",
                                        alertMessage: "No se puede crear una conferencia o taller con una fecha inicial menor a la fecha inicial del evento",
                                        alertIcon: 'error',
                                        showConfirmButton:false,
                                        timer:4500,
                                        ruta: "/AgregarConferencia/" + ID_Evento_CrearConferencia
                                    });
                                }
                            })

                        }else if(fechaFEN.valueOf()<fechaFFN.valueOf()){
                            console.log('Fecha final exede a la fecha dinal del evento')
        
                            conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                                if(error){
                                    throw error
                                }else{
                                    res.render('AgregarConferencia', {Evento:results[0].Nombre_Evento,
                                        login: true,
                                        User: req.session.name,
                                        ID: req.session.id, 
                                        fotoUser: req.session.fotoUser,
                                        email: req.session.email,
                                        alert: true,
                                        alertTitle: "Error al crear la conferencia o taller",
                                        alertMessage: "No se puede crear una conferencia o taller con una fecha final mayor a la fecha final del evento",
                                        alertIcon: 'error',
                                        showConfirmButton:false,
                                        timer:4500,
                                        ruta: "/AgregarConferencia/" + ID_Evento_CrearConferencia
                                    });
                                }
                            })
                        
                        }else{
        
                            if(tipoReunion=="Conferencia"){
                                IdTipoReunion = 1;
                            }else{
                                IdTipoReunion = 2;
                            }
        
                            if(modalidad=="Virtual"){
                                IdModalidad = 1;
                            }else{
                                IdModalidad = 2;
                            }
                            
                            if(limitarP=="Si"){
                                limite=maxParticipantes;
                            }else{
                                limite=0;
                            }
        
        
                            conexion.query('INSERT INTO conferencias_evento set ?',{ Fecha_Final:fechaFinal, Fecha_Inicio:fechaInicio, Hora_Inicio:horaInicio , Hora_Final:horaFinal, Email_Encargado:correoEncargado, ID_Evento:ID_Evento_CrearConferencia, ID_Reunion:IdTipoReunion,
                                 Nombre_Conferencia:tema, Descripcion:descripcionCoT, ID_Modalidad:IdModalidad, Enlace:enlace, Limite_Participante:limite}, (error, result)=>{
                                if(error){
                                    throw error
                                }else{
                                    if(tipoReunion=="Conferencia"){
                                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                                            if(error){
                                                throw error
                                            }else{
                                                res.render('AgregarConferencia', {Evento:results[0].Nombre_Evento,
                                                    login: true,
                                                    User: req.session.name,
                                                    ID: req.session.id, 
                                                    fotoUser: req.session.fotoUser,
                                                    email: req.session.email,
                                                    alert: true,
                                                    alertTitle: "Conferencia creada",
                                                    alertMessage: "La conferencia ha sido creado con éxito",
                                                    alertIcon: 'success',
                                                    showConfirmButton:false,
                                                    timer:1500,
                                                    ruta: "/MisEventos"
                                                });
                                            }
                                        })
                                        
                                    }else{
                                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                                            if(error){
                                                throw error
                                            }else{
                                                res.render('AgregarConferencia', {Evento:results[0].Nombre_Evento,
                                                    login: true,
                                                    User: req.session.name,
                                                    ID: req.session.id, 
                                                    fotoUser: req.session.fotoUser,
                                                    email: req.session.email,
                                                    alert: true,
                                                    alertTitle: "Taller creado",
                                                    alertMessage: "El taller ha sido creado con éxito",
                                                    alertIcon: 'success',
                                                    showConfirmButton:false,
                                                    timer:1500,
                                                    ruta: "/MisEventos"
                                                });
                                            }
                                        })
                                        
                                    }
                                    conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Evento ='${ID_Evento_CrearConferencia}'`, (error,rNombreEncargado)=>{
                                        if(error){
                                            throw error
                                        }else{
                                            var NombreEncargado = rNombreEncargado[0].Nombre_Usuario;
                                            console.log(NombreEncargado)
                                            if(IdTipoReunion==1){
                                                console.log('Enrtro en conferencia')
                                                if(IdModalidad==1){
                                                    //Email para conferencia Virtual
                                                    console.log('Enrtro en conferencia Virtual y envia el correo')
                                                    Mailer.sendEmail(correoEncargado,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
                                                }else{
                                                    //Email para conferencia Presencial
                                                    Mailer.sendEmailCP(correoEncargado,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
                                                }
                                            }else{
                                                if(IdModalidad==1){
                                                    //Email para taller Virtual
                                                    Mailer.sendEmailTV(correoEncargado,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
                                                }else{
                                                    //Email para taller Presencial
                                                    Mailer.sendEmailTP(correoEncargado,tema,fechaInicio,fechaFinal,NombreEncargado,enlace);
                                                }
        
                                            }
                                        }
                                    })
                                }
                            });
                        }
                    }
        
                })
        



               ///
            }else{
                conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                    if(error){
                        throw error
                    }else{
        res.render('AgregarConferencia', {Evento:results[0].Nombre_Evento,
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
            email: req.session.email,
            alert: true,
            alertTitle: "Error al crear la conferencia o taller",
            alertMessage: "El encargado de la conferencia debe estar registrado en el sistema",
            alertIcon: 'error',
            showConfirmButton:false,
            timer:4500,
            ruta: "/AgregarConferencia/" + ID_Evento_CrearConferencia
        });

    }
})


            }})
        
        
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }

});


//Eliminar conferencia o taller
app.get('/EliminarCoT/:ID', (req, res)=>{
    var ID_CoT= req.params.ID;
   
    if(req.session.loggedin){
        conexion.query(`DELETE FROM conferencias_evento WHERE ID_Conferencia ='${ID_CoT}'`, (error, resu)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM conferencias_evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion INNER JOIN modalidad on modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad WHERE conferencias_evento.ID_Evento=${ID_Evento_CrearConferencia}`, (error,result)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM eventos WHERE ID_Evento ='${ID_Evento_CrearConferencia}'`, (error, results)=>{
                            if(error){
                                throw error
                            }else{
                                res.render('InformacionConferencias', {
                                    r:result, Evento:results[0].Nombre_Evento, idEvento:ID_Evento_CrearConferencia
                                })
                            }
                        })
                        
                    }
                });
            }
        })
        
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});


/// Update
app.post('/EditarPerfil',upload.single('avatarE'),async(req,res)=>{
    const correo = req.body.Email;
    const nombre = req.body.NombreUsuario;
    const  descripcion= req.body.descripcionUsuario;
    const institucion= req.body.InstitucionEP;
    const formacion= req.body.formacion; 
    //const passActual=req.body.PassActual;
    const passNueva=req.body.PassNueva;
    var foto="";
    try{
        foto=req.file.filename;
    }catch(eroor){
        console.log("Error")
    }
    if(passNueva!=undefined){
    var passwordHash = await bcryptjs.hash(passNueva, 8);
    };
 // Busca que el usuario exista
    conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
        const borrar =results[0].Fotografia_Usuario;
        ///Si el resultado Existe
        if(results.length != 0){
        /// Verifica si no se cambio contraseña y setea los otros datos   
            if(passNueva==undefined){
            if(foto==""){
                conexion.query('UPDATE registro_Usuario set ? WHERE email_Usuario=?',[{Nombre_Usuario:nombre,
                    Institucion_Academica:institucion,Formacion:formacion,Descripcion_Usuario:descripcion},correo],async(error,result)=>{
                        if(error){
                            res.send("error Update");
                        }else{
                            //Si se ingreso vuelve a consultar los datos para actualizarlos
                            conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                            if(results.length != 0){ 
                            ///Actualizamos las variables de inicio de session 
                                req.session.loggedin= true;
                                req.session.name = results[0].Nombre_Usuario;
                                req.session.id= results[0].ID_Usuario;
                                req.session.fotoUser= results[0].Fotografia_Usuario;
                                req.session.email=results[0].Email_Usuario;
                                req.session.instituto= results[0].Institucion_Academica;
                                req.session.formacion= results[0].Formacion;
                                req.session.descripcion= results[0].Descripcion_Usuario;
                                req.session.pass=req.session.pass;
                                /// renderizamos la vista para mostrar el alert
                                res.render('EditarPerfil',{
                                ///Mandamos los valores necesarios
                                login: true,
                                User: req.session.name,
                                ID: req.session.id, 
                                fotoUser: req.session.fotoUser,
                                Instituto: req.session.instituto,
                                Formacion: req.session.formacion,
                                Descripcion:req.session.descripcion,
                                Email:req.session.email,
                                Password: req.session.pass,
                                alert:true,
                                alertTitle:"Actualizacion de datos",
                                alertMessage:"¡Datos actualizados correctamente!",
                                alertIcon:'success',
                                showConfirmButton:false,
                                timer: 1500,
                                ruta:'PerfilPersonal'
                            });
                        }
                    })

                }
            });
            //    
            }else{
                conexion.query('UPDATE registro_Usuario set ? WHERE email_Usuario=?',[{Nombre_Usuario:nombre,
                    Institucion_Academica:institucion,Formacion:formacion,Descripcion_Usuario:descripcion,Fotografia_Usuario:foto},correo],async(error,result)=>{
                        if(error){
                            res.send("error Update");
                        }else{
                            //Si se ingreso vuelve a consultar los datos para actualizarlos
                            conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                            if(results.length != 0){ 
                            ///Actualizamos las variables de inicio de session 
                                req.session.loggedin= true;
                                req.session.name = results[0].Nombre_Usuario;
                                req.session.id= results[0].ID_Usuario;
                                req.session.fotoUser= results[0].Fotografia_Usuario;
                                req.session.email=results[0].Email_Usuario;
                                req.session.instituto= results[0].Institucion_Academica;
                                req.session.formacion= results[0].Formacion;
                                req.session.descripcion= results[0].Descripcion_Usuario;
                                req.session.pass=req.session.pass;
                                /// Borramos la foto Vieja
                                fs.unlink('./Backend/database/uploads/'+borrar,function(err){
                                    if(err) return console.log(err);
                                    console.log('file deleted successfully');
                                    }); 
                                /// renderizamos la vista para mostrar el alert
                                res.render('EditarPerfil',{
                                ///Mandamos los valores necesarios
                                login: true,
                                User: req.session.name,
                                ID: req.session.id, 
                                fotoUser: req.session.fotoUser,
                                Instituto: req.session.instituto,
                                Formacion: req.session.formacion,
                                Descripcion:req.session.descripcion,
                                Email:req.session.email,
                                Password: req.session.pass,
                                alert:true,
                                alertTitle:"Actualizacion de datos",
                                alertMessage:"¡Datos actualizados correctamente!",
                                alertIcon:'success',
                                showConfirmButton:false,
                                timer: 1500,
                                ruta:'PerfilPersonal'
                            });
                        }
                    })

                }
            }); 
        }
        }else{
            if(foto==""){
                conexion.query('UPDATE registro_Usuario set ? WHERE email_Usuario=?',[{Nombre_Usuario:nombre,
                    Institucion_Academica:institucion,Formacion:formacion,Descripcion_Usuario:descripcion,Password_Usuario:passwordHash},correo],async(error,result)=>{
                        if(error){
                            console.log("error Update");
                        }else{
                            conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                                if(results.length != 0){ 
                            ///Actualizamos las variables de inicio de session 
                            req.session.loggedin= true;
                            req.session.name = results[0].Nombre_Usuario;
                            req.session.id= results[0].ID_Usuario;
                            req.session.fotoUser= results[0].Fotografia_Usuario;
                            req.session.email=results[0].Email_Usuario;
                            req.session.instituto= results[0].Institucion_Academica;
                            req.session.formacion= results[0].Formacion;
                            req.session.descripcion= results[0].Descripcion_Usuario;
                            req.session.pass=passNueva;
                            /// renderizamos la vista para mostrar el alert
                            res.render('EditarPerfil',{
                            ///Mandamos los valores necesarios
                            login: true,
                            User: req.session.name,
                            ID: req.session.id, 
                            fotoUser: req.session.fotoUser,
                            Instituto: req.session.instituto,
                            Formacion: req.session.formacion,
                            Descripcion:req.session.descripcion,
                            Email:req.session.email,
                            Password: req.session.pass,
                            alert:true,
                            alertTitle:"Actualizacion de datos",
                            alertMessage:"¡Datos actualizados correctamente!",
                            alertIcon:'success',
                            showConfirmButton:false,
                            timer: 1500,
                            ruta:'PerfilPersonal'
                        });
                    }})
                }
            });
        }else{
            conexion.query('UPDATE registro_Usuario set ? WHERE email_Usuario=?',[{Nombre_Usuario:nombre,
                    Institucion_Academica:institucion,Formacion:formacion,Descripcion_Usuario:descripcion,Password_Usuario:passwordHash,Fotografia_Usuario:foto},correo],async(error,result)=>{
                        if(error){
                            console.log("error Update");
                        }else{
                            conexion.query('SELECT * FROM Registro_Usuario WHERE Email_Usuario = ?',[correo], async (error,results)=>{
                                if(results.length != 0){ 
                                    ///Actualizamos las variables de inicio de session 
                            req.session.loggedin= true;
                            req.session.name = results[0].Nombre_Usuario;
                            req.session.id= results[0].ID_Usuario;
                            req.session.fotoUser= results[0].Fotografia_Usuario;
                            req.session.email=results[0].Email_Usuario;
                            req.session.instituto= results[0].Institucion_Academica;
                            req.session.formacion= results[0].Formacion;
                            req.session.descripcion= results[0].Descripcion_Usuario;
                            req.session.pass=passNueva;
                            /// Borramos la foto Vieja
                            fs.unlink('./Backend/database/uploads/'+borrar,function(err){
                                if(err) return console.log(err);
                                console.log('file deleted successfully');
                                }); 
                            /// renderizamos la vista para mostrar el alert
                            /// renderizamos la vista para mostrar el alert
                            res.render('EditarPerfil',{
                            ///Mandamos los valores necesarios
                            login: true,
                            User: req.session.name,
                            ID: req.session.id, 
                            fotoUser: req.session.fotoUser,
                            Instituto: req.session.instituto,
                            Formacion: req.session.formacion,
                            Descripcion:req.session.descripcion,
                            Email:req.session.email,
                            Password: req.session.pass,
                            alert:true,
                            alertTitle:"Actualizacion de datos",
                            alertMessage:"¡Datos actualizados correctamente!",
                            alertIcon:'success',
                            showConfirmButton:false,
                            timer: 1500,
                            ruta:'PerfilPersonal'
                        });
                    }})
                }
            });
        }
    }
}
});
});
////Termina el metodo

app.get('/InscribirmeEvento/:Id', (req, res)=>{
    // Obtenemos el Id de la conferencia al cual queremos crear un taller o evento nuevo
    const IdEvento = req.params.Id;
    var EmailU = req.session.email;

    if(req.session.loggedin){
        conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Evento ='${IdEvento}' AND registro_usuario.Email_Usuario ='${EmailU}'`, (error, rOEP)=>{
            if(error){
                throw error;
            }else{
                if(rOEP==""){
                    conexion.query(`SELECT * FROM eventos WHERE ID_Estado=3 AND ID_Evento='${IdEvento}'`, (error, resu)=>{
                        if(error){
                            throw error
                        }else{
                            console.log(resu);
                            if(resu==''){
                                conexion.query(`SELECT * FROM participante_evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participante_evento.ID_Usuario WHERE participante_evento.ID_Evento ='${IdEvento}' AND registro_usuario.Email_Usuario= '${EmailU}'`,(error, resultInscrito)=>{
                                    if(error){
                                        throw error
                                    }else{
                                        if(resultInscrito==''){
                                            //aca va el codigo
                                            conexion.query(`SELECT * FROM registro_usuario WHERE Email_Usuario='${EmailU}'`, (error,resultadoID)=>{
                                                if(error){
                                                    throw error
                                                }else{
                                                    var ID_Usuario = resultadoID[0].ID_Usuario;
                                                    console.log(ID_Usuario);
                                                    conexion.query('INSERT INTO participante_evento set ?',{ID_Usuario:ID_Usuario, ID_Evento:IdEvento},(error,resultadonsert)=>{
                                                        if(error){
                                                            throw error
                                                        }else{
                                                            conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
                                                                if(error){
                                                                    throw error
                                                                }else{
                                                                    conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                                                                        if(error){
                                                                            throw error
                                                                        }else{
                                                                            conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                                                                                if(error){
                                                                                    throw error
                                                                                }else{
                                                                                    if(true){
                                                                                        conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Evento = '${IdEvento}'`, (error,rEventosEncargado)=>{
                                                                                            if(error){
                                                                                                throw error
                                                                                            }else{
                                                                                                var nombreEvento = rEventosEncargado[0].Nombre_Evento;
                                                                                                var fechainicio = rEventosEncargado[0].Fecha_Inicio;
                                                                                                var fechafinal = rEventosEncargado[0].Fecha_Final;
                                                                                                console.log('Se envio el correo')
                                                                                                Mailer.sendEmailIns(EmailU,nombreEvento,fechainicio.toISOString().split('T')[0],fechafinal.toISOString().split('T')[0]);
                                                                                            }
                                                                                        })
                                                                                    }
                                                                                     //Eventos cerrados del loguaeado
                                                                                    var EmailU = req.session.email;
                                                                                    conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                                                                        if(error){
                                                                                            throw error
                                                                                        }else{
                                                                                            //Nombre del encargado del evento (Organizador del evento)
                                                                                            conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                                                                                if(error){
                                                                                                    throw error
                                                                                                }else{
                                                                                                    res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                                                                        login: true,
                                                                                                        User: req.session.name,
                                                                                                        ID: req.session.id, 
                                                                                                        fotoUser: req.session.fotoUser,
                                                                                                        alert:true,
                                                                                                        alertTitle:"Inscripcion exitosa",
                                                                                                        alertMessage:"¡Se a inscrito en el evento!",
                                                                                                        alertIcon:'success',
                                                                                                        showConfirmButton:false,
                                                                                                        timer: 2500
                                                                                                    });
                                                                                                }
                                                                                            })      
                                                                                        }
                                                                                    })
                                                                                    //fin de los eventos cerrados
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }else{
                                            conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
                                                if(error){
                                                    throw error
                                                }else{
                                                    conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                                                        if(error){
                                                            throw error
                                                        }else{
                                                            conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                                                                if(error){
                                                                    throw error
                                                                }else{
                                                                     //Eventos cerrados del loguaeado
                                                                     var EmailU = req.session.email;
                                                                     conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                                                         if(error){
                                                                             throw error
                                                                         }else{
                                                                             //Nombre del encargado del evento (Organizador del evento)
                                                                             conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                                                                 if(error){
                                                                                     throw error
                                                                                 }else{
                                                                                     res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                                                         login: true,
                                                                                         User: req.session.name,
                                                                                         ID: req.session.id, 
                                                                                         fotoUser: req.session.fotoUser,
                                                                                         alert:true,
                                                                                        alertTitle:"Inscripciòn fallida",
                                                                                        alertMessage:"¡Usted ya se encuentra inscrito en el evento!",
                                                                                        alertIcon:'error',
                                                                                        showConfirmButton:false,
                                                                                        timer: 2500
                                                                                     });
                                                                                 }
                                                                             })      
                                                                         }
                                                                     })
                                                                     //fin de los eventos cerrados
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    }
                                })
                            }else{
                                conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
                                    if(error){
                                        throw error
                                    }else{
                                        conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                                            if(error){
                                                throw error
                                            }else{
                                                conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                                                    if(error){
                        
                                                    }else{
                                                        //Eventos cerrados del loguaeado
                                                        var EmailU = req.session.email;
                                                        conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                                            if(error){
                                                                throw error
                                                            }else{
                                                                //Nombre del encargado del evento (Organizador del evento)
                                                                conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                                                    if(error){
                                                                        throw error
                                                                    }else{
                                                                        res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                                            login: true,
                                                                            User: req.session.name,
                                                                            ID: req.session.id, 
                                                                            fotoUser: req.session.fotoUser,
                                                                            alert:true,
                                                                            alertTitle:"Inscripción fallida",
                                                                            alertMessage:"¡El evento al que desea unirse ya a finalizado!",
                                                                            alertIcon:'error',
                                                                            showConfirmButton:false,
                                                                            timer: 2500
                                                                        });
                                                                    }
                                                                })      
                                                            }
                                                        })
                                                        //fin de los eventos cerrados
                                                        
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                
                            }
                        }
                    })
                }else{
                    conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
                        if(error){
                            throw error
                        }else{
                            conexion.query("SELECT * FROM eventos INNER JOIN tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE eventos.ID_Estado < 3 AND eventos.ID_Tipo < 2", (error, results)=>{
                                if(error){
                                    throw error
                                }else{
                                    conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento`,(error, resultado)=>{
                                        if(error){
            
                                        }else{
                                            //Eventos cerrados del loguaeado
                                            var EmailU = req.session.email;
                                            conexion.query(`select * from eventos inner join lista_blanca on eventos.ID_Evento = lista_blanca.ID_Evento INNER JOIN registro_usuario on lista_blanca.Email_Participante= registro_usuario.Email_Usuario inner join tipo_evento on tipo_evento.ID_Tipo = eventos.ID_Tipo where lista_blanca.Email_Participante= '${EmailU}' and eventos.ID_Estado !=3`,(error,rEC)=>{
                                                if(error){
                                                    throw error
                                                }else{
                                                    //Nombre del encargado del evento (Organizador del evento)
                                                    conexion.query(`select * from eventos inner join registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador`,(error,rNO)=>{
                                                        if(error){
                                                            throw error
                                                        }else{
                                                            res.render('EventosAcademicos', {re:result,r:results,res:resultado,rec:rEC,rno:rNO,
                                                                login: true,
                                                                User: req.session.name,
                                                                ID: req.session.id, 
                                                                fotoUser: req.session.fotoUser,
                                                                alert:true,
                                                                alertTitle:"Inscripción fallida",
                                                                alertMessage:"¡Usted es el organizador del evento!",
                                                                alertIcon:'error',
                                                                showConfirmButton:false,
                                                                timer: 2500
                                                            });
                                                        }
                                                    })      
                                                }
                                            })
                                            //fin de los eventos cerrados
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            }
        })
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});




app.get('/Diploma/:ID/:Nombre', (req, res)=>{
    var conferenciaID = req.params.ID;
    if(req.session.loggedin){
        conexion.query(`SELECT
        registro_usuario.ID_Usuario,
        registro_usuario.Nombre_Usuario,
        registro_usuario.Email_Usuario,
        conferencias_evento.ID_Conferencia,
        conferencias_evento.Nombre_Conferencia,
        conferencias_evento.Fecha_Inicio AS F_Inicio_Conferencia,
        conferencias_evento.Fecha_Final AS F_Final_Conferencia,
        tipo_reunion.Descripcion_Reunion,
        modalidad.Descripcion_Modalidad
    FROM
        participantes_conferencia
    INNER JOIN registro_usuario ON registro_usuario.ID_Usuario = participantes_conferencia.ID_Usuario
    INNER JOIN conferencias_evento ON conferencias_evento.ID_Conferencia = participantes_conferencia.ID_Conferencia
    INNER JOIN tipo_reunion ON tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion
    INNER JOIN modalidad ON modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad
    WHERE
        participantes_conferencia.ID_Conferencia = '${conferenciaID}'`, (error,result)=>{
            if(error || result.length == 0 ){
                console.log("Ocurrio un error")
                res.sendFile(__dirname +'/Frontend/img/error.jpg');
            }else{//
                conexion.query(`SELECT
                    eventos.ID_Evento,
                    eventos.Nombre_Evento,
                    registro_usuario.Nombre_Usuario AS organizador,
                    eventos.Descripcion_Evento,
                    eventos.Fecha_Inicio AS F_Inicio_Evento,
                    eventos.Fecha_Final AS F_Final_Evento
                FROM
                    eventos
                INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario
                INNER JOIN conferencias_evento ON conferencias_evento.ID_Evento = eventos.ID_Evento
                WHERE
                    conferencias_evento.ID_Conferencia = '${conferenciaID}'`, (error,resultado)=>{
                        if(error || result.length == 0 ){
                            console.log("Ocurrio un error")
                            res.sendFile(__dirname +'/Frontend/img/error.jpg');
                        }else{
            res.render('Diplomas',{
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
            r:result,rr:resultado
        });
                    }
                })

            }})
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado = estado_evento.ID_Estado WHERE eventos.ID_Estado < 4 AND eventos.ID_Tipo < 2", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
});

app.get('/DescargarDiploma/:nfirmas/:nombreF1?/:cargo1?/:nombreF2?/:cargo2?/:nombreF3?/:cargo3?/:ID/:Nombre/',(req,res)=>{
    var conferenciaID = req.params.ID;
    var nombreConferencia=req.params.Nombre;
    var nfirmas= req.params.nfirmas;
    var nombre1=req.params.nombreF1;
    var cargo1= req.params.cargo1;
    var nombre2=req.params.nombreF2;
    var cargo2=req.params.cargo2;
    var nombre3=req.params.nombreF3;
    var cargo3=req.params.cargo3;
    if(req.session.loggedin){
        conexion.query(`SELECT
        registro_usuario.ID_Usuario,
        registro_usuario.Nombre_Usuario,
        registro_usuario.Email_Usuario,
        conferencias_evento.ID_Conferencia,
        conferencias_evento.Nombre_Conferencia,
        conferencias_evento.Fecha_Inicio AS F_Inicio_Conferencia,
        conferencias_evento.Fecha_Final AS F_Final_Conferencia,
        tipo_reunion.Descripcion_Reunion,
        modalidad.Descripcion_Modalidad
    FROM
        participantes_conferencia
    INNER JOIN registro_usuario ON registro_usuario.ID_Usuario = participantes_conferencia.ID_Usuario
    INNER JOIN conferencias_evento ON conferencias_evento.ID_Conferencia = participantes_conferencia.ID_Conferencia
    INNER JOIN tipo_reunion ON tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion
    INNER JOIN modalidad ON modalidad.ID_Modalidad = conferencias_evento.ID_Modalidad
    WHERE
        participantes_conferencia.ID_Conferencia = '${conferenciaID}'`, (error,result)=>{
            if(error || result.length == 0 ){
                var data =fs.readFileSync(__dirname +'/Backend/database/pdf/Diplomas/error.pdf');
                res.contentType("application/pdf");
                res.send(data); 
            }else{//
                conexion.query(`SELECT
                    eventos.ID_Evento,
                    eventos.Nombre_Evento,
                    registro_usuario.Nombre_Usuario AS organizador,
                    eventos.Descripcion_Evento,
                    eventos.Fecha_Inicio AS F_Inicio_Evento,
                    eventos.Fecha_Final AS F_Final_Evento
                FROM
                    eventos
                INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario
                INNER JOIN conferencias_evento ON conferencias_evento.ID_Evento = eventos.ID_Evento
                WHERE
                    conferencias_evento.ID_Conferencia = '${conferenciaID}'`, (error,resultado)=>{
                        if(error || result.length == 0 ){
                            var data =fs.readFileSync(__dirname +'/Backend/database/pdf/Diplomas/error.pdf');
                            res.contentType("application/pdf");
                            res.send(data); 
                        }else{
                            const nombrePdf=pdfdiploma.CrearDiplomaPdf(result,resultado,nfirmas,nombre1,
                                cargo1,nombre2,cargo2,nombre3,cargo3);
                            console.log("app"+nombrePdf)
                            setTimeout(function() {
                            var data =fs.readFileSync(__dirname +'/Backend/database/pdf/Diplomas/'+nombrePdf);
                            res.contentType("application/pdf");
                            res.send(data);  
                            }, 4000);
                    }
                })

            }})
    }



            
        });
    ///funcion de pdf
    


    ///funcion de pdf

app.get('/DescargarListaConferencia/:ID/:Nombre',(req,res)=>{
    var conferenciaID = req.params.ID;
    conexion.query(`SELECT eventos.ID_Evento,eventos.Nombre_Evento,eventos.Descripcion_Evento,eventos.Fecha_Inicio as F_Inicio_Evento,eventos.Fecha_Final as F_Final_Evento,registro_usuario.ID_Usuario,registro_usuario.Nombre_Usuario, registro_usuario.Email_Usuario ,conferencias_evento.ID_Conferencia,conferencias_evento.Nombre_Conferencia,
    conferencias_evento.Descripcion,conferencias_evento.Fecha_Inicio as F_Inicio_Conferencia,conferencias_evento.Fecha_Final as F_Final_Conferencia,conferencias_evento.Hora_Inicio,conferencias_evento.Hora_Final,tipo_reunion.Descripcion_Reunion  FROM participantes_conferencia INNER JOIN registro_usuario on registro_usuario.ID_Usuario = participantes_conferencia.ID_Usuario  INNER join conferencias_evento on conferencias_evento.ID_Conferencia=participantes_conferencia.ID_Conferencia INNER join eventos on conferencias_evento.ID_Evento= eventos.ID_Evento INNER JOIN tipo_reunion on tipo_reunion.ID_Reunion = conferencias_evento.ID_Reunion
    WHERE participantes_conferencia.ID_Conferencia = '${conferenciaID}'`, (error,result)=>{
        if(error){
            var data =fs.readFileSync(__dirname +'/Backend/database/pdf/ListaConferencia/error.pdf');
                res.contentType("application/pdf");
                res.send(data); 
        }else{
                const nombrePdf=pdf.listaConferenciaPdf(result);
                setTimeout(function() {
                var data =fs.readFileSync(__dirname +'/Backend/database/pdf/ListaConferencia/'+nombrePdf);
                res.contentType("application/pdf");
                res.send(data);  
                }, 4000);
                }
            })
            
        }
        )
    ///funcion de pdf
    




app.listen(3000, (req, res)=>{
    console.log('El servidor esta activo en http://localhost:3000')
});
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
        conexion.query("SELECT * FROM eventos LEFT JOIN estado_evento on eventos.ID_Estado=estado_evento.ID_Estado", (error, result)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                console.log(result);
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }
    
});


res.render('EventosAcademicos',{
    login: true,
    User: req.session.name,
    ID: req.session.id, 
    fotoUser: req.session.fotoUser,
});



//Eventos academicos
conexion.query("SELECT * FROM eventos LEFT JOIN estado_evento on eventos.ID_Estado=estado_evento.ID_Estado", (error, result)=>{
    if(error){
        throw error
    }else{
        conexion.query("SELECT * FROM eventos INNER JOIN estado_evento on eventos.ID_Estado=estado_evento.ID_Estado INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador INNER JOIN lista_blanca on lista_blanca.Email_Participante = registro_usuario.Email_Usuario;", (error, results)=>{
            if(error){
                throw error
            }else{
                //enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
                console.log(result);
                res.render('EventosAcademicos', {re:result,r:results});
            }
        });
    }
});

//Mis Eventos
conexion.query("SELECT * FROM `eventos` INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario INNER JOIN tipo_evento ON eventos.ID_Estado = tipo_evento.ID_Tipo", (error, result)=>{
    if(error){
        throw error
    }else{
        console.log(result);
        res.render('MisEventos', {r:result});
    }
});

res.render('MisEventos',{
    //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
    login: true,
    User: req.session.name,
    ID: req.session.id, 
    fotoUser: req.session.fotoUser
});






//Metodo Crear Evento
app.post('/OrganizarEvento',uploadE.array('Galeria', 10), async (req, res)=>{
    const nombre = req.body.NombreEvento
    const institucion = req.body.institucion
    const descripcion = req.body.descripcionEvento
    const fechainicio = req.body.fechaInicio
    const fechafinal = req.body.fechaFinal
    //const imagenes = req.file;
    const tipoEvento = req.body.tipoEvento
    console.log(tipoEvento)
    if(tipoEvento='Abierto'){
        //Creamos el nuevo evento en la base de datos
        conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
            ID_Tipo:1, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    //buscamo el ultimo ID_Evento en la base de datos (Fue el que crceamos en la consulta anterior)
                    conexion.query('SELECT max(ID_Evento) FROM eventos',(error,resulta)=>{
                        if(error){
                            console.log(error);
                        }else{
                            imagenes.forEach(element => {
                                conexion.query('INSERT INTO imagen_evento set ?',{ID_Evento:resulta[0],Url_Evento:element}, (error, resultIMG)=>{
                                    if(error){
                                        console.log(error)
                                    }else{

                                        res.render('OrganizarEvento', {
                                            alert: true,
                                            alertTitle: "Evento creado",
                                            alertMessage: "El evento ha sido creado con éxito",
                                            alertIcon: 'success',
                                            showConfirmButton:false,
                                            timer:1500,
                                            ruta:''
                                        })

                                    }
                                });
                        
                            });
                        }
                    });
                    
                }
            })

    }else if(tipoEvento='Cerrado'){conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
        ID_Tipo:2, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
            if(error){
                console.log(error);
            }else{
                res.render('OrganizarEvento', {
                    alert: true,
                    alertTitle: "Evento creado",
                    alertMessage: "El evento ha sido creado con éxito",
                    alertIcon: 'success',
                    showConfirmButton:false,
                    timer:1500,
                    ruta:''
                })
            }
        })
    }
});

uploadE(req,res, function(err){
    if(err){
        console.log("Error al cargar los archivos " + err);
    }else{
        
    }
})

// {
//     fieldname: 'Galeria',
//     originalname: 'Prueba1.jpg',
//     encoding: '7bit',
//     mimetype: 'image/jpeg',
//     destination: './Frontend/img_Eventos',
//     filename: 'Galeria-1636268605052-358711704.JPG',
//     path: 'Frontend\\img_Eventos\\Galeria-1636268605052-358711704.JPG',
//     size: 44640
// }


const nombre = req.body.NombreEvento
    const institucion = req.body.institucion
    const descripcion = req.body.descripcionEvento
    const fechainicio = req.body.fechaInicio
    const fechafinal = req.body.fechaFinal
    const imagenes = req.files;
    const tipoEvento = req.body.tipoEvento
    console.log(imagenes)
    if(tipoEvento =='Abierto'){
        //Creamos el nuevo evento en la base de datos
        conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
            ID_Tipo:1, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    //buscamo el ultimo ID_Evento en la base de datos (Fue el que crceamos en la consulta anterior)
                    conexion.query('SELECT ID_Evento FROM eventos WHERE ID_Evento = (SELECT max(ID_Evento) FROM eventos)',(error,resulta)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log(resulta[0].ID_Evento)

                            imagenes.forEach(element => {
                                conexion.query('INSERT INTO imagen_evento set ?',{ID_Evento:resulta[0].ID_Evento,Url_Evento:element.filename}, (error, resultIMG)=>{
                                    if(error){
                                        console.log(error)
                                    }else{

                                    }
                                    
                                });
                        
                            });
                        }
                    });

                    res.render('OrganizarEvento', {
                        alert: true,
                        alertTitle: "Evento creado",
                        alertMessage: "El evento ha sido creado con éxito",
                        alertIcon: 'success',
                        showConfirmButton:false,
                        timer:1500,
                        ruta:''
                    })
                    
                }
            })

    }else if(tipoEvento =='Cerrado'){
        //Creamos el nuevo evento en la base de datos
        conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
            ID_Tipo:2, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
                if(error){
                    console.log(error);
                }else{
                    //buscamo el ultimo ID_Evento en la base de datos (Fue el que crceamos en la consulta anterior)
                    conexion.query('SELECT ID_Evento FROM eventos WHERE ID_Evento = (SELECT max(ID_Evento) FROM eventos)',(error,resulta)=>{
                        if(error){
                            console.log(error);
                        }else{
                            console.log(resulta[0].ID_Evento)

                            imagenes.forEach(element => {
                                conexion.query('INSERT INTO imagen_evento set ?',{ID_Evento:resulta[0].ID_Evento,Url_Evento:element.filename}, (error, resultIMG)=>{
                                    if(error){
                                        console.log(error)
                                    }else{

                                    }
                                    
                                });
                        
                            });
                        }
                    });

                    res.render('OrganizarEvento', {
                        alert: true,
                        alertTitle: "Evento creado",
                        alertMessage: "El evento ha sido creado con éxito",
                        alertIcon: 'success',
                        showConfirmButton:false,
                        timer:1500,
                        ruta:''
                    })
                    
                }
            });

    }

    res.render('Menu',{
        //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
        login: true,
        User: req.session.name,
        ID: req.session.id, 
        fotoUser: req.session.fotoUser,
    });


    

// 1 eventos 2 imagenes
// var matriz de imagenes = datafrem
// 

//enviamos el resultado de la consulta y lo almacenamos en una variable del mismo nombre
console.log(result);
res.render('EventosAcademicos', {re:result,r:results,login: true,
    User: req.session.name,
    ID: req.session.id, 
    fotoUser: req.session.fotoUser
});

res.render('Menu',{
    //lleva consigo las variables de autenticacion user, id y foto tomados de la base de datos
    login: true,
    User: req.session.name,
    ID: req.session.id, 
    fotoUser: req.session.fotoUser,
});

var EmailU = req.session.email;
        console.log(EmailU);
        //si la variable es verdadera ingresa a la pagina
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
                        email: req.session.email
                    });
                });
                
            }
        });

        
        res.render('MisEventos', {r:result,re:results, 
            login: true,
            User: req.session.name,
            ID: req.session.id, 
            fotoUser: req.session.fotoUser,
            email: req.session.email
        });

        conexion.query(`DELETE eventos, imagen_evento FROM eventos INNER JOIN imagen_evento ON imagen_evento.ID_Evento=eventos.ID_Evento WHERE eventos.ID_Evento= '${IDevento}'`, (error,resltado)=>{
            if(error){

            }else{
                
            }
        })

        conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario INNER JOIN tipo_evento ON eventos.ID_Estado = tipo_evento.ID_Tipo WHERE Email_Usuario = '${EmailU}'`, (error, result)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE registro_usuario.Email_Usuario = '${EmailU}'`, (err, results)=>{
                    if(error){
                        throw error
                    }else{
                        
                    }
                });
                    
            }
        });

        conexion.query(`DELETE eventos, imagen_evento FROM eventos INNER JOIN imagen_evento ON imagen_evento.ID_Evento=eventos.ID_Evento WHERE eventos.ID_Evento= '${IDevento}'`, (error,resltado)=>{
            if(error){
                throw error
            }else{
                
            }
            
        })

//Metodo de Eliminar evento
app.get('/Delete/:ID',(req,res)=>{
    
    if(req.session.loggedin){
        var IDevento = req.params.ID;
        //si la variable es verdadera ingresa a la pagina    
        var EmailU = req.session.email;
        console.log(IDevento);
        conexion.query(`DELETE eventos, imagen_evento FROM eventos INNER JOIN imagen_evento ON imagen_evento.ID_Evento=eventos.ID_Evento WHERE eventos.ID_Evento= '${IDevento}'`, (error,resltado)=>{
            if(error){
                throw error
            }else{
                conexion.query(`SELECT * FROM eventos INNER JOIN registro_usuario ON eventos.ID_Organizador = registro_usuario.ID_Usuario INNER JOIN tipo_evento ON eventos.ID_Estado = tipo_evento.ID_Tipo WHERE Email_Usuario = '${EmailU}'`, (error, resultado)=>{
                    if(error){
                        throw error
                    }else{
                        conexion.query(`SELECT * FROM imagen_evento INNER JOIN eventos on imagen_evento.ID_Evento = eventos.ID_Evento INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE registro_usuario.Email_Usuario = '${EmailU}'`, (err, resultados)=>{
                            if(error){
                                throw error
                            }else{
                                res.render('MisEventos', {r:resultado,re:resultados,
                                    login: true,
                                    User: req.session.name,
                                    ID: req.session.id, 
                                    fotoUser: req.session.fotoUser,
                                    email: req.session.email,
                                    alert: true,
                                    alertTitle: "Evento eliminado",
                                    alertMessage: "El evento ha sido eliminado con éxito",
                                    alertIcon: 'success',
                                    showConfirmButton:false,
                                    timer:1500,
                                    ruta:''
                                }) 
                            }
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
                console.log(result);
                res.render('principal', {r:result,
                login: false
                });
            }
        });
    }

});       
}).then(()=>{
    window.location='<%= ruta %>'
})


//Depuracion de codigo de crear evento
app.post('/OrganizarEvento',uploadE.any('Galeria'), (req, res)=>{

    //solicita la variable de inicio de sesion 
    if(req.session.loggedin){
        //si la variable es verdadera ingresa a la pagina
        var EmailU = req.session.email;
        conexion.query(`SELECT ID_Usuario FROM registro_usuario WHERE Email_Usuario ='${EmailU}'`, (errorr, resul)=>{
            var Idorganizador = resul[0].ID_Usuario; 
            const nombre = req.body.NombreEvento
            const institucion = req.body.institucion
            const descripcion = req.body.descripcionEvento
            const fechainicio = req.body.fechaInicio
            const fechafinal = req.body.fechaFinal
            const imagenes = req.files;
            const tipoEvento = req.body.tipoEvento;
            const FechaActual = new Date();
            console.log(FechaActual);
            if(tipoEvento =='Abierto'){
                //Creamos el nuevo evento en la base de datos
                conexion.query('INSERT INTO eventos SET ?', {ID_Organizador:Idorganizador,Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
                    ID_Tipo:1, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
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

            }else if(tipoEvento =='Cerrado'){
                //Creamos el nuevo evento en la base de datos
                conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
                    ID_Tipo:2, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
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
                                ruta:''
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


if(tipoEvento =='Abierto'){
    //Creamos el nuevo evento en la base de datos
    conexion.query('INSERT INTO eventos SET ?', {ID_Organizador:Idorganizador,Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
        ID_Tipo:1, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
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

}else if(tipoEvento =='Cerrado'){
    //Creamos el nuevo evento en la base de datos
    conexion.query('INSERT INTO eventos SET ?', {Nombre_Evento:nombre, Institucion:institucion, Descripcion_Evento:descripcion, 
        ID_Tipo:2, Fecha_Inicio:fechainicio, Fecha_Final:fechafinal, ID_Estado:1}, async(error, results)=>{
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
                    ruta:''
                })
                
            }
        });

}


//Formato de fecha


ID_Conferencia, Fecha_Final, Fecha_Inicio , Hora_Inicio , Hora_Final, Email_Encargado, ID_Evento, ID_Reunion,
 Nombre_Conferencia, Descripcion, ID_Modalidad, Enlace, Lugar, Limite_Participante

// Informacion del Email antes de enviar al encargado 
Mailer.transporter.sendMail({
    from: '"Forgot password 👻" <academic.events.edu@gmail.com>', // sender address
    to: Email_Encargado, // list of receivers
    subject: "Hello ✔", // Subject line
    html: "<h1>Has has sido seleccionado para sel el encargado de un evento</h1>", // html body
});

if(req.session.loggedin){
    conexion.query(`DELETE FROM conferencias_evento WHERE ID_Conferencia =${ID_CoT}`,(error,result)=>{
        if(error){
            throw error
        }else{

        }
    })




    `SELECT * FROM participante_evento INNER JOIN eventos on participante_evento.ID_Evento = eventos.ID_Evento INNER JOIN tipo_evento on eventos.ID_Tipo = tipo_evento.ID_Tipo INNER JOIN registro_usuario on registro_usuario.ID_Usuario = eventos.ID_Organizador WHERE participante_evento.ID_Usuario =`



    //Codigo de los eventos cerrados de EventosAcademicos

    
    var listaCoT = <%= listaCoT %>;
    var listaPartCoT = <%= listaPartCoT %>;
    alert(listaCoT);
    const mostrar = (listaCoT,listaPartCoT) =>{
        listaCoT.forEach(element => {
            chart.data['labels'].push(element)
        });
        listaPartCoT.forEach(element => {
            chart.data['datasets'][0].data.push(element)
        });
        myChart.update()
    }

    var listaCoT = <%= listaCoT %>;
    var listaPartCoT = <%= listaPartCoT %>;
    const mostrar = (listaCoT,listaPartCoT) =>{
        listaCoT.forEach(element => {
            chart.data['labels'].push(element)
        });
        listaPartCoT.forEach(element => {
            chart.data['datasets'][0].data.push(element)
        });
        myChart.update()
    }

    chart.data['labels'].push(<%= listaCoT %>)
    chart.data['datasets'][0].data.push(<%= listaPartCoT %>)
    myChart.update()
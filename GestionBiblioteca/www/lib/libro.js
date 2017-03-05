/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.libro={};
//Configuranción del HOST Y URL del servicio
$.libro.HOST = 'http://192.168.1.160:8080';
$.libro.URL = '/GB-JPA/webresources/com.iesvdc.acceso.entidades.libros';


$.libro.LibroReadREST = function(id){
    if (id === undefined){
        $.ajax({
            url: this.HOST+this.URL,
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Listado de Libros</h3>');
                var table = $('<table />').addClass('table table-stripped');
                
                table.append($('<thead />').append($('<tr />').append('<th>isnb</th>', '<th>titulo</th>', '<th>autor</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].isbn + '</td>',
                                '<td>' + json[clave].titulo + '</td>', '<td>' + json[clave].autor + '</td>'));
                }
                table.append(tbody);
                
                $('#r_libro').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
                },
            error: function (xhr, status) {
                $('#r_libro').empty();
                $('#r_libro').append('<h3>Error conectando al servidor</h3>');
                $('#r_libro').append('<p>Inténtelo más tarde</p>');
            }         
        });
    }else{
        $.ajax({
            url:this.HOST+this.URL,
            type:'GET',
            dataType:'json',
            success:function(json){
                
            },
            error:function(xhr, status){
                this.error('Imposible leer libros','Compruebe su conexión o intentelo más tarde' )
            }
        });
    }
    
    
};

$.libro.LibroCreateREST = function(){
    var datos = {
        'isbn' : $("#c_li_isbn").val(),
        'titulo' : $("#c_li_titulo").val(),
        'autor' : $("#c_li_autor").val()
    };
    //Comprobamos que en el formulario hay datos
    
    if(datos.isbn.length>2 && datos.titulo.length>2 && datos.autor.length>2){
        $.ajax({
            url: $.libro.HOST+$.libro.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result, status, jqXHR){
                //esto sirver para comprobar que se ha actualizado cargando la lista de nuevo
                $.libro.LibroReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('ERROR: Libro create', 'No se ha podido crear el libro');
            }
        });
        //con esto impedios volver hacia atrás
        $.afui.clearHistory();
        //cargamos el panel con id r_cliente
        $.afui.loadContent("#r_libro", false, false,"up");
    }
};

$.libro.LibroDeleteREST = function(id){
    if(id !== undefined){
        id = $('#d_li_sel').val();
        $.ajax({
            url: $.libro.HOST+$.libro.URL+'/'+id,
            type: 'DELETE',
            dataType:'json',
            contentType:"application/json",
            
            success: function(result, status, jqXHR){
                //probamos que se ha borrado cargando la lista
                $.libro.LibroReadREST();
                //con esto impedios volver hacia atrás
                $.afui.clearHistory();
                //cargamos el panel con id r_cliente
                $.afui.loadContent("#r_libro", false, false,"up");
                
            },
            
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Libro Delete', 'No ha sido posible borrar el libro');
            }
        });
    }else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_libro').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_li_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].titulo+' ' + json[clave].autor+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.libro.LibroDeleteREST(1)"> eliminar! </div>');
                $('#d_libro').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Libro Delete','No se ha podido borrar el libro');
            }
        });
    }
};
$.libro.LibroUpdateREST = function(id, envio){
    if(id === undefined){
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_libro').empty();
                $('#u_libro').append('<h3>Pulse sobre un libro</h3>');
                var table = $('<table />').addClass('table table-stripped');
                
                table.append($('<thead />').append($('<tr />').append('<th>id</th>','<th>isbn</th>', '<th>titulo</th>', '<th>autor</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.libro.LibroUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>','<td>' + json[clave].isbn + '</td>',
                    '<td>' + json[clave].titulo + '</td>', '<td>' + json[clave].autor + '</td>'));
                }
                    table.append(tbody);
                    
                    $('#u_libro').append( $('<div />').append(table));
                    $('tr:odd').css('background','#CCCCCC');   
            },
            error: function (xhr, status) {
                $.libro.error('Error: Libro Update','Ha sido imposible conectar al servidor.');
            }
        });
    }else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var li_id = ($(seleccion))[0];
        var li_isbn = ($(seleccion))[1];
        var li_titulo = ($(seleccion))[2];
        var li_autor = ($(seleccion))[3];
        
        
        $("#u_li_id").val(li_id.childNodes[0].data);
        $("#u_li_isbn").val(li_isbn.childNodes[0].data);
        $("#u_li_titulo").val(li_titulo.childNodes[0].data);
        $("#u_li_autor").val(li_autor.childNodes[0].data);
       
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con .
        $.afui.loadContent("#uf_libro",false,false,"up");
}else {
    var datos = {
        'id' : $("#u_li_id").val(),
        'isbn' : $("#u_li_isbn").val(),
        'titulo' : $("#u_li_titulo").val(),
        'autor' : $("#u_li_autor").val()
    };
    
    if(datos.isbn.length>2 && datos.titulo.length>2 && datos.autor.length>2){
        $.ajax({
            url: $.libro.HOST+$.libro.URL+'/'+$("#u_li_id").val(),
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
                // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.libro.LibroReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.libro.error('Error: Libro Update','No ha sido posible actualizar el libro. Compruebe su conexión.');
            }
        });
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_libro.
        $.afui.loadContent("#r_libro",false,false,"up");
        }
    }
};

$.libro.error = function(title, msg){
    $('#err_libro').empty();
    $('#err_libro').append('<h3>'+title+'</h3>');
    $('#err_libro').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_alumno.
    $.afui.loadContent("#err_libro",false,false,"up");
}
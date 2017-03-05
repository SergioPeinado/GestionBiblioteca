/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false */
// variables para el jslint
$.cliente={};
//Configuranción del HOST Y URL del servicio
$.cliente.HOST = 'http://192.168.1.160:8080';
$.cliente.URL = '/GB-JPA/webresources/com.iesvdc.acceso.entidades.cliente';


$.cliente.ClienteReadREST = function(id){
    if (id === undefined){
        $.ajax({
            url: this.HOST+this.URL,
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#r_cliente').empty();
                $('#r_cliente').append('<h3>Listado de CLientes</h3>');
                var table = $('<table />').addClass('table table-stripped');
                
                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>nombre</th>', '<th>apellidos</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    tbody.append($('<tr />').append('<td>' + json[clave].id + '</td>',
                                '<td>' + json[clave].nombre + '</td>', '<td>' + json[clave].apellido + '</td>'));
                }
                table.append(tbody);
                
                $('#r_cliente').append( $('<div />').append(table) );
                $('tr:odd').css('background','#CCCCCC');
                },
            error: function (xhr, status) {
                $('#r_cliente').empty();
                $('#r_cliente').append('<h3>Error conectando al servidor</h3>');
                $('#r_cliente').append('<p>Inténtelo más tarde</p>');
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
                this.error('Imposible leer clientes','Compruebe su conexión o intentelo más tarde' )
            }
        });
    }
    
    
};

$.cliente.ClienteCreateREST = function(){
    var datos = {
        'nombre' : $("#c_cli_nombre").val(),
        'apellido' : $("#c_cli_apellidos").val()
    };
    //Comprobamos que en el formulario hay datos
    
    if(datos.nombre.length>2 && datos.apellido.length>2){
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL,
            type: 'POST',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result, status, jqXHR){
                //esto sirver para comprobar que se ha actualizado cargando la lista de nuevo
                $.cliente.ClienteReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('ERROR: Cliente create', 'No se ha podido crear al cliente');
            }
        });
        //con esto impedios volver hacia atrás
        $.afui.clearHistory();
        //cargamos el panel con id r_cliente
        $.afui.loadContent("#r_cliente", false, false,"up");
    }
};

$.cliente.ClienteDeleteREST = function(id){
    if(id !== undefined){
        id = $('#d_cli_sel').val();
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL+'/'+id,
            type: 'DELETE',
            dataType:'json',
            contentType:"application/json",
            
            success: function(result, status, jqXHR){
                //probamos que se ha borrado cargando la lista
                $.cliente.ClienteReadREST();
                //con esto impedios volver hacia atrás
                $.afui.clearHistory();
                //cargamos el panel con id r_cliente
                $.afui.loadContent("#r_cliente", false, false,"up");
                
            },
            
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Delete', 'No ha sido posible borrar al cliente');
            }
        });
    }else{
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#d_cliente').empty();
                var formulario = $('<div />');
                formulario.addClass('container');
                var select = $('<select id="d_cli_sel" />');
                select.addClass('form-group');
                for (var clave in json){
                    select.append('<option value="'+json[clave].id+'">'+json[clave].nombre+' ' + json[clave].apellido+'</option>');
                }
                formulario.append(select);
                formulario.append('<div class="btn btn-danger" onclick="$.cliente.ClienteDeleteREST(1)"> eliminar! </div>');
                $('#d_cliente').append(formulario).append(select);
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: CLiente Delete','No se ha podido borrar el cliente');
            }
        });
    }
};
$.cliente.ClienteUpdateREST = function(id, envio){
    if(id === undefined){
        $.ajax({
            url: this.HOST+this.URL,
            type: 'GET',
            dataType: 'json',
            contentType: 'application/json',
            success: function (json) {
                $('#u_cliente').empty();
                $('#u_cliente').append('<h3>Pulse sobre un Cliente</h3>');
                var table = $('<table />').addClass('table table-stripped');
                
                table.append($('<thead />').append($('<tr />').append('<th>id</th>', '<th>Nombre</th>', '<th>Apellidos</th>')));
                var tbody = $('<tbody />');
                for (var clave in json) {
                    // le damos a cada fila un ID para luego poder recuperar los datos para el formulario en el siguiente paso
                    tbody.append($('<tr id="fila_'+json[clave].id+'" onclick="$.cliente.ClienteUpdateREST('+json[clave].id+')"/>').append('<td>' + json[clave].id + '</td>','<td>' + json[clave].nombre+ '</td>', '<td>' + json[clave].apellido + '</td>'));
                }
                    table.append(tbody);
                    
                    $('#u_cliente').append( $('<div />').append(table));
                    $('tr:odd').css('background','#CCCCCC');   
            },
            error: function (xhr, status) {
                $.libro.error('Error: Cliente Update','Ha sido imposible conectar al servidor.');
            }
        });
    }else if (envio === undefined ){
        var seleccion = "#fila_"+id+" td";
        var cli_id = ($(seleccion))[0];
        var cli_nombre = ($(seleccion))[1];
        var cli_apellidos = ($(seleccion))[2];
        
        $("#u_cli_id").val(cli_id.childNodes[0].data);
        $("#u_cli_nombre").val(cli_nombre.childNodes[0].data);
        $("#u_cli_apellidos").val(cli_apellidos.childNodes[0].data);
        
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#uf_cliente",false,false,"up");
}else {
    var datos = {
        'id' : $("#u_cli_id").val(),
        'nombre' : $("#u_cli_nombre").val(),
        'apellido' : $("#u_cli_apellidos").val()
    };
    
    if(datos.nombre.length>2 && datos.apellido.length>2){
        $.ajax({
            url: $.cliente.HOST+$.cliente.URL+'/'+$("#u_cli_id").val(),
            type: 'PUT',
            dataType: 'json',
            contentType: "application/json",
            data: JSON.stringify(datos),
            success: function(result,status,jqXHR ) {
                // probamos que se ha actualizado cargando de nuevo la lista -no es necesario-
                $.cliente.ClienteReadREST();
            },
            error: function(jqXHR, textStatus, errorThrown){
                $.cliente.error('Error: Cliente Create','No ha sido posible actualizar el cliente. Compruebe su conexión.');
            }
        });
        // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
        $.afui.clearHistory();
        // cargamos el panel con id r_alumno.
        $.afui.loadContent("#r_cliente",false,false,"up");
        }
    }
};

$.cliente.error = function(title, msg){
    $('#err_cliente').empty();
    $('#err_cliente').append('<h3>'+title+'</h3>');
    $('#err_cliente').append('<p>'+msg+'</p>');
    // esto es para que no vaya hacia atrás (que no salga el icono volver atrás en la barra de menú) 
    $.afui.clearHistory();
    // cargamos el panel con id r_alumno.
    $.afui.loadContent("#err_cliente",false,false,"up");
}
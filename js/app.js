//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//Eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
    formulario.addEventListener('submit',agregarGasto);

}


class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = []
    }
nuevoGasto(gasto){

    this.gastos = [...this.gastos, gasto]
    this.calcularRestante();

}
calcularRestante(){
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad , 0 );

        this.restante = this.presupuesto - gastado;
        console.log(this.restante);
}

eliminarGasto(id){
    this.gastos = this.gastos.filter( gasto => gasto.id !== id);
     this.calcularRestante();
}

}

class UI {
    insertarPresupuesto(cantidad){
    const { presupuesto, restante} = cantidad;
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;


    }

    imprimirAlerta(mensaje,tipo){
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');
        if(tipo == 'error'){
            divMensaje.classList.add('alert-danger');


        } else {
            divMensaje.classList.add('alert-success');
        }

        ///
        divMensaje.textContent = mensaje;

        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        // quitar del ht,l

        setTimeout(() => {

            divMensaje.remove();

        },3000);
    }
   
    mostrarGastos(gastos) {

        this.limpiarHTML()

       
            gastos.forEach( gasto =>{
                const { cantidad, nombre , id } = gasto;
                //crear li
                 const nuevoGasto = document.createElement('li');
                 nuevoGasto.className= 'list-group-item d-flex justify-content-between align-items-center ';
                //  nuevoGasto.setAttribute('data-id', gasto.id)
                 nuevoGasto.dataset.id = id;

                 nuevoGasto.innerHTML = `${nombre} <span class="badge badge-primary badge-pill"> ${cantidad}</span>`;

                 //boton para borrar el gasto
                 const btnBorrar = document.createElement('button');
                 btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
                btnBorrar.onclick = () => {
                    console.log("id gasto" + id)
                    eliminarGasto(id);
                }
                 btnBorrar.innerHTML = 'Borrar &times';

                 nuevoGasto.appendChild(btnBorrar);
                 gastoListado.appendChild(nuevoGasto);


            })
         
    }
    limpiarHTML(){
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);

        }

    }

    actualizarRestante(restante){

        document.querySelector('#restante').textContent = restante;

    }

    comprobarPresupuesto(presupeustoObj) {
            const { presupuesto, restante} = presupeustoObj;
           const restanteDiv = document.querySelector('.restante');
            if ((presupuesto / 4) >= restante ){
               restanteDiv.classList.remove('alert-success','alert-warning');
               restanteDiv.classList.add('alert-danger');

            } else if((presupuesto / 2) > restante){

                restanteDiv.classList.remove('alert-success');
                restanteDiv.classList.add('alert-warning');
            }else {
                restanteDiv.classList.remove('alert-danger', 'alert-warning');
                restanteDiv.classList.add('alert-success');
            }

            //si el totoal es cero o meno

            if(restante <= 0) {
                ui.imprimirAlerta('El presupuesto de ha agotado', 'error');

                formulario.querySelector('button[type="submit"').disabled = true;
            }

    }

    }


const ui = new UI();


let presupuesto; //global?


function preguntarPresupuesto() {

    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?')

    
    if(presupuestoUsuario === '' || presupuestoUsuario === null ||  isNaN(presupuestoUsuario) || presupuestoUsuario <= 0 ){

        window.location.reload();

    }

    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto)

    ui.insertarPresupuesto(presupuesto);

}

function agregarGasto(e) {
    e.preventDefault();
    //leer datso formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);
    if(nombre === '' || cantidad === ''){
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');

        return;

    } else if (cantidad <= 0 || isNaN(cantidad)){

        ui.imprimirAlerta('cantidad no válida', 'error');
        return;

    }

    //generar objeto de gasto

    const gasto = { nombre, cantidad , id:Date.now()}

    presupuesto.nuevoGasto( gasto );
    console.log(typeof(gasto))
    ui.imprimirAlerta('Gasto agregado Correctamente')

    //imprimir gastos
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);

    //reinica el formulario
    formulario.reset();
}

function eliminarGasto(id){
    presupuesto.eliminarGasto(id);
    const { gastos, restante } = presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);

    ui.comprobarPresupuesto(presupuesto);


}
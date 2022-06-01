import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  componentWillMount(){
    axios.get('http://127.0.0.1:8000/biblioteca/')
    .then(res => {
      this.setState({ biblioteca: res.data })
    });
  }

  cambioLibro(e){
    this.setState({
      idLibro: e.target.value
    })
  }
  cambioCliente(e){
    this.setState({
      idUsuario: e.target.value
    })
  }
  cambioFechaInicio(e){
    this.setState({
      fechainicio: e.target.value
    })
  }
  cambioFechaFin(e){
    this.setState({
      fechafinal: e.target.value
    })
  }

  mostrar(cod, index){
    axios.get('http://127.0.0.1:8000/biblioteca/'+cod+'/')
    .then(res=>{
      this.setState({
        pos: index,
        titulo: 'Editar',
        id:res.data.id,
        idLibro: res.data.idLibro,
        idUsuario: res.data.idUsuario,
        fechainicio: res.data.fecPrestamo,
        fechafinal: res.data.fecdevolucion,
      })
    });
  }

  constructor(props) {
    super(props);
    this.state=({
      biblioteca: [],
      pos: null,
      titulo: 'Nuevo',
      id: 0,
      idLibro: 0,
      idUsuario: 0,
      fechainicio: '0',
      fechafinal: '0',
    })
    this.cambioLibro = this.cambioLibro.bind(this);
    this.cambioCliente = this.cambioCliente.bind(this);
    this.cambioFechaInicio= this.cambioFechaInicio.bind(this);
    this.cambioFechaFin = this.cambioFechaFin.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    let datos = {
      idLibro: this.state.idLibro,
      idUsuario: this.state.idUsuario,
      fecPrestamo: this.state.fechainicio,
      fecdevolucion: this.state.fechafinal
    }
    if(cod>0){//Editamos un registro
      axios.put('http://127.0.0.1:8000/biblioteca/'+cod+'/',datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.biblioteca[indx] = res.data;
        var temp = this.state.biblioteca;
        this.setState({
          pos: null,
          titulo: 'Nuevo',
          id: 0,
          idLibro: 0,
          idUsuario: 0,
          fechainicio: '',
          fechafinal: '',
          biblioteca: temp
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }else{//Nuevo registro
      axios.post('http://127.0.0.1:8000/biblioteca/',datos)
      .then(res=>{
        this.state.biblioteca.push(res.data);
        var temp = this.state.biblioteca;
        this.setState({
          id:0,
          idLibro: 0,
          idUsuario: 0,
          fechainicio: '',
          fechafinal: '',
          biblioteca: temp
        }).catch((error)=>{
          console.log(error.toString());
        })
      })
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea eliminar?");
    if(rpta){
      axios.delete('http://127.0.0.1:8000/biblioteca/'+cod+'/')
      .then(res => {
        var temp = this.state.biblioteca.filter((biblioteca)=>biblioteca.id !== cod);
        this.setState({
          biblioteca: temp
        })
      })
    }
  }
  render() {
    return (
    <div class="container text-center">
      <h1>Lista de Prestamos</h1>
      <table border="1" class="table table-primary">
        <thead>
          <tr>
            <th>Ejemplar</th>
            <th>Libro</th>
            <th>Cliente</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {this.state.biblioteca.map( (biblioteca,index) =>{
            return (
              <tr key={biblioteca.id}>
                <td>{biblioteca.id}</td>
                <td>{biblioteca.idLibro}</td>
                <td>{biblioteca.idUsuario}</td>
                <td>{biblioteca.fecPrestamo}</td>
                <td>{biblioteca.fecdevolucion}</td>
                <td>
                  <button type="button" class="btn btn-success" onClick={()=>this.mostrar(biblioteca.id,index)}>Editar</button>
                  <button type="button" class="btn btn-danger" onClick={()=>this.eliminar(biblioteca.id)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <hr />
      <h1>{this.state.titulo}</h1>
      <form onSubmit={this.guardar} >
        <input type="hidden" value={this.state.id}></input>
        <p>
          Ingrese Libro:
          <input type="number" value={this.state.idLibro} onChange={this.cambioLibro}></input>
        </p>
        <p>
          Ingrese Cliente:
          <input type="number" value={this.state.idUsuario} onChange={this.cambioCliente}></input>
        </p>
        <p>
          Fecha Inicio:
          <input type="date" value={this.state.fechainicio} onChange={this.cambioFechaInicio}></input>
        </p>
        <p>
          Fecha Fin:
          <input type="date" value={this.state.fechafinal} onChange={this.cambioFechaFin}></input>
        </p>
        <p><input type="submit"></input></p>
      </form>
    </div>)
  }
}
export default App;


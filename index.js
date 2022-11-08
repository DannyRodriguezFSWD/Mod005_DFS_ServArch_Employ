// import express from 'express'
const request = require('supertest');
const assert = require('assert');
const express = require('express') //module.exports
const employees = require('./src/data/employees.json') 
const app = express();

/** Middlewares */
app.use(express.json());

/* Routes */

// /api/employees
app.get('/api/employees', (req, res, next) => {    
    let employeesData = []
    for (let employee of employees) {        
        employeesData.push(employee)       
    } return res.json(employeesData)
    //resultEmployees.push(employeesData)
    //return 
    console.log(employeesData)
    
})

// /api/employees?page=1
// /api/employees?page=2
// /api/employees?page=N
// app.get('/api/employees', (req, res, next) => {
//     const page = parseInt(req.query.page)
//     const limit = 2

//     const startIndex = (page - 1) * limit
//     const endIndex = page * limit

//     const resultEmployees = employees.slice(startIndex, endIndex)

//     res.json(resultEmployees)
// })


// /api/employees?oldest
app.get('/api/employees', (req, res, next) => {
    let oldest = req.query.oldest   
    let resultEmployees = []
    let old = 0

   
    for (let employee of employees) {        
        if (oldest < employee.age) {
            oldest = employee.age
            resultEmployees = employee               
        }      
    }
   
    return res.json(resultEmployees)    
})
// /api/employees?user=true
app.get('/api/employees', (req, res, next) => {
    let user = req.query.user
    let privileges = "user"
    let resultEmployees = []

    if (user = true ){
        for (let employee of employees) {        
            if (privileges == employee.privileges) {                 
                resultEmployees.push(employee)                
            }      
        }
    }   
    return res.json(resultEmployees)    
})

/*

POST  http://localhost:8000/api/employees
Añadirá un elemento al listado en memoria del programa (se perderá cada vez que se reinicie).
Se validará que el body de la petición cumpla el mismo formato JSON que el resto de empleados.
Si no cumpliera dicha validación, se devolverá status 400 con el siguiente contenido:
{"code": "bad_request"}
*/
app.post('/api/employees', function(req, res){
    //Check if all fields are provided and are valid:   
    if(!req.body.name ||
        !req.body.age.toString().match(/^[0-9]{2}$/g) ||        
        !req.body.phone.home.toString().match(/^[0-9]{10}$/g) ||
        !req.body.phone.work.toString().match(/^[0-9]{10}$/g) ||
        !req.body.phone.ext.toString().match(/^[0-9]{3}$/g) ||
        !req.body.privileges ||
        !req.body.badges
       ){
       res.status(400);
       res.json({"code": "bad_request"});
    } else {       
       employees.push({
          name: req.body.name,
          age: req.body.age,
          phoneHome: req.body.phone.home,
          phoneWork: req.body.phone.work,
          phoneExt: req.body.phone.ext,
          privileges: req.body.privileges,
          badges: req.body.badges
       });
       res.json({message: "New employee created.", location: "/api/employees/" + newId});
    }
})

// /api/employees?badges=black
app.get('/api/employees', (req, res, next) => {
    let badges = req.query.badges
    let employeesBadges = []
    let resultEmployees = []

    for (let employee of employees) {        
        for (let badge of employee.badges){
            if (badge == badges) {                 
                employeesBadges.push(employee)                
            }            
        }           
    }
    resultEmployees.push(employeesBadges)
    return res.json(resultEmployees)    
})

/*
8. GET  http://localhost:8000/api/employees/NAME
Devolverá objeto employee cuyo nombre sea igual a NAME. NAME puede tomar diferentes valores:
Sue, Bob, etc.
Si no se encuentra el usuario con name == NAME se devolvera status 404 con el siguiente contenido:
{"code": "not_found"}
*/
app.get('/api/employees/:name', (req, res, next) => {
    const name = req.params.name
    for (let employee of employees) {
        if (employee.name == name) {
            res.json(employee);
            return;
        }
    }

    // Sending 404 when not found something is a good practice
    res.status(404).send({"code": "not_found"});
})

/*
BONUS. (Opcional). Incluir test unitarios para cada una de las rutas haciendo uso de la librería
https://github.com/visionmedia/supertest
*/

app.listen(8000, () => {
    console.log('Ready')
})

request(app)
  .get('/api/employees')
  .expect('Content-Type', /json/)
  //.expect('Content-Length', '154')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });
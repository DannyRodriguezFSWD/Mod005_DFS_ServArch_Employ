// import express from 'express'
const request = require('supertest');
const express = require('express') //module.exports
const employees = require('./src/data/employees.json') 
const app = express();

/** Middlewares */
app.use(express.json());

/* Routes */

// /api/employees
app.get('/api/employees', (req, res, next) => {
    const page = parseInt(req.query.page)
    const oldest = req.query.oldest
    const user = req.query.user
    const badges = req.query.badges

    if(page){
        // /api/employees?page=N
        const perPage = 2
        const from = (page - 1) * perPage
        const to = from + page
        res.json(employees.slice(from, to))

    } else if(oldest == ""){
        // /api/employees?oldest
        let oldEmployee = {}
        let old = 0
        for (let employee of employees) {        
            if (old < employee.age) {
                old = employee.age
                oldEmployee = employee               
            }      
        }          
        return res.json(oldEmployee)
        
    }  else if(user) {
        // /api/employees?user=true
        let privileges = "user"
        let userEmployees = []
        if(user == "true"){
            for (let employee of employees) {        
                if (privileges == employee.privileges) {                 
                    userEmployees.push(employee)                
                }      
            }
        }
        return res.json(userEmployees)  
    }  else if(badges){
        // /api/employees?badges=black
        let employeesBadges = []       

        for (let employee of employees) {        
            for (let badge of employee.badges){
                if (badge == badges) {                 
                    employeesBadges.push(employee)                
                }            
            }           
        }       
        return res.json(employeesBadges)    
    
    }  else {
        res.json(employees)
    }  
})

/*
POST  http://localhost:8000/api/employees
Añadirá un elemento al listado en memoria del programa (se perderá cada vez que se reinicie).
Se validará que el body de la petición cumpla el mismo formato JSON que el resto de empleados.
Si no cumpliera dicha validación, se devolverá status 400 con el siguiente contenido:
{"code": "bad_request"}
*/
app.post('/api/employees', function(req, res, next){
    //Check if all fields are provided and are valid:   
    if(!req.body.name ||
        !req.body.age.toString().match(/^[0-9]{2}$/g) ||        
        !req.body.privileges ||
        !req.body.badges
       ){
       res.status(400);
       res.json({"code": "bad_request"});
    } else {       
       employees.push({
          name: req.body.name,
          age: req.body.age,
          phone: req.body.phone,          
          privileges: req.body.privileges,
          favorites: req.body.favorites,
          finished: req.body.finished,
          badges: req.body.badges,
          points: req.body.points
       });
       res.json({message: "New employee created.", location: "/api/employees/"});
    }
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


app.listen(8000, () => {
    console.log('Ready')
})

/*
BONUS. (Opcional). Incluir test unitarios para cada una de las rutas haciendo uso de la librería
https://github.com/visionmedia/supertest
*/
request(app)
  .get('/api/employees')
  .expect('Content-Type', /json/)
  //.expect('Content-Length', '1574')
  .expect(200)
  .end(function(err, res) {
    if (err) throw err;
  });
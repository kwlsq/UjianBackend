const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'Vincentius',
    password: 'Vincent1234',
    database: 'tokokasih'
});                     //make mysql

const PORT = 4000;

const app = express()

app.use(cors())
app.use(bodyParser.json())



//==============================================================================
//CRUD untuk table categories
//Get all columns
app.get('/categories',(req,res)=>{
    const query = `SELECT * FROM categories`
    connection.query(query,(err,results)=>{
        if(err){
            return res.send(500).send(err)
        }
        res.status(200).send(results)
    })
})

//Add new category
app.post('/categories',(req,res)=>{
    const query = `INSERT INTO categories SET ?`

    connection.query(query,req.body,(err,results)=>{ 
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})

//Edit category
app.put('/categories/:id',(req,res)=>{
    const query = `UPDATE categories SET ? WHERE id = ${connection.escape(req.params.id)}`

    connection.query(query, req.body, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }
        
        res.status(200).send(results)
    })
})

//Delete category
app.delete('/categories/:id',(req,res)=>{
    const query = `DELETE FROM categories WHERE id = ${connection.escape(req.params.id)}`

    connection.query(query, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})



//==============================================================================
//CRUD untuk table products
//Get all columns
app.get('/products',(req,res)=>{
    const query = `SELECT * FROM products`
    connection.query(query,(err,results)=>{
        if(err){
            return res.send(500).send(err)
        }
        res.status(200).send(results)
    })
})

//Add new product
app.post('/products',(req,res)=>{
    const query = `INSERT INTO products SET ?`

    connection.query(query,req.body,(err,results)=>{ 
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})

//Edit product
app.put('/products/:id',(req,res)=>{
    const query = `UPDATE products SET ? WHERE id = ${connection.escape(req.params.id)}`

    connection.query(query, req.body, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})

//Delete category
app.delete('/products/:id',(req,res)=>{
    const query = `DELETE FROM products WHERE id = ${connection.escape(req.params.id)}`

    connection.query(query, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})



//==============================================================================
//CRUD untuk table productcat
//Get all productcat
app.get('/productcat',(req,res)=>{
    const query = `SELECT * FROM products`
    connection.query(query,(err,results)=>{
        if(err){
            return res.send(500).send(err)
        }
        res.status(200).send(results)
    })
})

//Add productcat
//user pilih leaf, dapet id leaf nya
//untuk tampilin leaf categories dan parents pake ini
app.post('/productcat/:leafid/:prodid',(req,res)=>{
    const query = `WITH RECURSIVE category_path (id, category, parentId) AS
    (
      SELECT id, category, parentId
        FROM categories
        WHERE id = ${req.params.leafid} 
      UNION ALL
      SELECT c.id, c.category, c.parentId
        FROM category_path AS cp JOIN categories AS c
          ON cp.parentId = c.id
    )
    SELECT * FROM category_path`
    connection.query(query,(err,results)=>{
        if(err){
            return res.send(500).send(err)
        }
        console.log(results)
        // //setelah dapet id category nya, tinggal dimasukin ke productcat bareng dengan productid
        const query2 = `INSERT INTO productcat (categoryId,productId) values ? `
        console.log(req.params.prodid)
        connection.query(query2,[[results,req.params.prodid]],(err,results2)=>{
            if(err){
                return res.send(500).send(err)
            }
            console.log(results2)  
            res.status(200).send(results2)
        })
    })
})

//Edit productcat
app.put('/productcat/:productid',(req,res)=>{
    const query = `UPDATE productcat SET ? WHERE productId = ${connection.escape(req.params.id)}`

    connection.query(query, req.body, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})

//delete productcat
app.delete('/productcat/:productid',(req,res)=>{
    const query = `DELETE FROM products WHERE productId = ${connection.escape(req.params.id)}`

    connection.query(query, (err,results)=>{
        if(err){
            return res.status(500).send(err)
        }

        res.status(200).send(results)
    })
})





app.listen(PORT, ()=>console.log(`Api Berhasil Aktif di PORT ${PORT}`))
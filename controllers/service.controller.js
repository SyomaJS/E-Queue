const pool = require("../config/db");


const addService = async(req, res)=>{
    try {
    const  {service_name, service_price} = req.body;

    const newService = await pool.query(
        `INSERT INTO service (service_name, service_price) VALUES ($1, $2) RETURNING *`,
        [
            service_name, service_price
        ]
    );
    console.log(newService);
    res.status(200).json(newService.rows);
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}


const getService = async(req, res)=>{
    try {
        const newService = await pool.query(
            `SELECT * FROM service`
        );
        res.status(200).json(newService.rows)
    } catch(error){
        res.status(500).json(`Server is Error ${error}`)
    }
}


const updateService = async(req, res)=>{
    try {
        const id = req.params.id;
        const {service_name, service_price} = req.body;
        const newService = await pool.query(
            `UPDATE service SET service_name=$1, service_price=$2 WHERE id=$3 RETURNING *`,
            [
                service_name, service_price, id
            ]
        );
        res.status(200).json(newService.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}


const deleteService = async(req, res)=>{
    try {
        const id = req.params.id;
        const newService = await pool.query(
            `DELETE FROM service WHERE id=$1`,
            [
                id
            ]
        );
        if(!newService || !newService.rowCount>0){
            return res.status(400).send({
                message: "Not found id"
            })
        }
        res.status(200).send({
            message: "Delete Success"
        });
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}




module.exports = {
    addService,
    getService,
    updateService,
    deleteService,
}
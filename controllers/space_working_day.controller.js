const pool = require("../config/db");



// space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time


const addSpaceWD = async(req, res)=>{
    try {
        const {space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time} = req.body;

        const newSpaceWD = await pool.query(
            `INSERT INTO space_working_day (space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [
                space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time
            ]
        );
        console.log(newSpaceWD);
        res.status(200).json(newSpaceWD.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}






const getSpaceWD = async(req, res)=>{
    try {
        const newSpaceWD = await pool.query(
            `SELECT * FROM space_working_day`
        );
        res.status(200).json(newSpaceWD.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}



const updateSpaceWD = async(req, res)=>{
    try {
        const id = req.params.id;
        const {space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time} = req.body;
        const newSpaceWD = await pool.query(
            `UPDATE space_working_day SET space_id = $1, day_of_week = $2, start_time= $3, finish_time= $4, rest_start_time= $5, rest_finish_time= $6 WHERE id=$7 RETURNING *`,
            [
                space_id, day_of_week, start_time, finish_time, rest_start_time, rest_finish_time, id
            ]
        );
        res.status(200).json(newSpaceWD.rows)
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`)
    }
}





const deleteSpaceWD = async(req, res)=>{
    try {
        const id = req.params.id;
        const newSpaceWD = await pool.query(
            `DELETE FROM space_working_day WHERE id=$1`,
            [
                id
            ]
        )
        if(!newSpaceWD || newSpaceWD.rowCount>0){
            return res.status(400).send({
                message: "Not found id"
            })
        }
        res.status(200).send({
            message: "Delete successfully"
        });
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}






module.exports = {
    addSpaceWD,
    getSpaceWD,
    updateSpaceWD,
    deleteSpaceWD,
}
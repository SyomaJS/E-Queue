const pool = require("../config/db");


// user_id, user_os, user_device, hashed_refresh_token, table_name

const addToken = async(req, res)=>{
    try {
        const {user_id, user_os, user_device, hashed_refresh_token, table_name} = req.body;

        const newToken = await pool.query(
            `INSERT INTO token (user_id, user_os, user_device, hashed_refresh_token, table_name) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [
                user_id, user_os, user_device, hashed_refresh_token, table_name
            ]
        );
        console.log(newToken);
        res.status(200).json(newToken.rows);
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}



const getToken = async(req, res)=>{
    try {
        const newToken = await pool.query(
            `SELECT * FROM token`
        );
        res.status(200).json(newToken.rows)
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`)
    }
}



const updateToken = async(req, res)=>{
    try {
        const id = req.params.id;
        const {user_id, user_os, user_device, hashed_refresh_token, table_name} = req.body;
        const newToken = await pool.query(
            `UPDATE token SET user_id=$1, user_os=$2, user_device=$3, hashed_refresh_token=$4, table_name=$5 WHERE id=$6 RETURNING *`,
            [
                user_id, user_os, user_device, hashed_refresh_token, table_name,
                id
            ]
        );
        res.status(200).json(newToken.rows);
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`)
    }
}




const deleteToken = async(req, res)=>{
    try {
        const id = req.params.id;
        const newToken = await pool.query(
            `DELETE FROM token WHERE id=$1 RETURNING *`,
            [
                id
            ]
        )
        if(!newToken || !newToken.rowCount>0){
            return res.status(400).send({
                message: "Not Found id"
            })
        }
        res.status(200).send({
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json(`Server is Error ${error}`)
    }
}






module.exports = {
    addToken,
    getToken,
    updateToken,
    deleteToken,
}
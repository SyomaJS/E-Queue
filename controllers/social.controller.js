const pool = require("../config/db");


const addSocial = async(req, res)=>{
    try {
        const {social_name, social_icon_file} = req.body;

        const newSocial = await pool.query(
            `INSERT INTO social (social_name, social_icon_file) VALUES ($1, $2) RETURNING *`,
            [
                social_name, social_icon_file
            ]
        );
        console.log(newSocial);
        res.status(200).json(newSocial.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}


const getSocial = async(req, res)=>{
    try {
        const newSocial = await pool.query(
            `SELECT * FROM social`
        );
        res.status(200).json(newSocial.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}


const updateSocial = async(req, res)=>{
    try {
        const id = req.params.id;
        const {social_name, social_icon_file} = req.body;
        const newSocial = await pool.query(
            `UPDATE social social_name=$1, social_icon_file=$2 WHERE id=$3 RETURNING *`,
            [
                social_name, social_icon_file
            ]
        );
        res.status(200).json(newSocial.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}




const deleteSocial = async(req, res)=>{
    try {
        const id = req.params.id;
        const newSocial = await pool.query(
            `DELETE FROM social WHERE id=$1 RETURNING *`,
            [
                id
            ]
        )
        if(!newSocial || !newSocial.rowCount>0){
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
    addSocial,
    getSocial,
    updateSocial,
    deleteSocial,
}
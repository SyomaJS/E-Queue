const pool = require("../config/db");



// spec_position spec_last_name spec_first_name spec_middle_name spec_birth_day spec_photo spec_phone_number spec_info spec_is_active show_position show_last_name show_first_name show_middle_name show_phota show_social show_info show_birth_day show_phone_number otp_id


const addSpecialist = async(req, res)=>{
    try {
        const { spec_position, spec_last_name, spec_first_name, spec_middle_name, spec_birth_day, spec_photo, spec_phone_number, spec_info, spec_is_active, show_position, show_last_name, show_first_name, show_middle_name, show_phota, show_social, show_info, show_birth_day, show_phone_number, otp_id } = req.body;

        const newSpecialist = await pool.query(
            `INSERT INTO specialist (spec_position, spec_last_name, spec_first_name, spec_middle_name, spec_birth_day, spec_photo, spec_phone_number, spec_info, spec_is_active, show_position, show_last_name, show_first_name, show_middle_name, show_phota, show_social, show_info, show_birth_day, show_phone_number, otp_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19) RETURNING *`,
            [
                spec_position, spec_last_name, spec_first_name, spec_middle_name, spec_birth_day, spec_photo, spec_phone_number, spec_info, spec_is_active, show_position, show_last_name, show_first_name, show_middle_name, show_phota, show_social, show_info, show_birth_day, show_phone_number, otp_id
            ]
        );
        console.log(newSpecialist);
        res.status(200).json(newSpecialist.rows);
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}




const getSpecialist = async(req, res)=>{
    try {
        const newSpecialist = await pool.query(
            `SELECT * FROM specialist`
        );
        res.status(200).json(newSpecialist.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}




const updateSpecialist = async(req, res)=>{
    try {
        const id = req.params.id;
        const {spec_position, spec_last_name, spec_first_name, spec_middle_name, spec_birth_day, spec_photo, spec_phone_number, spec_info, spec_is_active, show_position, show_last_name, show_first_name, show_middle_name, show_phota, show_social, show_info, show_birth_day, show_phone_number, otp_id} = req.body;
        const newSpecialist = await pool.query(
            `UPDATE specialist SET spec_position=$1, spec_last_name=$2, spec_first_name=$3, spec_middle_name=$4, spec_birth_day=$5, spec_photo=$6, spec_phone_number=$7, spec_info=$8, spec_is_active=$9, show_position=$10, show_last_name=$11, show_first_name=$12, show_middle_name=$13, show_phota=$14, show_social=$15, show_info=$16, show_birth_day=$17, show_phone_number=$18, otp_id=$19 WHERE id=$20 RETURNING *`,
            [
                spec_position, spec_last_name, spec_first_name, spec_middle_name, spec_birth_day, spec_photo, spec_phone_number, spec_info, spec_is_active, show_position, show_last_name, show_first_name, show_middle_name, show_phota, show_social, show_info, show_birth_day, show_phone_number, otp_id,
                id
            ]
        );
        res.status(200).json(newSpecialist.rows)
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}



const deleteSpecialist = async (req, res)=>{
    try {
        const id = req.params.id;
        const newSpecialist = await pool.query(
            `DELETE FROM specialist WHERE id=$1`,
            [
                id
            ]
        );
        if(!newSpecialist || !newSpecialist.rowCount>0){
            return res.status(400).send({
                message: "Not found id"
            })
        }
        res.status(200).send({
            message: "Successfully deleted"
        });
    } catch (error){
        res.status(500).json(`Server is Error ${error}`)
    }
}





module.exports = {
    addSpecialist,
    getSpecialist,
    updateSpecialist,
    deleteSpecialist,
}
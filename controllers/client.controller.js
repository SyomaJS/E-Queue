const pool = require("../config/db");
const DeviceDetector = require("node-device-detector");
const DeviceHelper = require("node-device-detector/helper");

const addClient = async (req, res) => {
  try {
    const {
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo,
    } = req.body;

    const newClient = await pool.query(
      `INSERT INTO client (client_last_name, client_first_name, client_phone_number, client_info, client_photo) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,
      ]
    );
    console.log(newClient);
    res.status(200).json(newClient.rows);
  } catch (error) {
    res.status(500).json(`Server is Error ${error}`);
  }
};

const getClient = async (req, res) => {
  try {
    const detector = new DeviceDetector({
      clientIndexes: true,
      deviceIndexes: true,
      deviceAliasCode: false,
    });

    const userAgent = req.headers["user-agent"];
    const resultOC = detector.detect(userAgent);

    // console.log('Is desctop ',DeviceHelper.isDesktop(resultOC));

    const newClient = await pool.query(`SELECT * FROM client`);
    res.status(200).json(newClient.rows);
  } catch (error) {
    res.status(500).json(`Server is Error ${error}`);
  }
};

const updateClient = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      client_last_name,
      client_first_name,
      client_phone_number,
      client_info,
      client_photo,
    } = req.body;
    const newClient = await pool.query(
      `UPDATE client SET 
            client_last_name=$1, client_first_name=$2, client_phone_number=$3, client_info=$4, client_photo=$5 WHERE id=$6 RETURNING *`,
      [
        client_last_name,
        client_first_name,
        client_phone_number,
        client_info,
        client_photo,
        id,
      ]
    );
    res.status(200).json(newClient.rows);
  } catch (error) {
    res.status(500).json(`Server is Error ${error}`);
  }
};

const deleteClient = async (req, res) => {
  try {
    const id = req.params.id;
    const newClient = await pool.query(`DELETE FROM client WHERE id=$1`, [id]);
    if (!newClient || !newClient.rowCount > 0) {
      return res.status(400).send({
        message: "Not found id",
      });
    }
    res.status(200).send({
      message: "Deleted successfully",
    });
  } catch (error) {
    res.status(500).json(`Server is Error ${error}`);
  }
};


module.exports = {
  addClient,
  getClient,
  updateClient,
  deleteClient,
};
const { encode, decode } = require("../services/crypt");
const { v4: uuidv4 } = require("uuid");
const pool = require("../config/db");
const otpGenerator = require("otp-generator");
const AddMinutesToDate = require("../helpers/ad_minutes");
const dates = require("../helpers/dates");
const myJwt = require("../services/JwtService");
const DeviceDetector = require("node-device-detector");
const bcrypt = require("bcrypt");
const config = require("config");

const newOTP = async (req, res) => {
  const { phone_number } = req.body;

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const now = new Date();
  const expiration_time = AddMinutesToDate(now, 3);

  const newOTP = await pool.query(
    `INSERT INTO otp (id, otp, expiration_time) VALUES ($1, $2, $3)RETURNING id;`,
    [uuidv4(), otp, expiration_time]
  );

  const details = {
    timestamp: now,
    check: phone_number,
    success: true,
    message: "OTP sent to user",
    otp_id: newOTP.rows[0].id,
  };

  const encoded = await encode(JSON.stringify(details));
  return res.send({ Status: "Success", Details: encoded });
};

const verifyOTP = async (req, res) => {
  const { verification_key, otp, check } = req.body;
  var currentdate = new Date();
  let decoded;
  try {
    decoded = await decode(verification_key);
  } catch (err) {
    const response = { Status: "Failure", Details: "Bad Request" };
    return res.status(400).send(response);
  }

  var obj = JSON.parse(decoded);

  //! DETECTOR__________________________
  const detector = new DeviceDetector({
    clientIndexes: true,
    deviceIndexes: true,
    deviceAliasCode: false,
  });

  const number = obj.check;

  if (number != check) {
    const response = {
      Status: "Failure",
      Details: "OTP was not sent to this particular phone_number",
    };
    return res.status(400).send(response);
  }

  const otpResult = await pool.query(`SELECT * FROM otp WHERE id=$1`, [
    obj.otp_id,
  ]);
  const result = otpResult.rows[0];
  if (result != null) {
    if (result.verified != true) {
      if (dates.compare(result.expiration_time, currentdate) == 1) {
        if (otp === result.otp) {
          await pool.query(`UPDATE otp SET verified=$2 WHERE id=$1`, [
            result.id,
            true,
          ]);

          const clientResult = await pool.query(
            `SELECT * FROM client WHERE client_phone_number = $1`,
            [check]
          );

          let client_id, details, tokens;

          if (clientResult.rows.length == 0) {
            details = "new";
            const newClient = await pool.query(
              `INSERT INTO client (client_phone_number, otp_id) VALUES ($1, $2) returning id`,
              [check, obj.otp_id]
            );

            client_id = newClient.rows[0].id;

            //? const userAgent = req.headers["user-agent"];
            //? const resultOC = detector.detect(userAgent);
          } else {
            details = "old";
            client_id = clientResult.rows[0].id;
            await pool.query(`UPDATE client SET otp_id = $1 WHERE id = $2 `, [
              obj.otp_id,
              client_id,
            ]);
          }

          const payload = {
            id: client_id,
          };

          const userAgent = req.headers["user-agent"];
          const resultOC = detector.detect(userAgent);
          console.log(resultOC);

          tokens = myJwt.generateTokens(payload);
          query = `INSERT INTO token (table_name, user_id, user_oc, user_device,  hashed_refresh_token ) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
          const inserToken = await pool.query(query, [
            "client",
            client_id,
            resultOC.os,
            resultOC.device,
            bcrypt.hashSync(tokens.refreshToken, 7),
          ]);

          const response = {
            Status: "Success",
            Details: details,
            Check: check,
            token: tokens.accessToken,
          };

          //Cookie:
          res.cookie("refreshToken", tokens.refreshToken, {
            maxAge: config.get("refresh_ms"),
            httpOnly: true,
          });

          return res.status(200).send(response);
        } else {
          const response = { Status: "Failure", Details: "OTP NOT Matched" };
          return res.status(400).send(response);
        }
      } else {
        const response = { Status: "Failure", Details: "OTP Expired" };
        return res.status(400).send(response);
      }
    } else {
      const response = { Status: "Failure", Details: "OTP Already Used" };
      return res.status(400).send(response);
    }
  } else {
    const response = { Status: "Failure", Details: "Bad Request" };
    return res.status(400).send(response);
  }
};

const deleteOTP = async (req, res) => {
  try {
    const { id } = req.params.id;
    const query = `delete from otp where id = $1 returning *`;
    const result = await pool.query(query, [id]);
    console.log(result);
    res.send("Ok");
  } catch (error) {
    console.log(error);
    return res.status(400).send("Internal Server Error");
  }
};

const newOTPmail = async (req, res) => {
  const { email } = req.body;

  const otp = otpGenerator.generate(4, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  const now = new Date();
  const expiration_time = AddMinutesToDate(now, 3);

  const newOTP = await pool.query(
    `INSERT INTO otp (id, otp, expiration_time) VALUES ($1, $2, $3)RETURNING id;`,
    [uuidv4(), otp, expiration_time]
  );

  const details = {
    timestamp: now,
    check: email,
    success: true,
    message: "OTP sent to user",
    otp_id: newOTP.rows[0].id,
  };

  const encoded = await encode(JSON.stringify(details));
  return res.send({ Status: "Success", Details: encoded });
};

module.exports = {
  newOTP,
  verifyOTP,
  deleteOTP,
};

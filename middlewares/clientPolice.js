const myJwt = require("../services/JwtService");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const { TokenExpiredError } = require("jsonwebtoken");

module.exports = async function (req, res, next) {
  if (req.method == "OPTIONS") {
    next();
    return;
  }

  try {
    const authorization = req.headers.authorization;

    if (!authorization) {
      return res.status(403).json({ message: "Client is not authorized" });
    }

    const [bearer, token] = authorization.split(" ");

    if (bearer != "Bearer" || !token) {
      return res
        .status(403)
        .json({ message: "Client is not authorized (token not given)" });
    }

    const [error, decodedData] = await to(myJwt.verifyAccess(token));

    if (error instanceof TokenExpiredError) {
      const refreshToken = req.cookies.refreshToken;

      if (!refreshToken) {
        return res
          .status(403)
          .json({ message: "Client is not authorized (token expired)" });
      }

      const [error, decodedData] = await to(myJwt.verifyAccess(refreshToken));

      if (error) {
        return res
          .status(403)
          .json({ message: "Client is not authorized(verify failed)" });
      }

      const query = `select * from token where user_id = ${decodedData.id}`;

      const tokenDb = await pool.query(query);

      if (!tokenDb.rowCount) {
        return res
          .status(403)
          .json({ message: "Client is not authorized (Row count)" });
      }

      const resultCompare = bcrypt.compareSync(
        refreshToken,
        tokenDb.rows[0].hashed_refresh_token
      );

      if (resultCompare) {
        return res
          .status(403)
          .json({ message: "Client is not authorized (compare failded)" });
      }

      const payload = {
        id: decodedData.id,
      };

      const tokens = myJwt.generateTokens(payload);
      const resultUpdToken = await pool.query(
        `
      update token set hashed_refresh_token = $1 where user_id = $2
      `,
        [bcrypt.hashSync(tokens.refreshToken, 7), tokenDb.rows[0].id]
      );

      res.cookie("refreshToken", tokens.refreshToken, {
        maxAge: 3000000,
        httpOnly: true,
      });
      return res.status(200).json({ ...tokens });
    } else if (error) {
      return res.status(403).json({ message: error.message });
    }

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).send({ message: "Wrong token" });
  }
};

async function to(promise) {
  return promise.then((response) => [null, response]).catch((error) => [error]);
}

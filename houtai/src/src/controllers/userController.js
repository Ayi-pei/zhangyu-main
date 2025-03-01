const pool = require('../utils/db');

exports.login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM "User" WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ message: '登录成功', user: result.rows[0] });
        } else {
            res.status(401).json({ message: '用户名或密码错误' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
};

exports.register = async (req, res) => {
    const { username, password } = req.body;

    try {
        const userCheck = await pool.query('SELECT * FROM "User" WHERE username = $1', [username]);
        if (userCheck.rows.length > 0) {
            return res.status(400).json({ message: '用户名已存在' });
        }

        await pool.query('INSERT INTO "User" (username, password, role) VALUES ($1, $2, $3)', [username, password, 'user']);
        res.json({ message: '注册成功' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '服务器错误' });
    }
};

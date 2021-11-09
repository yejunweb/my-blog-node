const express = require('express')
const router = express.Router()
const User = require('../models/userModel')
const md5 = require('../utils/md5')

/**
 * 用户注册
 * @param username [String] 用户名
 * @param password [String] 用户密码
 * @param role     [Number] 用户角色
 */
router.post('/register', async (req, res) => {
    // 重复用户检查
    const { username, password, role } = req.body
    const result = await User.findAll({
        where: {
            username: username,
        },
    })
    if (result.length) return res.sendResult(201, null, '用户名重复')
    // 新增用户
    User.create({
        username,
        password: md5(password),
        role,
    })
    .then(() => {
        res.sendResult(200, null, '新增成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

/**
 * 用户信息修改
 * @param id       [Number] 用户id
 * @param username [String] 用户名
 * @param password [String] 用户密码
 * @param role     [Number] 用户角色
 */
router.post('/setInfo', async (req, res) => {
    const { id, username, password, role } = req.body
    const result = await User.findOne({
        where: {
            username: username,
        },
    })
    if (result && result.id !== id) {
        return res.sendResult(201, null, '用户名重复')
    }
    User.update(
        {
            username,
            password: md5(password),
            role,
        },
        {
            where: {
                id,
            },
        }
    )
    .then(() => {
        res.sendResult(200, null, '修改成功')
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

/**
 * 获取用户信息
 */
router.post('/getInfo', (req, res) => {
    User.findOne({
        where: {
            id: req.userInfo.uid,
        },
    })
    .then((data) => {
        const { id, username, role } = data
        res.sendResult(null, 200, {
            id,
            username,
            role,
        })
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})


/**
 * 获取用户列表
 */
router.post('/list', (req, res) => {
    User.findAll()
    .then((data) => {
        res.sendResult(null, 200, data)
    })
    .catch((error) => {
        res.sendResult(502, null, error.parent.sqlMessage || error)
    })
})

module.exports = router

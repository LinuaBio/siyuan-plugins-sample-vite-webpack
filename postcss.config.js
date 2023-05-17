module.exports = {
    plugins: [
        require("autoprefixer")({
            // 根据 Can I Use 上的浏览器市场份额数据，自动添加兼容性前缀
            "overrideBrowserslist": [
                "> 1%",
                "last 2 versions",
                "not ie <= 8"
            ]
        })
    ]
};
module.exports.getBlog = async () => {

    return {
        name: "blog 1",
        topic: "Programming"
    }
}

module.exports.listBlog = async () => {

    return [{
        name: "blog 1",
        topic: "Programming"
    },
    {
        name: "blog 2",
        topic: "Writing"
    }]
}
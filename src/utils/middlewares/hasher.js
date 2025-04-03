const hasher = (data) => {
    return {body:btoa(JSON.stringify(data))}
}

module.exports = hasher
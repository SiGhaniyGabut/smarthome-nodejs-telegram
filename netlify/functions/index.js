exports.handler = async (event, context, req, res) => {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Welcome to SmartHome!' })
    }
}
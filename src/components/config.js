const config = {
    'host': `${process.env.REACT_APP_BACKEND_HOST}` || 'http://127.0.0.1',
    'port': `${process.env.REACT_APP_BACKEND_PORT}` || '8000'
}

export default config;
const config = {
    'host': process.env.REACT_APP_BACKEND_HOST || 'http://0.0.0.0',
    'port': process.env.REACT_APP_BACKEND_PORT || '8090',
    'environment': process.env.REACT_APP_ENVIRONMENT || 'local'
}

export default config;

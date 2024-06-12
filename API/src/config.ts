import dotenv from 'dotenv';
dotenv.config();
const Config = () => {
    const port  =  process.env.PORT || 5000;
    const externalPort = process.env.EXTERNAL_PORT || 8080;
    const domain = process.env.DOMAIN || "http://localhost";
    const externalDomain = process.env.EXTERNAL_DOMAIN || "http://localhost";
    
    
    return {
        port: parseInt(port.toString()),
        externalPort: parseInt(externalPort.toString()),
        domain: domain,
        externalDomain: externalDomain,
        address: `${domain}:${port}`,
        externalAddress: `${externalDomain}:${externalPort}`,
        staticEndpoint: `/static`,
    }
}
export default Config();
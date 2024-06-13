const Config = () => {
    const port  =  import.meta.env.VITE_PORT || 3000;
    const externalPort = import.meta.env.VITE_EXTERNAL_PORT || 8080;
    const domain = import.meta.env.VITE_DOMAIN || "http://localhost";
    const externalDomain = import.meta.env.VITE_EXTERNAL_DOMAIN || "http://localhost";
    
    return {
        port: parseInt(port.toString()),
        externalPort: parseInt(externalPort.toString()),
        domain: domain,
        externalDomain: externalDomain,
        address: `${domain}:${port}`,
        externalAddress: `${externalDomain}:${externalPort}`
    }
}
export default Config();